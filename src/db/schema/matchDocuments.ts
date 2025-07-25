// src\db\schema\matchDocuments.ts
import { pgTable, text, vector, uuid, jsonb, timestamp } from "drizzle-orm/pg-core";

export const match_documents = pgTable("match_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow(),
});
