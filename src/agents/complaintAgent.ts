// src\agents\complaintAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { complaintTool } from "../tools/complaintTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getComplaintAgent = async (
  sessionId: string,
) => {
  const memory = getSessionMemory(sessionId);

  const systemPrompt = new SystemMessage(`
You are a customer service AI for a bookstore.
Help users log complaints clearly and respectfully.
Use the complaintTool if necessary. Always be empathetic and concise.
  `);

  return await initializeAgentExecutorWithOptions([complaintTool], model, {
    agentType: "openai-functions",
    memory,
    verbose: false,
    agentArgs: {
      systemMessage: systemPrompt,
    },
  });
};
