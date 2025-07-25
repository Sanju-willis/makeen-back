import { db } from "../src/db"; // Your Drizzle client
import { books } from "../src/db/schema/books";

async function seedBooks() {
  await db.insert(books).values([
    {
      title: "Atomic Habits",
      author: "James Clear",
      price: 2990,
      stock: 12,
    },
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      price: 3200,
      stock: 5,
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      price: 2700,
      stock: 0,
    },
  ]);

  console.log("📚 Seeded book data");
}

seedBooks().catch((err) => {
  console.error("❌ Failed to seed books:", err);
});
