// src\routes\index.ts
import { FastifyInstance } from "fastify";
import chatRoute from "./chatRoute";
import { whatsappRoute } from "./whatsappRoute";
import { messengerRoute } from "./messengerRoute"; // ✅ added
import { handleDeepgramStream } from "../services/deepgramService";

export default async function routes(fastify: FastifyInstance) {
  // 🔁 Register chat and WhatsApp routes
  fastify.register(chatRoute, { prefix: "/api" });
  fastify.register(whatsappRoute, { prefix: "/whatsapp" });
  fastify.register(messengerRoute, { prefix: "/messenger" }); // ✅ added

  fastify.server.on("upgrade", (req, socket, head) => {
    if (req.url === "/voice/deepgram-stream") {
    //  fastify.log.info("🔁 WebSocket upgrade: /voice/deepgram-stream");
      socket.on("error", (err) => {
        console.error("❌ Socket error:", err);
      });
      handleDeepgramStream(req, socket, head);
    } else {
      socket.destroy();
    }
  });
}
