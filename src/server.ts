// src\server.ts
import { PORT, HOST } from "./config/env"; // use relative path if ESM disabled
import { buildApp } from "./app";

const start = async () => {
  try {
    const app = await buildApp();

    await app.listen({ port: PORT, host: HOST });
    app.printRoutes();

    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
};

start();
