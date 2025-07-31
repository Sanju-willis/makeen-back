// src\agents\orderStatusAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { orderStatusTool } from "./tools/orderStatusTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { SystemMessage } from "@langchain/core/messages";
import { handoverTool } from "./tools/handoverTool";


const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getOrderStatusAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);
  const context = (memory as any).__context || {};

  console.log("🔍 Initializing Order Status Agent with memory:", context);

const systemPrompt = new SystemMessage(`
You are currently the ORDER STATUS AGENT.

🎯 Your job is to help users check their order status using:
- Order ID
- Name
- Email

✅ Use the orderStatusTool when the user provides order-related info.

🛑 If the user asks something unrelated to orders (like book prices, recommendations, or help), use the handover_to_specialized_agent tool:
- Only hand over if it's clearly NOT about order status
- Set newIntent to one of: "book_inquiry", "general_help"
- Include originalInput exactly as received

⛔ Do NOT use handover if the user is asking about order status. You're already in the right place.

If unsure, ask a clarifying question.
`);



  return await initializeAgentExecutorWithOptions(
    [orderStatusTool(context), handoverTool],
    model,
    {
      agentType: "openai-functions",
      memory,
      verbose: false,
      agentArgs: {
        systemMessage: systemPrompt,
      },
    }
  );
};
