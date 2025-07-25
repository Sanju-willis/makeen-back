// src\agents\bookInquiryAgent.ts
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { findBookTool } from "./tools/findBookTool";
import { getSessionMemory } from "@/memory/sessionMemory";
import { handoverTool } from "./tools/handoverTool";
import { bookWaitlistTool } from "./tools/bookWaitlistTool";



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
You are a helpful and friendly AI assistant for Makeen Bookstore. Your role is to help users find books by title, author, or both.

When the user mentions a book:
- Use the \`findBookTool\` to search for its details, availability, and price.
- If the book is not available or not found in the catalog:
  → Politely ask if they'd like to be notified when it's back in stock.
  → If yes, collect their preferred contact method (email or phone) and use the \`add_user_to_book_waitlist\` tool.

When the user's message clearly belongs to a different topic (e.g., orders, returns, complaints, store hours):
- Use the \`handover_to_specialized_agent\` tool to forward it.
- Set:
  - \`newIntent\` to one of: "order_status", "general_help", or "book_inquiry"
  - \`message\` to a short summary of their request
  - \`originalInput\` to the exact user message

Be concise, respectful, and helpful at all times. If you're not sure, ask a clarifying question instead of guessing.
`;



  return await initializeAgentExecutorWithOptions([findBookTool, handoverTool, bookWaitlistTool], model, {
    agentType: "openai-functions",
    memory,
    verbose: false,
    agentArgs: {
      prefix: systemPrompt,
    },
  });
};
