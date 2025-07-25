// src\agents\tools\findBookTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { findBookInInventory } from "./services/bookInventoryService";

export const findBookTool = new DynamicStructuredTool({
  name: "findBookTool",
  description:
    "Find a book by title and author. Supports queries like availability, price, details.",
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    query: z
      .enum(["availability", "price", "details"])
      .optional()
      .default("details"),
  }),
  func: async ({ title, author, query }) => {
    console.log("📚 findBookTool called with:");
    console.log("→ Title:", title);
    console.log("→ Author:", author);
    console.log("→ Query type:", query);

    const book = await findBookInInventory(title, author);

    if (!book) {
      return `❌ Sorry, I couldn't find "${title}"${author ? ` by ${author}` : ""} in our inventory.`;
    }

    switch (query) {
      case "availability":
        return book.stock > 0
          ? `✅ "${book.title}" by ${book.author} is available.`
          : `❌ "${book.title}" by ${book.author} is currently out of stock.`;

      case "price":
        return `💲 The price of "${book.title}" by ${book.author} is $${book.price.toFixed(2)}.`;

      case "details":
      default:
        return `📘 "${book.title}" by ${book.author}. Price: $${book.price.toFixed(
          2
        )}. ${book.stock > 0 ? "In stock." : "Currently unavailable."}`;
    }
  },
});
