// src\utils\transcription\extractImageText.ts
import { visionClient } from "../../config/visionClient";

export const extractImageText = async (buffer: Buffer): Promise<string> => {
  //console.log("📤 Sending image buffer to Google Vision API...");
  //console.log("📦 Buffer size (bytes):", buffer.length);

  try {
    const [result] = await visionClient.textDetection({ image: { content: buffer } });

    if (!result || !result.textAnnotations || result.textAnnotations.length === 0) {
      console.warn("⚠️ No text detected in image.");
      return "";
    }

    const rawText = result.textAnnotations[0].description || "";
    //console.log("📝 OCR extracted text:", rawText);

    return rawText;
  } catch (error: any) {
    console.error("❌ Vision API error:", error.message || error);
    return "";
  }
};
