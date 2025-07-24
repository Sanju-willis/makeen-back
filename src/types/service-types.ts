// src\types\service-types.ts

export type UserInfo = {
  id: string;
  name: string;
  platform: string;
};

export type MessageInput = {
  userInput: string;
  extractedText?: string;
  msgType?: "text" | "image" | "audio" | "video" | "unsupported";
  mediaId?: string;   
  timestamp?: number;
  
};

export type AgentRouteInput = {
  user: UserInfo;
  message: MessageInput;
};
