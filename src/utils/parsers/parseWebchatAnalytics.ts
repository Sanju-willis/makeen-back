// src\utils\parsers\parseWebchatAnalytics.ts
import type { FastifyRequest } from "fastify";
import { saveWebchatAnalytics } from "@/services/analytics/analyticsService";

export type WebchatAnalytics = {
  sessionId: string;
  ip: string;
  userAgent?: string;
  deviceType?: "mobile" | "tablet" | "desktop" | "bot" | "unknown";
  language?: string;
  referer?: string;
  origin?: string;
  host?: string;
  url?: string;
  method: string;
  contentType?: string;
  timestamp: Date;
};

const detectDeviceType = (userAgent?: string): WebchatAnalytics["deviceType"] => {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/bot|crawl|spider|slurp/.test(ua)) return "bot";
  if (/mobile|iphone|android/.test(ua)) return "mobile";
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mac|windows|linux/.test(ua)) return "desktop";
  return "unknown";
};

export const parseWebchatAnalytics = (req: FastifyRequest): void => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  const userAgent = req.headers["user-agent"];
  const sessionId = (req.body as any)?.sessionId || "anonymous";

  const data: WebchatAnalytics = {
    sessionId,
    ip,
    userAgent,
    deviceType: detectDeviceType(userAgent),
    language: req.headers["accept-language"],
    referer: req.headers["referer"],
    origin: req.headers["origin"],
    host: req.headers["host"],
    url: req.url,
    method: req.method,
    contentType: req.headers["content-type"],
    timestamp: new Date(),
  };

  saveWebchatAnalytics(data); // fire & forget
};
