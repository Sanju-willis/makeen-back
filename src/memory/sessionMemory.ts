// src\memory\sessionMemory.ts
import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const memoryMap = new Map<string, BufferMemory>();

export const getSessionMemory = (
  sessionId: string
): BufferMemory & { __bookContext?: any } => {
  if (!memoryMap.has(sessionId)) {
    const memory = new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
      inputKey: "input",
      outputKey: "output",
      chatHistory: new ChatMessageHistory(),
    });

    memoryMap.set(sessionId, memory);
  }

  return memoryMap.get(sessionId)!;
};

