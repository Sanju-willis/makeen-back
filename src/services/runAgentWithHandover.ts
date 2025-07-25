// src\services\runAgentWithHandover.ts
import { updateSessionIntent } from "@/utils/sessionId";
import { getExecutorForIntent } from "@/agents/executorRouter";

export async function runAgentWithHandover(agent: any, sessionId: string, input: string) {
  console.log("🤖 Calling initial agent with input:", input);

  let result: any;

  try {
    result = await agent.call({ input });
    console.log("✅ Initial agent result:", result);
  } catch (err) {
    console.error("❌ Error during initial agent call:", err);
    throw err;
  }

  // Parse if tool returned a JSON string
  try {
    if (typeof result === "string") {
      result = JSON.parse(result);
      console.log("🧾 Parsed agent result (from JSON string):", result);
    }
  } catch (parseError) {
    console.warn("⚠️ Failed to parse agent result:", result);
  }

  if (result?.__handover__) {
    const { newIntent, message } = result;
    console.log("🔁 Handover requested → Switching to:", newIntent);

    try {
      updateSessionIntent({ sessionId, intent: newIntent });

      const newAgent = await getExecutorForIntent(newIntent, sessionId);
      console.log("📦 New agent retrieved. Calling with message:", message);

      const followup = await newAgent.call({ input: message });
      console.log("✅ New agent result:", followup);

      return followup;
    } catch (handoverErr) {
      console.error("❌ Error during handover to new agent:", handoverErr);
      throw handoverErr;
    }
  }

  return result;
}
