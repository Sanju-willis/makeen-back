// src\routes\whatsappRoute.ts
import { FastifyPluginAsync } from "fastify";
import { verifyWebhook, receiveMessage } from "../controllers/whatsappController";

export const whatsappRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/webhook", async (req, reply) => {
    return verifyWebhook(req, reply);
  });

  fastify.post("/webhook", async (req, reply) => {
    return receiveMessage(req, reply);
  });


};
