// src\utils\analytics\extractMessengerAnalytics.ts
import type { FastifyRequest } from "fastify";

export type MessengerAnalytics = {
  ipAddress: string | undefined;
  userAgent: string | undefined;
  apiVersion: string | undefined;
  signature256: string | undefined;
  forwardedHost: string | undefined;
  forwardedProto: string | undefined;
};

export const extractMessengerAnalytics = (
  headers: FastifyRequest["headers"]
): MessengerAnalytics => {
  const getHeader = (key: keyof FastifyRequest["headers"]): string | undefined => {
    const val = headers[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const analytics: MessengerAnalytics = {
    ipAddress: getHeader("x-forwarded-for"),
    userAgent: getHeader("user-agent"),
    apiVersion: getHeader("facebook-api-version"),
    signature256: getHeader("x-hub-signature-256"),
    forwardedHost: getHeader("x-forwarded-host"),
    forwardedProto: getHeader("x-forwarded-proto"),
  };

  console.log(`📊 Messenger Webhook Analytics:
  🌐 IP Address:         ${analytics.ipAddress || "N/A"}
  🔍 Geo (lookup IP):    ${
    analytics.ipAddress ? `https://ipinfo.io/${analytics.ipAddress}` : "N/A"
  }
  🧾 User Agent:         ${analytics.userAgent || "N/A"}
  🔢 API Version:        ${analytics.apiVersion || "N/A"}
  📦 Forwarded Host:     ${analytics.forwardedHost || "N/A"}
  🔐 Signature (SHA256): ${analytics.signature256?.slice(0, 16) || "N/A"}...
  ☁️ Protocol Used:      ${analytics.forwardedProto || "N/A"}
  `);

  return analytics;
};
