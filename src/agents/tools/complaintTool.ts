// src\tools\complaintTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const complaintTool = new DynamicStructuredTool({
  name: "complaintTool",
  description: "Handles customer complaints empathetically and escalates serious issues",
  schema: z.object({
    complaint: z.string(),
  }),
  func: async ({ complaint }) => {
    // Step 1: Empathetic response + ask clarifying question
    const empatheticResponse = `
Thank you for sharing your concern. I’m sorry to hear you’re experiencing issues. Could you please provide more details about the problem so I can assist you better?
    `;

    // Step 2: Simple keyword check to escalate (example)
    const seriousKeywords = ["fraud", "lawsuit", "refund", "illegal", "danger"];
    const shouldEscalate = seriousKeywords.some((word) =>
      complaint.toLowerCase().includes(word)
    );

    if (shouldEscalate) {
      // Trigger your side-effect here — e.g., send email to CEO (pseudo-code)
      // await sendEmailToCEO(complaint);

      return (
        empatheticResponse +
        "\n\nI've escalated this issue to our management team who will contact you shortly."
      );
    }

    return empatheticResponse;
  },
});
