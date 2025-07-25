// src\services\rag\vectorStore.ts
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@/config/env";

export const getVectorStore = async () => {
  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const embeddings = new OpenAIEmbeddings();

  return await SupabaseVectorStore.fromExistingIndex(embeddings, {
    client,
    tableName: "match_documents",
    queryName: "match_documents",
  });
};
