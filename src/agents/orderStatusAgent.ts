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
You are a customer service AI for a bookstore.

Your main job is to help users check their order status using:
- Order ID
- Name
- Email

✅ Use the orderStatusTool when they provide relevant details.

🛑 If the user is asking about something unrelated to orders (like book prices, product inquiries, or general help), use the handover_to_specialized_agent tool:
- Set newIntent to one of: "book_inquiry", "general_help"
- Set message to summarize the request
- Set originalInput to the user’s exact message

Avoid guessing. If you're not sure, ask a clarifying question.
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
