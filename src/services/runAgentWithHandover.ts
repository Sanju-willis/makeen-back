// src\services\runAgentWithHandover.ts
import { updateSessionIntent } from "@/utils/sessionId";
import { getExecutorForIntent } from "@/agents/executorRouter";

function isLikelyJson(str: string): boolean {
  const trimmed = str.trim();
  return trimmed.startsWith("{") && trimmed.endsWith("}");
}

export async function runAgentWithHandover(
  agent: any,
  sessionId: string,
  input: string
) {
  console.log("🤖 Calling initial agent with input:", input);

  let result: any;

  try {
    result = await agent.invoke({ input }); // ✅ safer than `.call`
    console.log("✅ Initial agent result:", result);
  } catch (err) {
    console.error("❌ Error during initial agent call:", err);
    throw err;
  }

  const originalResult = result;

  // ✅ Only parse if it looks like JSON
  if (typeof result?.output === "string" && isLikelyJson(result.output)) {
    console.log("🔍 Checking if result is a JSON string...");
    try {
      const parsed = JSON.parse(result.output);
      if (parsed?.__handover__) {
        console.log("🔁 Handover requested → Updating session intent...");
        result = parsed;
      }
    } catch (parseErr) {
      console.warn("⚠️ Failed to parse result.output as JSON:", result.output);
      console.error("💥 JSON parse error:", parseErr);
    }
  }

  if (result?.__handover__) {
    const { newIntent, message, originalInput } = result;

    try {
      updateSessionIntent({ sessionId, intent: newIntent });

      const newAgent = await getExecutorForIntent(newIntent, sessionId);
      console.log("📦 New agent retrieved. Calling with input:", originalInput || message);

      const followup = await newAgent.invoke({ input: originalInput || message });

      return typeof followup === "string"
        ? { output: followup }
        : followup?.output
        ? { output: followup.output }
        : followup;
    } catch (handoverErr) {
      console.error("❌ Error during handover to new agent:", handoverErr);
      return originalResult;
    }
  }

  return result;
}
