// src\errors\handleSocketError.ts
import WebSocket from "ws";
import { Duplex } from "stream";

export function handleSocketError(
  label: string,
  err: unknown,
  clientSocket?: Duplex,
  upstreamSocket?: WebSocket
) {
  console.error(`❌ [${label}]`, err);

  if (clientSocket && !clientSocket.destroyed) {
    try {
      clientSocket.end();
    } catch (e) {
      console.error("⚠️ Failed to close client socket:", e);
    }
  }

  if (upstreamSocket && upstreamSocket.readyState === WebSocket.OPEN) {
    upstreamSocket.close();
  }
}
