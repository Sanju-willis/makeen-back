// src\db\schema\bookWaitlist.ts
// src/db/schema/bookWaitlist.ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const book_waitlist = pgTable("book_waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  contact_method: text("contact_method").notNull(), // or use pgEnum if you want
  contact_value: text("contact_value").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
