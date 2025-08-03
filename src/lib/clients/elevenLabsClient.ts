// src\lib\clients\elevenLabsClient.ts
import { ElevenLabsClient } from "elevenlabs";
import { ELEVENLABS_API_KEY } from "@/config/env";

export const elevenLabsClient = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});
