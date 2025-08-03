// src\memory\updateMemoryContext.ts
import { getSessionMemory } from "./sessionMemory";
import type { UnifiedIntentResult } from "@/types/intent-agent";
import type { UserInfo } from "@/types/service-types";

const intentFieldsMap: Record<
  UnifiedIntentResult["intent"]["type"],
  (keyof UnifiedIntentResult["content"]["data"])[]
> = {
  book_inquiry: ["title", "author", "publisher", "isbn"],
  
  order_status: [
    "orderId",
    "customerName",
    "customerEmail",
    "purchaseDate",
    "orderTotal",
    "purchasedItems",
  ],
  complaint: [
    "complaintText",
    "customerName",
    "customerEmail",
    "complaintDate",
  ],
  book_recommendation: [
    "recommendationTopic",
    "preferredAuthors",
    "preferredGenres",
  ],
  general_help: [],
  unknown: [],
  
};

/**
 * Updates the session memory based on intent result and user info.
 */
export function updateMemoryContext(
  sessionId: string,
  intentResult: UnifiedIntentResult,
  user: UserInfo
) {
  const memory = getSessionMemory(sessionId);

  if (!(memory as any).__context) {
    (memory as any).__context = {};
  }

  const { intent, content } = intentResult;
  const relevantFields = intentFieldsMap[intent.type] || [];
  const rawData = content?.data || {};

  const context: Record<string, any> = {
    intent: intent.type,
    confidence: intent.confidence,
    platform: user.platform,
  };

  for (const key of relevantFields) {
    const val = rawData[key];
    if (val !== undefined) context[key] = val;
  }

  if (user.name) context.customerName  = user.name;

  Object.assign((memory as any).__context, context);
}
