// src\types\service-types.ts
export type AgentRouteInput = {
  user: {
    id: string;
    name: string;
    platform: string;
  };
  message: {
    userInput: string;
    extractedText?: string;
    msgType?: "text" | "image" | "audio" | "video";
  };
};