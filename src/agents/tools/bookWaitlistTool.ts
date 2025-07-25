// src\agents\tools\bookWaitlistTool.ts
import { z } from "zod";
import { StructuredTool } from "langchain/tools";
import { saveWaitlistRequest } from "./services/waitlistService";
import { sendEmail } from "@/utils/sendEmail";

const waitlistSchema = z.object({
  title: z.string().describe("Title of the book"),
  author: z.string().optional().describe("Author of the book, if known"),
  contactMethod: z.enum(["email", "phone"]),
  contactValue: z.string().describe("User's email or phone number"),
});

export class BookWaitlistTool extends StructuredTool {
  name = "add_user_to_book_waitlist";
  description =
    "Use this when a book is not available and the user wants to be contacted when it’s back.";

  schema = waitlistSchema;

  async _call({
    title,
    author,
    contactMethod,
    contactValue,
  }: z.infer<typeof waitlistSchema>) {
    await saveWaitlistRequest({ title, author, contactMethod, contactValue });

    await sendEmail({
      to: contactValue,
      subject: `We'll notify you when "${title}" is available`,
      body: `Thank you! We'll let you know as soon as "${title}" is back in stock.`,
    });

    return `📚 Got it! We'll notify you when "${title}" is available.`;
  }
}

export const bookWaitlistTool = new BookWaitlistTool();
