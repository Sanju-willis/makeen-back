// src\controllers\chatController.ts
import { parseWebchatRequest } from "@/utils/parsers/parseWebchatRequest";
//import { parseWebchatAnalytics } from "../parsers/parseWebchatAnalytics";
import { extractImageText } from "../utils/transcription/extractImageText";
import { routeToAgent } from "../services/agentRouterService";
import type { HandleChatMessageInput } from "../types/controller-types";

export const handleChatMessage = async ({
  message,
  userId,
  file,
  req,
  platform,
}: HandleChatMessageInput) => {
  //req.log.info("📥 Incoming message:", message || "(empty)");
  // if (sessionId) req.log.info("🧾 Session ID:", sessionId);
  //  if (file) req.log.info("📎 File received:", file.filename);

  //if (req) { parseWebchatAnalytics(req);  }

  const parsed = await parseWebchatRequest({ message, file, userId,platform  });
  const parsedMsg = parsed.message;
  const user = parsed.user;

  //console.log("🧾 Parsed input:", parsed);

  const userInput = parsedMsg.text || parsedMsg.caption || "";
  let extractedText = "";

  switch (parsedMsg.msgType) {
    case "text":
      break;
    case "image":
      if (!parsedMsg.buffer) return { reply: "❌ Missing image buffer." };
      //req.log.info("🖼 Extracting image content...");
      extractedText = await extractImageText(parsedMsg.buffer);
      break;
    case "audio":
      return { reply: "🔊 Audio parsing not implemented yet." };
    case "video":
      return { reply: "🎞️ Video parsing not implemented yet." };
    default:
      return { reply: "❌ Unsupported message type." };
  }

  if (!userInput && !extractedText) {
    return { reply: "❌ No usable message content found." };
  }
  //console.log(parsedMsg.msgType, "💬 Final message content");
  const { output } = await routeToAgent({
    user,
    message: {
      userInput,
      extractedText,
      msgType: parsedMsg.msgType,
    },
  });
  //console.log(message, "💬 Final message content");

  return {
    reply: output,
    userId: user.id,
  };
};
