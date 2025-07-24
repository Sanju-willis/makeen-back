import { FastifyInstance } from "fastify";
import corsPlugin from "./cors";
import envPlugin from "./env";
import loggerPlugin from "./logger";
import errorHandlerPlugin from "./errorHandler"; // ✅ added
// import jwtPlugin from './jwt';
// import swaggerPlugin from './swagger';

export async function registerPlugins(app: FastifyInstance) {
  await app.register(envPlugin);
  await app.register(corsPlugin);
  await app.register(loggerPlugin);
  await app.register(errorHandlerPlugin); // ✅ registered here
  // await app.register(jwtPlugin);
  // await app.register(swaggerPlugin);
}
