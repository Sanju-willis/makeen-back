// src\agents\tools\knowledgeBaseTool.ts
import { z } from "zod";
import { StructuredTool } from "langchain/tools";
import { getRelevantKnowledge } from "@/services/rag/retrieveKnowledge";

export class KnowledgeBaseTool extends StructuredTool {
  name = "check_store_hours";
  description = "Use this tool to answer questions about store hours, holidays, branch availability, etc.";

  schema = z.object({
    query: z.string().describe("The user question about store hours or branch opening"),
  });

  async _call({ query }: { query: string }) {
    const result = await getRelevantKnowledge(query);
    return result || "Sorry, I couldn't find anything about that.";
  }
}

export const knowledgeBaseTool = new KnowledgeBaseTool();
