// src\app.ts
import Fastify from "fastify";
import routes from "./routes";
import { registerPlugins } from "./plugins";

export const buildApp = async () => {
const app = Fastify({
  logger: {
    level: "info", // or "error" to only log serious issues
  },
});

  await registerPlugins(app);

  app.get("/", async () => ({ message: "🌍 Root OK" }));
  app.register(routes);

  return app;
};
