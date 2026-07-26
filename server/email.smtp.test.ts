import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
    })),
  },
}));

describe("sendEmail SMTP", () => {
  beforeEach(() => {
    process.env.SMTP_HOST = "smtp.share-email.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "hello@vertexadvancedmanufacturing.com";
    process.env.SMTP_PASS = "test-password";
    process.env.SMTP_FROM = "Vertex Manufacturing <hello@vertexadvancedmanufacturing.com>";
  });

  it("should send email successfully when SMTP config is provided", async () => {
    const { sendEmail } = await import("./_core/email");
    const result = await sendEmail({
      to: "laiqiongjin2@gmail.com",
      subject: "Test Subject",
      content: "<p>Test content</p>",
    });
    expect(result).toBe(true);
  });

  it("should return false when SMTP config is missing", async () => {
    delete process.env.SMTP_HOST;
    const { sendEmail } = await import("./_core/email");
    const result = await sendEmail({
      to: "laiqiongjin2@gmail.com",
      subject: "Test Subject",
      content: "<p>Test content</p>",
    });
    expect(result).toBe(false);
  });
});
