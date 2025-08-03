// src\agents\tools\services\waitlistService.ts
import { queryClient } from "@/lib/clients/dbClient";

type WaitlistInput = {
  title: string;
  author?: string;
  contactMethod: "email" | "phone";
  contactValue: string;
};

export async function saveWaitlistRequest({
  title,
  author,
  contactMethod,
  contactValue,
}: WaitlistInput) {
  await queryClient`
    INSERT INTO book_waitlist (title, author, contact_method, contact_value)
    VALUES (${title}, ${author || null}, ${contactMethod}, ${contactValue})
  `;
}
