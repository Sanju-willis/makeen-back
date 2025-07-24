// src\db\schema\analytics.ts
// src/db/schema/analytics.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const webchatAnalytics = pgTable("webchat_analytics", {
  sessionId: text("session_id").notNull(),
  ip: text("ip").notNull(),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  language: text("language"),
  referer: text("referer"),
  origin: text("origin"),
  host: text("host"),
  url: text("url"),
  method: text("method").notNull(),
  contentType: text("content_type"),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});
