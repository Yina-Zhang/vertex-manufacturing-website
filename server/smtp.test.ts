import { describe, it, expect } from "vitest";
import nodemailer from "nodemailer";

describe("Domain SMTP connectivity — hello@vertexadvancedmanufacturing.com", () => {
  it("should verify SMTP credentials successfully", async () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    expect(host).toBe("smtp.share-email.com");
    expect(user).toBeTruthy();
    expect(pass).toBeTruthy();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      authMethod: "LOGIN",
    });

    // verify() checks credentials without sending an email
    const result = await transporter.verify();
    expect(result).toBe(true);
  }, 15000);
});
