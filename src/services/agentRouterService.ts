// src\services\agentRouterService.ts
import { classifyIntent } from "./intentClassifier";
import { getExecutorForIntent } from "../agents/executorRouter";
import { AgentRouteInput } from "../types/service-types";
import { getOrCreateSessionId, updateSessionIntent } from "../utils/sessionId"; // ⬅️ include update
import { updateMemoryContext } from "@/memory/updateMemoryContext";

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

  updateMemoryContext(sessionId, {
    intent: intent.type,
    bookTitle: intentResult?.content?.data?.title,
    author: intentResult?.content?.data?.author,
    orderId: intentResult?.content?.data?.orderId,
    name: user.name,
    email: intentResult?.content?.data?.email,
    complaintText: intentResult?.content?.data?.complaintText,
    platform: user.platform,
  });

  const executor = await getExecutorForIntent(intent.type, sessionId);

  const result = await executor.invoke({ input: message.userInput });

  console.log("🔧 Agent invoke:", message.userInput);

  return {
    output: result.output ?? result,
  };
};
