// src\config\env.ts
import "dotenv/config";
import { EnvError } from "../errors/Errors";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new EnvError(key);
  return value;
};

export const OPENAI_API_KEY = getEnv("OPENAI_API_KEY");
export const GOOGLE_CLIENT_EMAIL = getEnv("GOOGLE_CLIENT_EMAIL");
export const GOOGLE_PRIVATE_KEY = getEnv("GOOGLE_PRIVATE_KEY").replace(
  /\\n/g,
  "\n"
);

export const SUPABASE_URL = getEnv("SUPABASE_URL"); // ✅ new
export const SUPABASE_ANON_KEY = getEnv("SUPABASE_ANON_KEY");
export const DATABASE_URL = getEnv("DATABASE_URL");
export const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");

export const PHONE_NUMBER_ID = getEnv("WHATSAPP_PHONE_NUMBER_ID");
export const WHATSAPP_ACCESS_TOKEN = getEnv("WHATSAPP_ACCESS_TOKEN");
export const WHATSAPP_VERIFY_TOKEN = getEnv("WHATSAPP_VERIFY_TOKEN");

export const MESSENGER_VERIFY_TOKEN = getEnv("MESSENGER_VERIFY_TOKEN");
// ✅ Optional with defaults
export const PORT = parseInt(process.env.PORT || "4000", 10);
export const HOST = process.env.HOST || "0.0.0.0";

export const FB_PAGE_ACCESS_TOKEN = getEnv("FB_PAGE_ACCESS_TOKEN");
export const FB_GRAPH_API = "https://graph.facebook.com/v23.0";

// ✅ New AI/Voice keys
export const ELEVENLABS_API_KEY = getEnv("ELEVENLABS_API_KEY");

export const DEEPGRAM_API_KEY = getEnv("DEEPGRAM_API_KEY");
export const DEEPGRAM_WS_URL = getEnv("DEEPGRAM_WS_URL");
