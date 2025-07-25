// src\agents\tools\queryRAGTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { queryKnowledgeBase } from "@/services/rag/queryKB";

export const queryRAGTool = new DynamicStructuredTool({
  name: "query_rag_tool",
  description: "Use this to answer general bookstore questions using the knowledge base (e.g., owner info, hours, policies).",
  schema: z.object({
    question: z.string(),
  }),
  func: async ({ question }) => {
    const result = await queryKnowledgeBase(question);
    return `🤖 ${result.text}`;
  },
});
