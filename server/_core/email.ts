import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type EmailPayload = {
  to: string;
  subject: string;
  content: string; // HTML content
  attachments?: EmailAttachment[];
};

/**
 * 使用 Resend API 发送邮件（支持附件）
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[Email] RESEND_API_KEY is missing");
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: "Vertex Advanced Manufacturing <hello@vertexadvancedmanufacturing.com>",
      to: payload.to,
      subject: payload.subject,
      html: payload.content,
      attachments: payload.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    console.log(
      `[Email] Successfully sent email to ${payload.to}`,
      result
    );

    return true;

  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}