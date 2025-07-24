// src\routes\chatRoute.ts
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { handleChatMessage } from "../controllers/chatController";
import { asyncHandler } from "../utils/asyncHandler";
import { parseMultipart } from "../parsers/parseMultipart";

const chatRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/chat",
    asyncHandler(async (req: FastifyRequest, reply) => {
      const { message, userId, platform, file } = await parseMultipart(req);

      if (!userId || !platform || (!message && !file)) {
        return reply
          .code(400)
          .send({ error: "Missing 'userId', 'platform', 'message', or file" });
      }

      const response = await handleChatMessage({
        req,
        message,
        userId,
        platform,
        file,
      });

      // ✅ Don't wrap an object that's already { reply: string }
      reply.send({ replies: [response] });
    })
  );
};

export default chatRoute;
