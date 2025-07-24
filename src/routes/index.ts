// src\routes\index.ts
import { FastifyInstance } from "fastify";
import chatRoute from "./chatRoute";

export default async function routes(fastify: FastifyInstance) {
  fastify.get("/", async () => {
    return { message: "🤖 AI Bot API Running" };
  });



  //console.log("📦 Registering chatRoute at /api/chat");
  fastify.register(chatRoute);
}