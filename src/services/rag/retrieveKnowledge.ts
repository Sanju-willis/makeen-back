import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";

const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

let vectorStore: SupabaseVectorStore | null = null;

const initVectorStore = async () => {
  if (!vectorStore) {
    vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );
  }
};

export const getRelevantKnowledge = async (query: string) => {
  await initVectorStore();
  if (!vectorStore) throw new Error("Vector store not initialized");

  const results = await vectorStore.similaritySearch(query, 2);
  return results.map((r) => r.pageContent).join("\n");
};
