// src\app.ts
import Fastify from "fastify";
import multipart from '@fastify/multipart';
import routes from "./routes";

const app = Fastify({ logger: true });

// Register multipart directly BEFORE routes
app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

app.get("/", async () => ({ message: "🌍 Root OK" }));
app.register(routes, { prefix: "/api" });

export default app;