// src\routes\index.ts
import { FastifyInstance } from "fastify";
import chatRoute from "./chatRoute";
import { whatsappRoute } from "./whatsappRoute";
import { messengerRoute } from "./messengerRoute"; // ✅ added

export default async function routes(fastify: FastifyInstance) {
  // 🔁 Register chat and WhatsApp routes
  fastify.register(chatRoute, { prefix: "/api" });
  fastify.register(whatsappRoute, { prefix: "/whatsapp" });
  fastify.register(messengerRoute, { prefix: "/messenger" }); // ✅ added
}
