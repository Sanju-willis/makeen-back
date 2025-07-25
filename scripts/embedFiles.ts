import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { Document } from "langchain/document";

dotenv.config();

const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use full-access key
);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

async function embedAllFilesInFolder(folderPath: string) {
  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".txt"));
  const allDocs: Document[] = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const loader = new TextLoader(filePath);
    const rawDocs = await loader.load();
    const chunks = await splitter.splitDocuments(rawDocs);

    const sourceTag = path.basename(file, ".txt"); // e.g. "store-hours"
    chunks.forEach((doc) => {
      doc.metadata = { source: sourceTag }; // Add metadata tag
    });

    allDocs.push(...chunks);
    console.log(`✅ Loaded and split ${file}`);
  }

  const embeddings = new OpenAIEmbeddings();

  await SupabaseVectorStore.fromDocuments(allDocs, embeddings, {
    client,
    tableName: "match_documents",
  });

  console.log("📥 All .txt files embedded into match_documents table.");
}

embedAllFilesInFolder("files");
