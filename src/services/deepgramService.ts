// src\services\deepgramService.ts
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import WebSocket from "ws";
import { createOpenAIReply } from "./aiService";
import { streamElevenLabsTTS } from "./ttsService";
import { generateAcceptKey } from "@/utils/websocket/generateAcceptKey";
import { encodeWebSocketFrame } from "@/utils/websocket/encodeWebSocketFrame";
import { handleSocketError } from "@/errors/handleSocketError";
import { createDeepgramClient } from "@/lib/clients/deepgramClient";
import { forwardMicAudioToDeepgram } from "@/utils/websocket/forwardMicAudioToDeepgram";
import { streamAudioAsBinaryChunks } from "@/utils/websocket/streamAudioAsBinaryChunks";
import { streamAudioAsBase64 } from "@/utils/websocket/streamAudioAsBase64";


export function handleDeepgramStream(
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer
) {
  // Perform WebSocket handshake
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    return;
  }

  const acceptKey = generateAcceptKey(key);

  socket.write(
    [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${acceptKey}`,
      "\r\n",
    ].join("\r\n")
  );

  console.log("✅ WebSocket handshake completed");

  // Connect to Deepgram
  const dgSocket = createDeepgramClient({
    onOpen: () => {
      console.log("✅ Connected to Deepgram");
    },

    onMessage: async (json) => {
      try {
        const transcript = json.channel?.alternatives?.[0]?.transcript;
        if (!transcript?.trim()) return;

        //    console.log("🤖 Sending transcript to OpenAI:", transcript);
        const reply = await createOpenAIReply(transcript);

        if (socket.writable) {
          socket.write(
            encodeWebSocketFrame(
              JSON.stringify({ type: "reply", transcript, reply })
            )
          );
        }

        const ttsStream = await streamElevenLabsTTS(reply);
       await streamAudioAsBase64(ttsStream, socket);
       //await streamAudioAsBinaryChunks(ttsStream, socket);

      } catch (err) {
        console.error("❌ Pipeline error:", err);
        if (socket.writable) {
          try {
            socket.write(
              encodeWebSocketFrame(
                JSON.stringify({
                  type: "error",
                  message: "Processing error occurred",
                })
              )
            );
          } catch (writeErr) {
            console.error("❌ Error writing error message:", writeErr);
          }
        }
      }
    },

    onError: (err) => {
      handleSocketError("Deepgram Error", err, socket);
      if (socket.writable) {
        socket.write(
          encodeWebSocketFrame(
            JSON.stringify({
              type: "error",
              message: "Deepgram connection error",
            })
          )
        );
      }
    },

    onClose: () => {
      console.log("🔴 Deepgram connection closed");
      if (!socket.destroyed) {
        socket.end();
      }
    },
  });

  socket.on("close", () => {
    console.log("❌ Client disconnected");
    if (dgSocket.readyState === WebSocket.OPEN) {
      dgSocket.close();
    }
  });

  forwardMicAudioToDeepgram(socket, dgSocket);

  socket.on("error", (err) => {
    handleSocketError("Client Socket Error", err, socket, dgSocket);
  });
}
