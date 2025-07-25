// src\agents\bookInquiryAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { findBookTool } from "./tools/findBookTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { handoverTool } from "./tools/handoverTool";


const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

export const getBookInquiryAgent = async (sessionId: string) => {
  const memory = getSessionMemory(sessionId);
  const context = (memory as any).__context || {};

  console.log("🤖 Book inquiry agent memory:", );

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

- Use the findBookTool to look up book info (details, availability, price).
- If the user's request is not about a book (e.g., asking about an order or account),
  call the handover_to_specialized_agent tool with the right intent.
- Only use handover when you're confident the query is better handled by another agent.
- Set newIntent to one of: "order_status", "general_help", or "book_inquiry".
- Set message to a short summary of the user's request.
- Set originalInput to the exact message the user sent.

Be clear and friendly. Don’t guess if you're unsure.
`;


  return await initializeAgentExecutorWithOptions([findBookTool, handoverTool], model, {
    agentType: "openai-functions",
    memory,
    verbose: false,
    agentArgs: {
      prefix: systemPrompt,
    },
  });
};
