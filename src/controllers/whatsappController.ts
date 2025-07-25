// src\controllers\whatsappController.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { routeToAgent } from "../services/agentRouterService";
import { parseWhatsappMessages } from "../parsers/parseWhatsappMessages";
import { WHATSAPP_VERIFY_TOKEN } from "../config/env";
import { extractWhatsAppImageText } from "@/utils/transcription/extractWhatsAppImageText";

export const verifyWebhook = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const mode = (req.query as any)["hub.mode"];
  const token = (req.query as any)["hub.verify_token"];
  const challenge = (req.query as any)["hub.challenge"];

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook verified");
    return reply.code(200).send(challenge);
  }

  return reply.code(403).send();
};

const processedMessageIds = new Set<string>();

export const receiveMessage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const body = req.body as any;
  const parsed = parseWhatsappMessages(body);
 // console.log("📦 Parsed WhatsApp Messages:", JSON.stringify(parsed, null, 2));

  // ✅ Always respond fast
  reply.code(200).send();

  if (parsed.length === 0) return;

  for (const msg of parsed) {
    const { user, message } = msg;
    const { id, name, platform } = user;
    const { msgType, text, caption, mediaId, timestamp, messageId } = message;

    const userText = text?.trim() || caption?.trim() || "";

    if (processedMessageIds.has(messageId)) {
      console.log("⚠️ Duplicate message ID, skipping:", messageId);
      continue;
    }

    processedMessageIds.add(messageId);

    let extractedText = "";

    try {
      switch (msgType) {
        case "image":
          if (mediaId) {
            console.log("📷 Calling extractImageText with:", mediaId);
            extractedText = await extractWhatsAppImageText(mediaId);
          }
          break;

        default:
          
      }
    } catch (err) {
      console.warn(`⚠️ Failed to extract ${msgType} content:`, err);
    }

    // 🧠 Background process — don't block response
    routeToAgent({
      user: { id, name, platform },
      message: {
        msgType,
        userInput: userText,
        extractedText,
        mediaId,
        timestamp,
      },
    }).catch(console.error);
  }
};
