// src\utils\transcription\extractWhatsAppImageText.ts
import { extractImageText } from "./extractImageText";
import { fetchWhatsAppMedia } from "@/utils/helpers/fetchWhatsAppMedia";

/**
 * Wrapper for WhatsApp-specific image OCR
 * Downloads the media buffer and passes it to Google Vision
 */
export const extractWhatsAppImageText = async (
  mediaId: string
): Promise<string> => {
  try {
    console.log("🛰️ Fetching media from WhatsApp:", mediaId);
    const buffer = await fetchWhatsAppMedia(mediaId);

    if (!buffer || buffer.length === 0) {
      console.warn("⚠️ Empty buffer received from WhatsApp media fetch.");
      return "";
    }

    console.log("🔍 Extracting text from buffer...");
    const text = await extractImageText( buffer );

    if (!text || text.trim() === "") {
      console.warn("⚠️ No text extracted from WhatsApp image.");
    } else {
     // console.log("✅ Text extracted from WhatsApp image:", text);
    }

    return text;
  } catch (err: any) {
    console.error(
      "❌ Failed to extract WhatsApp image text:",
      err?.message || err
    );
    return "";
  }
};
