// src\routes\chatRoute.ts
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { handleChatMessage } from "../controllers/chatController";
import { asyncHandler } from "../utils/asyncHandler";
import { parseMultipart } from "@/utils/parsers/parseMultipart";

const chatRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/chat",
    asyncHandler(async (req: FastifyRequest, reply) => {
      try {
        console.log("📥 Incoming /api/chat request");

        const { message, userId, platform, file } = await parseMultipart(req);
        console.log("✅ Parsed fields:", {
          message,
          userId,
          platform,
          hasFile: !!file,
        });

        if (!userId || !platform || (!message && !file)) {
          return reply
            .code(400)
            .send({
              error: "Missing 'userId', 'platform', 'message', or file",
            });
        }

        const response = await handleChatMessage({
          req,
          message,
          userId,
          platform,
          file,
        });

        return reply.send({ replies: [response] });
      } catch (err) {
        console.error("❌ Chat route error:", err);
        return reply.code(500).send({ error: "Internal server error" });
      }
    })
  );
};

export default chatRoute;
