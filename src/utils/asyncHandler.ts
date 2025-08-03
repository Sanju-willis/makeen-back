// src\utils\asyncHandler.ts
import { FastifyReply, FastifyRequest } from "fastify";

export const asyncHandler =
  (
    fn: (req: FastifyRequest, reply: FastifyReply) => Promise<any>
  ) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await fn(req, reply);
    } catch (err) {
      req.log.error(err);
      reply.status(500).send({ error: "Internal server error" });
    }
  };
