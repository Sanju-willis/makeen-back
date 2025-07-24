// src\utils\helpers\fetchWhatsAppMedia.ts
import axios from "axios";
import { WHATSAPP_ACCESS_TOKEN } from "@/config/env";

export const fetchWhatsAppMedia = async (mediaId: string): Promise<Buffer> => {
  try {
    // 🛰 Step 1: Get the media URL from WhatsApp
    const metaRes = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    const mediaUrl = metaRes.data?.url;
    if (!mediaUrl) {
      console.error("❌ WhatsApp media fetch: URL missing in response.");
      throw new Error("Media URL not found in WhatsApp response");
    }

    // 🧲 Step 2: Download the media file as a buffer
    const mediaRes = await axios.get(mediaUrl, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      responseType: "arraybuffer",
    });

    if (!mediaRes?.data || !(mediaRes.data instanceof ArrayBuffer || Buffer.isBuffer(mediaRes.data))) {
      console.error("❌ WhatsApp media fetch: Invalid media content received.");
      throw new Error("Invalid media data format received");
    }

    return Buffer.from(mediaRes.data);
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error?.message || err.message || "Unknown error";
    console.error("❌ Failed to fetch WhatsApp media:", errorMessage);
    throw new Error(`WhatsApp media fetch failed: ${errorMessage}`);
  }
};
