// src\agents\tools\services\bookInventoryService.ts
import { db } from "@/db";
import { books } from "@/db/schema/books";
import { ilike, and } from "drizzle-orm";

/**
 * Finds a book in the inventory by title (required) and author (optional).
 * Uses ILIKE for case-insensitive partial match.
 */
export const findBookInInventory = async (title: string, author?: string) => {
  try {
    const result = await db
      .select()
      .from(books)
      .where(
        and(
          ilike(books.title, `%${title}%`),
          author ? ilike(books.author, `%${author}%`) : undefined
        )
      )
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("❌ DB query failed in findBookInInventory:", error);
    throw error;
  }
};
