// src\agents\tools\knowledgeBaseTool.ts
import { z } from "zod";
import { StructuredTool } from "langchain/tools";
import { getVectorStore } from "@/services/rag/vectorStore";

export class KnowledgeBaseTool extends StructuredTool {
  name = "check_store_hours";
  description =
    "Use this tool to answer questions about store hours, holidays, branch availability, etc.";

  schema = z.object({
    query: z
      .string()
      .describe("The user question about store hours or branch opening"),
  });

  async _call({ query }: { query: string }) {
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(query, 2);
    const answer = results.map((r) => r.pageContent).join("\n");

    return answer || "Sorry, I couldn't find anything about that.";
  }
}

export const knowledgeBaseTool = new KnowledgeBaseTool();
