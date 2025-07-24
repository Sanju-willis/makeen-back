// src\agents\generalHelpAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { generalHelpTool } from "../tools/generalHelpTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getGeneralHelpAgent = async (
  sessionId: string,
) => {
  const memory = getSessionMemory(sessionId);
console.log("Creating general help agent with memory:", memory);
  const systemPrompt = `
You are a helpful and polite customer service assistant for a bookstore.
Always answer clearly. Use tools only when necessary.
If unsure, say you don't know instead of making something up.
`;

  return await initializeAgentExecutorWithOptions([generalHelpTool], model, {
    agentType: "openai-functions",
    memory,
    verbose: false,
    agentArgs: {
      prefix: systemPrompt, // this is the actual config it respects
    },
  });
};
