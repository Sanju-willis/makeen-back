// src\db\schema\messages.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const whatsappMessages = pgTable('whatsapp_messages', {
  id: text('id').primaryKey(),
  from: text('from'),
  body: text('body'),
  createdAt: timestamp('created_at').defaultNow()
});
