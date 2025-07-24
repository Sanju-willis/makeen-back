// src\services\analytics\analyticsService.ts
import { db } from "@/db"; // ← your drizzle instance
import { webchatAnalytics } from "@/db/schema/analytics";
import { WebchatAnalytics } from "@/parsers/parseWebchatAnalytics";

export const saveWebchatAnalytics = async (data: WebchatAnalytics) => {
  try {
    await db.insert(webchatAnalytics).values(data);
  } catch (err) {
    console.error("❌ Failed to save analytics:", err);
  }
};
