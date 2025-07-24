// src\types\intent-agent.ts
export type UnifiedIntentResult = {
  intent: {
    type:
      | "book_inquiry"
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
      name?: string;
      email?: string;
      date?: string; // format: YYYY-MM-DD
      total?: string; // format: "Rs. 5000"
      items?: string[]; // optional list of purchased items

      // Complaint field
      complaintText?: string;
    };
  };
};
