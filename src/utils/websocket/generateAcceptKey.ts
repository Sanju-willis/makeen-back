// src\utils\websocket\generateAcceptKey.ts
import crypto from "crypto";

export function generateAcceptKey(key: string): string {
  const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  return crypto.createHash("sha1").update(key + GUID).digest("base64");
}
