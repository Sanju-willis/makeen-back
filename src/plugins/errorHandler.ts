// src\plugins\errorHandler.ts
// src/plugins/errorHandler.ts
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = (error as any).statusCode || 500;
    const message = error.message || "Something went wrong";

    reply.status(statusCode).send({ error: message });
  });
});
