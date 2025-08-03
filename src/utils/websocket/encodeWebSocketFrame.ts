// src\utils\websocket\encodeWebSocketFrame.ts
export function encodeWebSocketFrame(data: string | Buffer, opcode: number = 0x2): Buffer {
  const payload = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
  const length = payload.length;

  let frame: Buffer;
  if (length < 126) {
    frame = Buffer.allocUnsafe(2);
    frame[0] = 0x80 | opcode; // FIN + opcode (0x2 for binary)
    frame[1] = length;
  } else if (length < 65536) {
    frame = Buffer.allocUnsafe(4);
    frame[0] = 0x80 | opcode;
    frame[1] = 126;
    frame.writeUInt16BE(length, 2);
  } else {
    frame = Buffer.allocUnsafe(10);
    frame[0] = 0x80 | opcode;
    frame[1] = 127;
    frame.writeUInt32BE(0, 2); // high bits (0)
    frame.writeUInt32BE(length, 6);
  }

  return Buffer.concat([frame, payload]);
}
