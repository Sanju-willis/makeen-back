import { db } from "../src/db";
import { orders } from "../src/db/schema/orders";

async function seedOrders() {
  await db.insert(orders).values([
    {
      customerName: "Sanju Peramuna",
      bookTitle: "Atomic Habits",
      orderId: "ORD12345",
      status: "shipped",
    },
    {
      customerName: "Willis Arachchi",
      bookTitle: "Deep Work",
      orderId: "ORD67890",
      status: "delivered",
    },
    {
      customerName: "Nimal Fernando",
      bookTitle: "The Lean Startup",
      orderId: "ORD99999",
      status: "processing",
    },
  ]);

  console.log("📦 Seeded order data");
}

seedOrders().catch((err) => {
  console.error("❌ Failed to seed orders:", err);
});
