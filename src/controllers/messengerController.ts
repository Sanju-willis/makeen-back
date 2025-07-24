// src\controllers\messengerController.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { routeToAgent } from "@/services/agentRouterService";
import { parseMessengerWebhook } from "@/parsers/messengerParser";
//import { extractMessengerAnalytics } from "@/utils/analytics/extractMessengerAnalytics";
import { extractWhatsAppImageText } from "@/utils/transcription/extractWhatsAppImageText"; // Optional if doing direct buffer upload
import { MESSENGER_VERIFY_TOKEN } from "@/config/env"; // Ensure this is defined in your environment config

const VERIFY_TOKEN = "myVerifyToken123";

export const verifyMessengerWebhook = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const mode = (req.query as any)["hub.mode"];
  const token = (req.query as any)["hub.verify_token"];
  const challenge = (req.query as any)["hub.challenge"];

  if (mode === "subscribe" && token === MESSENGER_VERIFY_TOKEN) {
    console.log("✅ Messenger Webhook verified");
    return reply.code(200).send(challenge);
  }

  return reply.code(403).send("Verification failed");
};

export const handleMessengerEvent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const body = req.body as any;
  const headers = req.headers;

 // const analytics = extractMessengerAnalytics(headers);
 // console.log("📊 Messenger Analytics:", analytics);

  const parsedMessages = parseMessengerWebhook(body);

  for (const { user, message } of parsedMessages) {
    const { msgType, text, mediaId } = message;
    console.log(`💬 ${user.senderId} (${msgType}): ${text || mediaId}`);

    let extractedText = "";

    try {
      switch (msgType) {
        case "text":
          extractedText = text?.trim() || "";
          break;

        case "image":
          if (mediaId) {
            console.log("📷 Messenger image media received, but fetch not yet implemented.");
            extractedText = await extractWhatsAppImageText(mediaId);
          } else {
            console.warn("⚠️ Image received without mediaId");
          }
          break;

        default:
          console.warn("⚠️ Unsupported Messenger msgType:", msgType);
      }
    } catch (err) {
      console.warn(`⚠️ Failed to extract ${msgType} content:`, err);
    }

    const result = await routeToAgent({
      user: {
        id: user.senderId,
        name: user.name || "",
        platform: "messenger",
      },
      message: {
        msgType,
        userInput: text || "",
        extractedText,
        mediaId,
      },
    });

  }

  return reply.code(200).send("EVENT_RECEIVED");
};
