// src\agents\tools\handoverTool.ts

import { z } from "zod";
import { StructuredTool } from "langchain/tools";

export class HandoverTool extends StructuredTool {
  name = "handover_to_specialized_agent";

  description = `
Call this if the user's request clearly belongs to another agent.
Use this to switch to one of the following agents:
- book_inquiry (e.g., book price, finding books)
- order_status (e.g., checking delivery or order issues)
- general_help (e.g., general bookstore questions)

Also provide the user's original message in 'originalInput' to help the new agent understand the context.
`;

  schema = z.object({
    newIntent: z.enum(["book_inquiry", "order_status", "general_help"]),
    message: z.string().describe("A short summary to guide the new agent"),
    originalInput: z
      .string()
      .describe("The original user message that triggered the handover"),
  });

  returnDirect = true;

  async _call({
    newIntent,
    message,
    originalInput,
  }: {
    newIntent: string;
    message: string;
    originalInput: string;
  }): Promise<string> {
    console.log("🔁 HandoverTool triggered:");
    console.log("➡️ newIntent:", newIntent);
    console.log("📝 message:", message);
    console.log("🗣️ originalInput:", originalInput);

    return JSON.stringify({
      __handover__: true,
      newIntent,
      message,
      originalInput,
    });
  }
}

export const handoverTool = new HandoverTool();
