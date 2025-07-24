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
    "type": "book_inquiry" | "order_status" | "complaint" | "general_help" | "unknown",
    "confidence": float (0 to 1)
  }},
  "content": {{
    "type": "book" | "receipt" | "text_only" | "unknown",
    "data": {{
      // If content.type === "book":
      "title": "string",
      "author": "string",
      "publisher": "string (optional)",
      "isbn": "string (optional)"

      // If content.type === "receipt":
      "orderId": "string",
      "name": "string",
      "email": "string",
      "date": "YYYY-MM-DD",
      "total": "Rs. amount",
      "items": ["item name", "item name", ...] (optional)

      // If complaint:
      "complaintText": "string"
    }}
  }}
}}}}

Valid intents:
- book_inquiry
- order_status
- complaint
- general_help
- unknown

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
