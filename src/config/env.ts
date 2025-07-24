// src\config\env.ts
import "dotenv/config";

const requiredEnv = [
  "OPENAI_API_KEY",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "DATABASE_URL",
  "PORT",
  "HOST",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`❌ ${key} is missing in .env`);
  }
}

// 🔓 Individual named exports
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

export const DATABASE_URL = process.env.DATABASE_URL!;
export const PORT = parseInt(process.env.PORT!, 10);
export const HOST = process.env.HOST!;
