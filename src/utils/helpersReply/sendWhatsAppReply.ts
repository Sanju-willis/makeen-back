// src\utils\helpersReply\sendWhatsAppReply.ts
import { PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } from "../../config/env";

export const sendWhatsAppReply = async (to: string, message: string) => {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          text: { body: message },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ WhatsApp API error:", errorData);
    }
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error);
  }
};
