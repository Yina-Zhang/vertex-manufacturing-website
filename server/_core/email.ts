import nodemailer from "nodemailer";

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
 * 使用 SMTP 发送邮件（支持附件）
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) {
    console.error("[Email] SMTP configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS)");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
      authMethod: "LOGIN", // share-email.com requires LOGIN auth
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.content,
    };

    if (payload.attachments && payload.attachments.length > 0) {
      mailOptions.attachments = payload.attachments.map(a => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      }));
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(`[Email] Successfully sent email to ${payload.to}, messageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}
