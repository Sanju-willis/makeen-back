// src\agents\orderStatusAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { orderStatusTool } from "../tools/orderStatusTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getOrderStatusAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);
  const context = (memory as any).__context || {};

  console.log("🔍 Initializing Order Status Agent with memory:", context);

  const systemPrompt = new SystemMessage(`
You are a customer service AI for a bookstore. 
Assist users with checking order status using their order ID, name, or email.
Use the orderStatusTool if needed. Be polite, concise, and avoid guessing.
  `);

  return await initializeAgentExecutorWithOptions(
    [orderStatusTool(context)],
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
