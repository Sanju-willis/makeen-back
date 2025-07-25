// src\agents\generalHelpAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { generalHelpTool } from "../tools/generalHelpTool";
import { getSessionMemory } from "@/memory/sessionMemory";

const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getGeneralHelpAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);

  console.log("general help agent memory:", memory, sessionId);

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

Only use tools when necessary. If you're unsure, ask a clarifying question rather than making assumptions.
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
