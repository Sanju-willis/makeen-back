// src\routes\messengerRoute.ts
import { FastifyPluginAsync } from "fastify";
import {
  verifyMessengerWebhook,
  handleMessengerEvent,
} from "../controllers/messengerController";

export const messengerRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/webhook", verifyMessengerWebhook);
  fastify.post("/webhook", handleMessengerEvent);
};
