// src\app.ts
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import routes from "./routes";

const app = Fastify({ logger: true });

// 🔌 Middleware: Must register multipart before routes
app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ✅ App health check
app.get("/", async () => ({ message: "🌍 Root OK" }));

// 🔁 Main route registration (includes /whatsapp/*)
app.register(routes); // no prefix, since each route has its own

export default app;
