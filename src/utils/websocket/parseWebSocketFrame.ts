// src\utils\websocket\parseWebSocketFrame.ts
export function parseWebSocketFrame(buffer: Buffer): { opcode: number; payload: Buffer; totalLength: number } | null {
  if (buffer.length < 2) return null;

  const firstByte = buffer[0];
  const secondByte = buffer[1];
  const opcode = firstByte & 0x0f;
  const masked = (secondByte & 0x80) === 0x80;
  let payloadLength = secondByte & 0x7f;
  let offset = 2;

  if (payloadLength === 126) {
    if (buffer.length < offset + 2) return null;
    payloadLength = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (payloadLength === 127) {
    if (buffer.length < offset + 8) return null;
    const high = buffer.readUInt32BE(offset);
    const low = buffer.readUInt32BE(offset + 4);
    payloadLength = high * 0x100000000 + low;
    offset += 8;
  }

  if (masked) {
    if (buffer.length < offset + 4) return null;
    offset += 4;
  }

  if (buffer.length < offset + payloadLength) return null;

  let payload = buffer.slice(offset, offset + payloadLength);

  if (masked) {
    const maskKey = buffer.slice(offset - 4, offset);
    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= maskKey[i % 4];
    }
  }

  return {
    opcode,
    payload,
    totalLength: offset + payloadLength,
  };
}
