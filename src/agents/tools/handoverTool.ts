// src\agents\tools\handoverTool.ts
import { z } from "zod";
import { StructuredTool } from "langchain/tools";

export class HandoverTool extends StructuredTool {
  name = "handover_to_specialized_agent";
  description =
    "Call this if the user's request clearly belongs to another agent like book inquiry or order status.";

  schema = z.object({
    newIntent: z.enum(["book_inquiry", "order_status", "general_help"]),
    message: z
      .string()
      .describe("The original user message triggering the intent change"),
  });

  async _call({
    newIntent,
    message,
  }: {
    newIntent: string;
    message: string;
  }): Promise<string> {
    console.log("🔁 HandoverTool triggered:");
    console.log("➡️ newIntent:", newIntent);
    console.log("📝 message:", message);

    return JSON.stringify({
      __handover__: true,
      newIntent,
      message,
    });
  }
}

export const handoverTool = new HandoverTool();
