import { FastifyInstance } from "fastify";
import corsPlugin from "./cors";
import envPlugin from "./env";
import loggerPlugin from "./logger";
import errorHandlerPlugin from "./errorHandler";
import multipart from "@fastify/multipart"; // ✅ add here

export async function registerPlugins(app: FastifyInstance) {
  // ⚠️ Order matters: register before routes are loaded
  await app.register(envPlugin);
  await app.register(corsPlugin);
  await app.register(loggerPlugin);
  await app.register(errorHandlerPlugin);
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
}
