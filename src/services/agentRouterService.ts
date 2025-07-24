// src\services\agentRouterService.ts
import { classifyIntent } from "./intentClassifier";
import { getExecutorForIntent } from "../agents/executorRouter";
import { AgentRouteInput } from "../types/service-types";
import { getOrCreateSessionId, updateSessionIntent } from "../utils/sessionId"; // ⬅️ include update
import { updateMemoryContext } from "@/memory/updateMemoryContext";
import { sendWhatsAppReply } from "@/utils/helpersReply/sendWhatsAppReply"; // ⬅️ import here
import { sendMessengerReply } from "@/utils/helpersReply/sendMessengerReply"; // ⬅️ import here

export const routeToAgent = async ({ user, message }: AgentRouteInput) => {
  const { sessionId, isNew } = getOrCreateSessionId({
    userId: user.id,
    platform: user.platform,
  });

  const intentResult = await classifyIntent({
    userInput: message.userInput,
    extractedText: message.extractedText,
    msgType: message.msgType,
  });

  const { intent } = intentResult;
  console.log("🔍 Classified intent:", intentResult);
  // 🧠 Update session with last intent
  updateSessionIntent({
    sessionId,
    intent: intent.type,
  });

  updateMemoryContext(sessionId, intentResult, user);

  const executor = await getExecutorForIntent(intent.type, sessionId);

  const result = await executor.invoke({ input: message.userInput });

  const reply = result.output ?? result;

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

  console.log(" Agent invoke:", message.userInput);

  return { output: reply };
};
