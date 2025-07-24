// src\parsers\parseWhatsappMessages.ts
import type { ParsedWebchatMessage } from "@/types/controller-types";

type WhatsAppType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "interactive"
  | string;

let msgCounter = 0;

export const parseWhatsappMessages = (body: any): ParsedWebchatMessage[] => {
  const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages || [];
  const contacts = body?.entry?.[0]?.changes?.[0]?.value?.contacts || [];

  return messages.map((msg: any): ParsedWebchatMessage => {
    const contact = contacts[0] || {};
    const from = msg.from;
    const name = contact.profile?.name || "Unknown";
    const timestamp = Number(msg.timestamp) * 1000 || Date.now();
    const messageId = msg.id || `whatsapp-${from}-${++msgCounter}`;
    const msgType: WhatsAppType = msg.type;

    const base = {
      user: {
        id: from,
        name,
        platform: "whatsapp" as const,
      },
      message: {
        msgType: "unsupported" as const,
        messageId,
        timestamp,
        buffer: undefined,
        mimeType: undefined,
        filename: undefined,
      },
    };

    switch (msgType) {
      case "text":
        return {
          ...base,
          message: {
            ...base.message,
            msgType: "text",
            text: msg.text?.body || "",
          },
        };

      case "image":
        return {
          ...base,
          message: {
            ...base.message,
            msgType: "image",
            caption: msg.image?.caption || "",
            mediaId: msg.image?.id,
          },
        };

      case "video":
        return {
          ...base,
          message: {
            ...base.message,
            msgType: "video",
            caption: msg.video?.caption || "",
            mediaId: msg.video?.id,
          },
        };

      case "audio":
        return {
          ...base,
          message: {
            ...base.message,
            msgType: "audio",
            mediaId: msg.audio?.id,
          },
        };

      default:
        return base;
    }
  });
};
