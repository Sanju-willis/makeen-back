// src\utils\websocket\streamAudioAsBase64.ts
import { encodeWebSocketFrame } from "@/utils/websocket/encodeWebSocketFrame";
import { Duplex } from "stream";

export async function streamAudioAsBase64(
  audioStream: AsyncIterable<any>,
  socket: Duplex
) {
  try {
    console.log("📤 Starting base64 audio stream...");
    const chunks: Buffer[] = [];

    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    const completeAudio = Buffer.concat(chunks);
    const base64Audio = completeAudio.toString("base64");

    if (socket.writable) {
      socket.write(
        encodeWebSocketFrame(
          JSON.stringify({
            type: "audio",
            data: base64Audio,
            format: "mp3",
            
          })
        )
      );
      console.log(`✅ Base64 audio sent (${base64Audio.length} chars)`);
    }
  } catch (err) {
    console.error("❌ Base64 audio streaming error:", err);
  }
}
