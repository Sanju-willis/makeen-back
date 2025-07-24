// src\types\controller-types.ts

import type { MultipartFile } from "@fastify/multipart";
import type { FastifyRequest } from "fastify";

export type HandleChatMessageInput = {
  message?: string;
  userId: string;
  platform: string;
  file?: MultipartFile;
  req?: FastifyRequest;
};

export type ParsedWebchatMessage = {
  user: {
    id: string;
    name: string;
    platform: "webchat";
  };
  message: {
    msgType: "text" | "image" | "audio" | "video" | "unsupported";
    text?: string;
    caption?: string;
    buffer?: Buffer;
    mimeType?: string;
    filename?: string;
    timestamp: number;
    messageId: string;
  };
};