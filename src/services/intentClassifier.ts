// src\services\intentClassifier.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { AgentRouteInput } from "../types/service-types";
import { UnifiedIntentResult } from "../types/intent-agent";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

const prompt = PromptTemplate.fromTemplate(`
You are an intent classifier and structured data extractor for a bookstore chatbot.

Analyze the user's message and return:
1. The user's intent and your confidence score (0 to 1).
2. The content type: "book", "receipt", "text_only", or "unknown".
3. Extract relevant structured data depending on the intent or content type.

Respond ONLY in raw JSON. Use this format:

{{{{
  "intent": {{
    "type": "book_inquiry" | "book_recommendation" | "order_status" | "complaint" | "general_help" | "unknown",
    "confidence": float (0 to 1)
  }},
  "content": {{
    "type": "book" | "receipt" | "text_only" | "unknown",
    "data": {{
      // If content.type === "book":
    "title": "book title (e.g., Atomic Habits)",
    "author": "book author (e.g., James Clear)",
    "publisher": "book publisher (optional)",
    "isbn": "book ISBN number (optional)",

      // If intent.type === "book_recommendation":
      "recommendationTopic": "string",            // e.g., 'productivity', 'fiction', etc.
      "preferredGenres": ["string", ...] (optional),
      "preferredAuthors": ["string", ...] (optional),

      // If content.type === "receipt" or intent === "order_status":
      "orderId": "string",
      "customerName": "string",
      "customerEmail": "string",
      "purchaseDate": "YYYY-MM-DD",
      "orderTotal": "Rs. amount",
      "purchasedItems": ["item name", ...] (optional),

      // If intent.type === "complaint":
      "complaintText": "string",
      "customerName": "string",
      "customerEmail": "string",
      "complaintDate": "YYYY-MM-DD" (optional)
    }}
  }}
}}}}

Valid intents:
- book_inquiry (user wants info about a specific book)
- book_recommendation (user asks for suggestions)
- order_status (user asks about their past purchase)
- complaint (user expresses dissatisfaction)
- general_help (user says hi, hello, hey, or asks questions like opening hours)
- unknown (user message is completely unrelated to a bookstore — e.g., asking about cooking recipes, politics, or random jokes)

Message Type: {msgType}

User Input:
{userInput}

Extracted Content:
{extractedText}
`);

export async function classifyIntent({
  userInput,
  extractedText,
  msgType,
}: AgentRouteInput["message"] & {
  msgType?: string;
}): Promise<UnifiedIntentResult> {
  const promptMessage = await prompt.format({
    userInput: userInput || "(none)",
    extractedText: extractedText || "(none)",
    msgType: msgType || "(unknown)",
  });

  const response = await model.invoke([
    { role: "system", content: promptMessage },
  ]);

  try {
    let raw = String(response.content).trim();

    // 🧹 Remove code block if present
    if (raw.startsWith("```json")) {
      raw = raw
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (raw.startsWith("```")) {
      raw = raw.replace(/^```/, "").replace(/```$/, "").trim();
    }

    console.log("🧪 Cleaned JSON string:", raw);

    const parsed = JSON.parse(raw);
    return parsed as UnifiedIntentResult;
  } catch (e) {
    console.error("❌ Failed to parse intent JSON:", response.content);
    return {
      intent: { type: "unknown", confidence: 0 },
      content: { type: "unknown", data: {} },
    };
  }
}
