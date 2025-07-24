// src\config\visionClient.ts
import vision from "@google-cloud/vision";
import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from "./env";

export const visionClient = new vision.ImageAnnotatorClient({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // critical for escaping newlines
  },
});
