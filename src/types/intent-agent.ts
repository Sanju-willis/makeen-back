// src\types\intent-agent.ts
export type UnifiedIntentResult = {
  intent: {
    type:
      | "book_inquiry"
      | "book_recommendation"
      | "order_status"
      | "complaint"
      | "general_help"
      | "unknown";
    confidence: number;
  };
  content: {
    type: "book" | "receipt" | "text_only" | "complaint" | "unknown";
    data: {
      // Book fields
      title?: string;
      author?: string;
      publisher?: string;
      isbn?: string;

      // Receipt fields
      orderId?: string;
      customerName?: string;
      customerEmail?: string;
      purchaseDate?: string; // format: YYYY-MM-DD
      orderTotal?: string; // format: "Rs. 5000"
      purchasedItems?: string[]; // optional list of purchased items

      // Complaint field
      complaintText?: string;
      complaintDate?: string;

      recommendationTopic?: string; // e.g. "productivity", "history"
      preferredAuthors?: string[];
      preferredGenres?: string[];
    };
  };
};
