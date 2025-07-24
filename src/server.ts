// src\server.ts
import app from "./app";
import { registerPlugins } from "./plugins";
import { PORT, HOST } from "@/config/env"; // ✅ import validated env

const start = async () => {
  try {
    await registerPlugins(app);

    await app.listen({ port: PORT, host: HOST });

    app.printRoutes(); // 👈 MUST come after listen()

    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
