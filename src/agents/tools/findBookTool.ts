// src\tools\findBookTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

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
    switch (query) {
      case "availability":
        return `Checking availability for "${title}" by ${author || "unknown author"}.`;
      case "price":
        return `Fetching price for "${title}" by ${author || "unknown author"}.`;
      case "details":
      default:
        return `Looking for details of "${title}" by ${author || "unknown author"}.`;
    }
  },
});
