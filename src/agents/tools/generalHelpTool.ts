// src\tools\generalHelpTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const generalHelpTool = new DynamicStructuredTool({
  name: "generalHelpTool",
  description: "Answer general help questions about the bookstore.",
  schema: z.object({
    question: z.string(),
  }),
  func: async ({ question }) => {
    // Replace with FAQ lookup if needed
    return `🤖 Here's a helpful answer to: "${question}"`;
  },
});
