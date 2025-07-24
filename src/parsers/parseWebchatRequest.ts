// src\parsers\parseWebchatRequest.ts
import type { MultipartFile } from "@fastify/multipart";
import type { ParsedWebchatMessage, HandleChatMessageInput } from "../types/controller-types";

let idCounter = 0;

export const parseWebchatRequest = async ({
  message,
  file,
  userId,
}:HandleChatMessageInput ): Promise<ParsedWebchatMessage> => {
  const timestamp = Date.now();
  const messageId = `webchat-${userId || timestamp}-${++idCounter}`;

  const fallbackId =  "Anonymous";

  const user = {
    id: userId,
    name: fallbackId,
    platform: "webchat" as const,
  };

  const base = {
    timestamp,
    messageId,
  };

  if (file) {
    const mime = file.mimetype;
    const buffer = await file.toBuffer();
    const caption = message?.trim() || undefined;

    if (mime.startsWith("image/")) {
      return {
        user,
        message: {
          msgType: "image",
          buffer,
          mimeType: mime,
          filename: file.filename,
          caption,
          ...base,
        },
      };
    }

    if (mime.startsWith("audio/")) {
      return {
        user,
        message: {
          msgType: "audio",
          buffer,
          mimeType: mime,
          filename: file.filename,
          ...base,
        },
      };
    }

    if (mime.startsWith("video/")) {
      return {
        user,
        message: {
          msgType: "video",
          buffer,
          mimeType: mime,
          filename: file.filename,
          caption,
          ...base,
        },
      };
    }

    return {
      user,
      message: {
        msgType: "unsupported",
        buffer,
        mimeType: mime,
        filename: file.filename,
        ...base,
      },
    };
  }

  if (message?.trim().length) {
    return {
      user,
      message: {
        msgType: "text",
        text: message.trim(),
        ...base,
      },
    };
  }

  return {
    user,
    message: {
      msgType: "unsupported",
      ...base,
    },
  };
};
