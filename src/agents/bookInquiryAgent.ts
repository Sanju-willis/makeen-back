// src\agents\bookInquiryAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { findBookTool } from "../tools/findBookTool";
import { getSessionMemory } from "@/memory/sessionMemory";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

export const getBookInquiryAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);
  const context = (memory as any).__context || {};

  console.log("Book inquiry agent memory:", memory);

  const currentBook = {
  title: context.title,
  author: context.author,
};

  const prevBook = (memory as any).__bookContext;

  const isSameBook =
    currentBook?.title &&
    prevBook?.title === currentBook.title &&
    prevBook?.author === currentBook.author;

  if (currentBook?.title && !isSameBook) {
    const authorText = currentBook.author ? ` by ${currentBook.author}` : "";
    await memory.chatHistory.addUserMessage(
      `I'm asking about the book "${currentBook.title}"${authorText}.`
    );

    (memory as any).__bookContext = {
      title: currentBook.title,
      author: currentBook.author,
    };
  }

  const systemPrompt = `
You are an AI assistant for a bookstore. Help users find books by title or author.
Use the findBookTool to look up book info if needed.
Be clear and friendly. Don’t guess if you're unsure.
`;

  return await initializeAgentExecutorWithOptions([findBookTool], model, {
    agentType: "openai-functions",
    memory,
    verbose: false,
    agentArgs: {
      prefix: systemPrompt,
    },
  });
};
