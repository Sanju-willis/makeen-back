// src\utils\sendEmail.ts
// src/utils/sendEmail.ts

type EmailInput = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail({ to, subject, body }: EmailInput) {
  console.log(`📧 Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  // TODO: Replace with actual email API (e.g. Resend, Postmark, SES)
}
