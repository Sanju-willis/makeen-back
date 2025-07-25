import dotenv from "dotenv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function embedOwnerBio() {
  // 1. Load owner bio file
  const loader = new TextLoader("files/owner-bio.txt");
  const rawDocs = await loader.load();

  // 2. Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  // 3. Embed into vector store
  const embeddings = new OpenAIEmbeddings();

  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client,
    tableName: "match_documents", // must match your RAG table
  });

  console.log("📥 Embedded owner-bio.txt into match_documents table.");
}

embedOwnerBio();
