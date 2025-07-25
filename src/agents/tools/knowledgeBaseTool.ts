// src/agents/tools/knowledgeBaseTool.ts
import { z } from "zod";
import { StructuredTool } from "langchain/tools";
import { getVectorStore } from "@/services/rag/vectorStore";

export class KnowledgeBaseTool extends StructuredTool {
  name = "knowledge_base_lookup";
  description =
    "Use this tool to answer general questions about store hours, payments, return policies, delivery, and other general help topics.";

  schema = z.object({
    query: z.string().describe("The user question"),
  });

  async _call({ query }: { query: string }) {
    const vectorStore = await getVectorStore();

    const results = await vectorStore.similaritySearch(query, 2);
    const answer = results.map((r) => r.pageContent).join("\n");

    return answer || "Sorry, I couldn't find anything about that.";
  }
}

export const knowledgeBaseTool = new KnowledgeBaseTool();
