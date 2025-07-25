// src/agents/complaintAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { complaintTool } from "./tools/complaintTool";
import { handoverTool } from "./tools/handoverTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

export const getComplaintAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);

  const systemPrompt = new SystemMessage(`
You are an empathetic and supportive customer service assistant for Makeen Bookstore.

Your job is to help users clearly and respectfully log their complaints.
Always acknowledge their concern first with empathy before collecting details.

If the complaint is not within your scope (e.g., it's about tracking an order or asking for a book), use the \`handover_to_specialized_agent\` tool to route it.

Example responses:
- "I'm really sorry to hear that. Let me help you resolve it."
- "Thanks for bringing this to our attention. Can you tell me more about what went wrong?"

Use the \`complaintTool\` when the complaint is valid and complete.
Be concise, understanding, and helpful at all times.
  `);

  return await initializeAgentExecutorWithOptions(
    [complaintTool, handoverTool],
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
