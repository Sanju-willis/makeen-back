// src\utils\websocket\forwardMicAudioToDeepgram.ts
import { Duplex } from "stream";
import WebSocket from "ws";
import { parseWebSocketFrame } from "@/utils/websocket/parseWebSocketFrame";

export function forwardMicAudioToDeepgram(socket: Duplex, dgSocket: WebSocket) {
  let buffer = Buffer.alloc(0);

  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    while (buffer.length >= 2) {
      const frame = parseWebSocketFrame(buffer);
      if (!frame) break;

      buffer = buffer.slice(frame.totalLength);

      if (frame.opcode === 0x8) {
        socket.end();
        dgSocket.close();
        return;
      }

      if (frame.opcode === 0x2 && dgSocket.readyState === WebSocket.OPEN) {
        dgSocket.send(frame.payload);
      }
    }
  });
}
