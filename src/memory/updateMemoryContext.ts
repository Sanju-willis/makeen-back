// src\memory\updateMemoryContext.ts
import { getSessionMemory } from "./sessionMemory";

type ContextData = {
  intent?: string;
  bookTitle?: string;
  author?: string;
  orderId?: string;
  name?: string;
  email?: string;
  complaintText?: string;
  platform?: string;
  [key: string]: any;
};

/**
 * Updates the session memory with persistent structured context.
 */
export function updateMemoryContext(sessionId: string, context: ContextData) {
  const memory = getSessionMemory(sessionId);

  if (!(memory as any).__context) {
    (memory as any).__context = {};
  }

  Object.assign((memory as any).__context, context);
}
