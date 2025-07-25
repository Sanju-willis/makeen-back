// src\db\schema\orders.ts
// src\db\schema\orders.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  bookTitle: text("book_title").notNull(),
  orderId: text("order_id").notNull().unique(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
