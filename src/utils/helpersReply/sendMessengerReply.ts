// src\utils\helpersReply\sendMessengerReply.ts
import { FB_GRAPH_API, FB_PAGE_ACCESS_TOKEN } from "@/config/facebook";

export const sendMessengerReply = async (
  recipientId: string,
  message: string
) => {
  try {
    const res = await fetch(`${FB_GRAPH_API}/me/messages?access_token=${FB_PAGE_ACCESS_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Messenger API error:", errorData);
    }
  } catch (error) {
    console.error("❌ Failed to send Messenger message:", error);
  }
};
