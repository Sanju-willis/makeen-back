// src\services\ttsService.ts
import { elevenLabsClient } from "@/lib/clients/elevenLabsClient";


export async function streamElevenLabsTTS(text: string): Promise<AsyncIterable<Uint8Array>> {
  // console.log("📤 Sending TTS request to ElevenLabs...");
 // console.log("🔤 Input text:", text);
  try {
    const stream = await elevenLabsClient.generate({
      voice: "Rachel",
      text,
      model_id: "eleven_monolingual_v1",
      stream: true,
    });
    console.log("✅ ElevenLabs stream received");

    return stream;
  } catch (err) {
    console.error("❌ ElevenLabs SDK error:", err);
    return (async function* () {})(); // empty generator
  }
}
