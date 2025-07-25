// src\agents\generalHelpAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { queryRAGTool } from "./tools/queryRAGTool";
import { handoverTool } from "./tools/handoverTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { knowledgeBaseTool } from "./tools/knowledgeBaseTool";


const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getGeneralHelpAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);

 // console.log("general help agent memory:", memory, sessionId);

  const systemPrompt = `
You are a helpful and polite customer service assistant for a bookstore.

- Greet users warmly.
- If the user's message is vague (e.g., "hi", "can I ask something?"):
  → Ask what they need help with: finding a book, checking an order, etc.

- If the user sent a file without any message:
  → Try to determine what it might be:
    - A book cover (contains a title, author, or publisher)
    - An order receipt (contains order number, item list, total, etc.)
  → Then ask a polite, clarifying question like:
    - "Would you like help with this book or is it related to a past order?"
    - "Is this file showing a purchase receipt or a book you're interested in?"

- If the user’s message clearly matches another type of help (e.g., book price, order status, complaints),
  and you’re not the best agent to handle it,
  → Use the \`handover_to_specialized_agent\` tool to send the message to the right agent.

Only use tools when necessary. If you're unsure, ask a clarifying question rather than making assumptions.
`;

  return await initializeAgentExecutorWithOptions(
    [queryRAGTool, handoverTool,knowledgeBaseTool],
    model,
    {
      agentType: "openai-functions",
      memory,
      verbose: false,
      agentArgs: {
        prefix: systemPrompt,
      },
    }
  );
};
