// src\utils\sessionId.ts
export type GenerateSessionIdInput = {
  userId: string;
  platform: string;
};

export type SessionInfo = {
  id: string;
  lastIntent?: string;
};

export type GetOrCreateSessionIdInput = {
  userId: string;
  platform: string;
};

export type GetOrCreateSessionIdResult = {
  sessionId: string;
  isNew: boolean;
  lastIntent?: string;
};

export type UpdateSessionIntentInput = {
  userId: string;
  platform: string;
  intent: string;
};

export function generateSessionId({
  userId,
  platform,
}: GenerateSessionIdInput): string {
  const timestamp = Date.now();
  return `sess-${platform}-${userId}-${timestamp}`;
}

// In-memory store to keep session ID and last intent
const sessionMap = new Map<string, SessionInfo>();

/**
 * Returns the same session ID for a user if already created, else generates a new one.
 */
export function getOrCreateSessionId({
  userId,
  platform,
}: GetOrCreateSessionIdInput): GetOrCreateSessionIdResult {
  const key = `${platform}-${userId}`;

  const existing = sessionMap.get(key);
  if (existing) {
    return {
      sessionId: existing.id,
      isNew: false,
      lastIntent: existing.lastIntent,
    };
  }

  const sessionId = generateSessionId({ userId, platform });
  sessionMap.set(key, { id: sessionId });
  return { sessionId, isNew: true };
}

/**
 * Updates the last known intent for a session.
 */

export type UpdateSessionIntentParams = {
  sessionId: string;
  intent: string;
  confidence?: number;
};
export function updateSessionIntent({
  sessionId,
  intent,
  confidence,
}: UpdateSessionIntentParams): void {
  for (const [key, session] of sessionMap.entries()) {
    if (session.id === sessionId) {
      sessionMap.set(key, { ...session, lastIntent: intent });
      break;
    }
  }
}

export function getLastSessionIntent(sessionId: string): string | undefined {
  for (const session of sessionMap.values()) {
    if (session.id === sessionId) {
      return session.lastIntent;
    }
  }
  return undefined;
}
