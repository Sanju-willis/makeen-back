// src\utils\websocket\streamAudioAsBinaryChunks.ts
import { Duplex } from "stream";
import { encodeWebSocketFrame } from "@/utils/websocket/encodeWebSocketFrame";

export async function streamAudioAsBinaryChunks(
  audioStream: AsyncIterable<any>,
  socket: Duplex
) {
  try {
    console.log("📤 Streaming raw audio chunks...");

    let closed = false;
    socket.on("close", () => {
      closed = true;
      console.warn("🚫 Socket closed during audio stream");
    });

    for await (const chunk of audioStream) {
      if (closed || !socket.writable) break;

      socket.write(encodeWebSocketFrame(chunk, 0x2)); // 0x2 = binary
    }

    console.log("✅ Raw audio stream complete");
  } catch (err) {
    console.error("❌ Binary audio streaming error:", err);
  }
}
