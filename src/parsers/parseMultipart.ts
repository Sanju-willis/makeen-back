// src\parsers\parseMultipart.ts
import type { FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";

type ParsedInput = {
  message?: string;
  userId?: string;
  platform?: string;
  file?: MultipartFile;
};

export async function parseMultipart(req: FastifyRequest): Promise<ParsedInput> {
  let message: string | undefined;
  let userId: string | undefined;
  let platform: string | undefined;
  let file: MultipartFile | undefined;

  if (req.isMultipart?.()) {
    const parts = req.parts!();
    for await (const part of parts) {
      if (part.type === "field") {
        if (part.fieldname === "message") message = part.value as string;
        else if (part.fieldname === "userId") userId = part.value as string;
        else if (part.fieldname === "platform") platform = part.value as string;
      }
      if (part.type === "file" && !file) {
        file = part;
        await part.toBuffer(); // required to drain the stream
      }
    }
  } else {
    const body = req.body as {
      message?: string;
      userId?: string;
      platform?: string;
    };
    message = body.message;
    userId = body.userId;
    platform = body.platform;
  }

  return { message, userId, platform, file };
}
