// src\services\rag\queryKB.ts
import { getVectorStore } from "./vectorStore"; // your existing wrapper
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";

export const queryKnowledgeBase = async (userQuery: string) => {
  const vectorStore = await getVectorStore();

  const retriever = vectorStore.asRetriever({
    k: 2, // top 2 relevant docs
  });

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
  });

  const chain = RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: true,
  });

  const result = await chain.call({
    query: userQuery,
  });

  return result;
};
