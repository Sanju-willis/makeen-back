// src\utils\parsers\messengerParser.ts
type MessengerEvent = {
  sender: { id: string };
  message?: {
    mid: string;
    text?: string;
    attachments?: {
      type: string;
      payload: {
        url: string;
        attachment_id?: string;
      };
    }[];
  };
};

type ParsedMessengerMessage = {
  user: {
    senderId: string;
    name?: string; // optionally resolved later
  };
  message: {
    msgType: "text" | "image" | "unsupported";
    text?: string;
    mediaId?: string; // can be the attachment ID or URL
  };
};

/**
 * Extracts messages from the raw Messenger webhook body
 */
export const parseMessengerWebhook = (body: any): ParsedMessengerMessage[] => {
  const result: ParsedMessengerMessage[] = [];

  if (!body.entry || !Array.isArray(body.entry)) return result;

  for (const entry of body.entry) {
    const messagingEvents = entry.messaging || [];

    for (const event of messagingEvents as MessengerEvent[]) {
      const senderId = event.sender.id;

      if (event.message?.text) {
        result.push({
          user: { senderId },
          message: {
            msgType: "text",
            text: event.message.text,
          },
        });
      } else if (event.message?.attachments?.length) {
        const attachment = event.message.attachments[0];
        if (attachment.type === "image") {
          result.push({
            user: { senderId },
            message: {
              msgType: "image",
              mediaId: attachment.payload.attachment_id || attachment.payload.url,
            },
          });
        } else {
          result.push({
            user: { senderId },
            message: {
              msgType: "unsupported",
            },
          });
        }
      }
    }
  }

  return result;
};
