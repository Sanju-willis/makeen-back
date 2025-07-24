// src\plugins\logger.ts
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

// Extend FastifyInstance type to include our custom log methods
declare module "fastify" {
  interface FastifyInstance {
    logInfo: (msg: string) => void;
    logWarn: (msg: string) => void;
    logError: (msg: string) => void;
  }
}

const loggerPlugin = async (fastify: FastifyInstance) => {
  fastify.decorate("logInfo", (msg: string) => {
    fastify.log.info(`📘 ${msg}`);
  });

  fastify.decorate("logWarn", (msg: string) => {
    fastify.log.warn(`⚠️ ${msg}`);
  });

  fastify.decorate("logError", (msg: string) => {
    fastify.log.error(`❌ ${msg}`);
  });
};

export default fp(loggerPlugin);
