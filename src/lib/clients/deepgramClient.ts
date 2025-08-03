// src\lib\clients\deepgramClient.ts
import WebSocket from "ws";
import { DEEPGRAM_API_KEY, DEEPGRAM_WS_URL } from "@/config/env";

export type DeepgramClientEvents = {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onError?: (err: Error) => void;
  onClose?: () => void;
};

export function createDeepgramClient(events: DeepgramClientEvents = {}) {
  const ws = new WebSocket(DEEPGRAM_WS_URL, [], {
    headers: { Authorization: `Token ${DEEPGRAM_API_KEY}` },
  });

  ws.on("open", () => {
    console.log("✅ Deepgram client connected");

    ws.send(
      JSON.stringify({
        type: "Configure",
        processors: {
          stt: {
            language: "en-US",
            model: "nova-2",
            encoding: "linear16",
            sample_rate: 16000,
            channels: 1,
            interim_results: false,
            utterance_end_ms: 1000,
            vad_events: true,
          },
        },
      })
    );

    events.onOpen?.();
  });

  ws.on("message", (data) => {
    try {
      const json = JSON.parse(data.toString());
      events.onMessage?.(json);
    } catch (err) {
      console.error("❌ Deepgram message parse error:", err);
    }
  });

  ws.on("error", (err) => {
    console.error("❌ Deepgram WebSocket error:", err);
    events.onError?.(err);
  });

  ws.on("close", () => {
    console.log("🔴 Deepgram WebSocket closed");
    events.onClose?.();
  });

  return ws;
}
