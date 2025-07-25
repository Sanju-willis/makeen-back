// src\services\agentRouterService.ts
import { classifyIntent } from "./intentClassifier";
import { getExecutorForIntent } from "../agents/executorRouter";
import { AgentRouteInput } from "../types/service-types";
import {
  getOrCreateSessionId,
  updateSessionIntent,
  getLastSessionIntent,
} from "../utils/sessionId";
import { updateMemoryContext } from "@/memory/updateMemoryContext";
import { sendWhatsAppReply } from "@/utils/helpersReply/sendWhatsAppReply";
import { sendMessengerReply } from "@/utils/helpersReply/sendMessengerReply";
import { runAgentWithHandover } from "./runAgentWithHandover";

export const routeToAgent = async ({ user, message }: AgentRouteInput) => {
  //  console.log("🔄 service:", {user, message, });

  const { sessionId, isNew } = getOrCreateSessionId({
    userId: user.id,
    platform: user.platform,
  });
  console.log("Session ID:", sessionId, "Is new session:", isNew);
  let intentResult;
  if (isNew) {
    // 🧠 Only classify if session is new
    intentResult = await classifyIntent({
      userInput: message.userInput,
      extractedText: message.extractedText,
      msgType: message.msgType,
    });

    updateSessionIntent({
      sessionId,
      intent: intentResult.intent.type,
    });

    updateMemoryContext(sessionId, intentResult, user);
  }
  const lastIntent = getLastSessionIntent(sessionId);
  console.log("Last intent for session:", lastIntent);
  if (!lastIntent) throw new Error("Missing last intent for session.");

  const userInput =
    message.userInput?.trim() ||
    (["image", "video", "document"].includes(message.msgType || "")
      ? `📎 A ${message.msgType} was sent without any text. Ask the user what they'd like to know about it.`
      : "The user sent a message, but no readable text was found.");

  const intentType = intentResult?.intent.type || lastIntent;

  const executor = await getExecutorForIntent(intentType, sessionId);
  
  const result = await runAgentWithHandover(executor, sessionId, userInput);

  console.log(" Agent invoke:", userInput);

const reply =
  typeof result === "string"
    ? result
    : result.output ?? result;

  // 🔁 Respond to user on correct platform
  switch (user.platform) {
    case "whatsapp":
      await sendWhatsAppReply(user.id, reply);
      break;
    case "messenger":
      await sendMessengerReply(user.id, reply);
      break;
    default:
      console.warn(`⚠️ Unknown platform: ${user.platform}`);
  }

  return { output: reply };
};
