import { COOKIE_NAME } from "@shared/const";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { getInquiries, saveInquiry } from "./db";
import { sendEmail } from "./_core/email";
import { storagePut } from "./storage";
import { buildZip } from "./_core/zipBuilder";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    uploadFile: publicProcedure
      .input(
        z.object({
          fileName: z.string().min(1, "File name is required"),
          fileData: z.string(), // base64 encoded file data
          fileType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // 将 base64 转换为 Buffer
          const fileBuffer = Buffer.from(input.fileData, 'base64');

          // 清理文件名：移除特殊字符，避免 S3 key 路径问题
          const ext = input.fileName.includes('.') ? input.fileName.slice(input.fileName.lastIndexOf('.')) : '';
          const baseName = input.fileName.slice(0, input.fileName.length - ext.length);
          const safeName = baseName.replace(/[^a-zA-Z0-9._\-]/g, '_') + ext;
          const hash = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
          const storageKey = `contact-uploads/${safeName}_${hash}${ext ? '' : ''}`;

          // 使用 storagePut 函数上传文件到 S3
          const result = await storagePut(
            storageKey,
            fileBuffer,
            input.fileType || "application/octet-stream"
          );

          return {
            storageUrl: result.url,
          };
        } catch (error) {
          console.error("[Contact] Error uploading file:", error);
          throw error;
        }
      }),
    getUploadUrl: publicProcedure
      .input(
        z.object({
          fileName: z.string().min(1, "File name is required"),
          fileSize: z.number().positive("File size must be positive"),
          fileType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const forgeUrl = ENV.forgeApiUrl.replace(/\/+$/, "");
          const forgeKey = ENV.forgeApiKey;

          if (!forgeUrl || !forgeKey) {
            throw new Error("Storage config missing");
          }

          // 生成唯一的文件名
          const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
          const lastDot = input.fileName.lastIndexOf(".");
          const storageKey = lastDot === -1
            ? `contact-uploads/${Date.now()}-${input.fileName}_${hash}`
            : `contact-uploads/${Date.now()}-${input.fileName.slice(0, lastDot)}_${hash}${input.fileName.slice(lastDot)}`;

          // 获取 presigned PUT URL
          const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
          presignUrl.searchParams.set("path", storageKey);

          const presignResp = await fetch(presignUrl, {
            headers: { Authorization: `Bearer ${forgeKey}` },
          });

          if (!presignResp.ok) {
            const msg = await presignResp.text().catch(() => presignResp.statusText);
            throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
          }

          const { url: s3Url } = (await presignResp.json()) as { url: string };
          if (!s3Url) throw new Error("Forge returned empty presign URL");

          // 注意：presigned URL 方式已被弃用，改用后端代理上传
          // 这个端点保留用于兼容性，但建议使用 uploadFile 端点
          return {
            presignedUrl: s3Url,
            storageUrl: `/manus-storage/${storageKey}`,
          };
        } catch (error) {
          console.error("[Contact] Error getting upload URL:", error);
          throw error;
        }
      }),
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().optional(),
          customerType: z.enum(["Company", "Individual"]),
          country: z.string().min(1, "Country is required"),
          processType: z.string().min(1, "Process type is required"),
          description: z.string().optional(),
          files: z.array(z.object({
            name: z.string(),
            url: z.string(),
            cacheKey: z.string().optional(),
          })).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const uploadedFiles: Array<{ name: string; url: string; cacheKey?: string }> = input.files || [];

          // Build absolute download URLs for each uploaded file
          // Files are stored in S3 and served via /manus-storage/... proxy
          // We embed clickable links in the email body instead of attaching binary files
          // to avoid Gmail's 25MB attachment size limit
          const fileLinks = uploadedFiles.map(f => {
            // url is like /manus-storage/contact-uploads/filename_hash.ext
            // Make it absolute so it works in email clients
            const absoluteUrl = `https://vertexadvancedmanufacturing.com${f.url}`;
            return { name: f.name, url: absoluteUrl };
          });

          const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];

          // 构建专业邮件模板（带品牌 Logo 和主色调）
          const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color:#1a2744;padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663721880165/e72ycqGG8W9hJvw2RydPCE/vertex-logo-G7rT2qqWsHHMPtRoxZ6ccN.webp"
                         alt="Vertex Manufacturing"
                         width="120"
                         style="display:block;height:auto;" />
                  </td>
                  <td align="right" style="color:#b8966e;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                    New Quote Request
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="background-color:#b8966e;height:4px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px;">
              <h2 style="margin:0 0 6px 0;font-size:22px;color:#1a2744;font-weight:700;">Quote Request Received</h2>
              <p style="margin:0 0 28px 0;font-size:14px;color:#666;">A new inquiry has been submitted via the Vertex website.</p>

              <!-- Customer Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f8f8f8;border-left:4px solid #b8966e;padding:16px 20px;border-radius:0 4px 4px 0;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#b8966e;text-transform:uppercase;letter-spacing:1px;">Customer Information</p>
                    <table width="100%" cellpadding="4" cellspacing="0" style="margin-top:10px;">
                      <tr>
                        <td style="font-size:13px;color:#888;width:120px;">Name</td>
                        <td style="font-size:14px;color:#1a2744;font-weight:600;">${input.name}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;">Email</td>
                        <td style="font-size:14px;color:#1a2744;"><a href="mailto:${input.email}" style="color:#b8966e;text-decoration:none;">${input.email}</a></td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;">Phone</td>
                        <td style="font-size:14px;color:#1a2744;">${input.phone || "—"}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;">Type</td>
                        <td style="font-size:14px;color:#1a2744;">${input.customerType}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;">Country</td>
                        <td style="font-size:14px;color:#1a2744;">${input.country}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Project Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f8f8f8;border-left:4px solid #1a2744;padding:16px 20px;border-radius:0 4px 4px 0;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#1a2744;text-transform:uppercase;letter-spacing:1px;">Project Details</p>
                    <table width="100%" cellpadding="4" cellspacing="0" style="margin-top:10px;">
                      <tr>
                        <td style="font-size:13px;color:#888;width:120px;">Process Type</td>
                        <td style="font-size:14px;color:#1a2744;font-weight:600;">${input.processType}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;vertical-align:top;">Description</td>
                        <td style="font-size:14px;color:#1a2744;">${input.description || "—"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${fileLinks.length > 0 ? `
              <!-- Uploaded Files -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f8f8f8;border-left:4px solid #4a90d9;padding:16px 20px;border-radius:0 4px 4px 0;">
                    <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;color:#4a90d9;text-transform:uppercase;letter-spacing:1px;">Project Files (${fileLinks.length})</p>
                    ${fileLinks.map(f => `<p style="margin:6px 0;font-size:14px;">&#128206; <a href="${f.url}" style="color:#4a90d9;text-decoration:none;font-weight:600;">${f.name}</a></p>`).join('')}
                    <p style="margin:10px 0 0 0;font-size:12px;color:#888;">Click each file name above to download directly.</p>
                  </td>
                </tr>
              </table>` : ''}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <a href="mailto:${input.email}?subject=Re: Your Quote Request"
                       style="display:inline-block;background-color:#b8966e;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 32px;border-radius:4px;letter-spacing:0.5px;">
                      Reply to Customer
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1a2744;padding:20px 36px;">
              <p style="margin:0;font-size:12px;color:#8899bb;text-align:center;">
                Vertex Advanced Manufacturing &nbsp;|&nbsp; Shenzhen, China &nbsp;|&nbsp;
                <a href="https://vertexadvancedmanufacturing.com" style="color:#b8966e;text-decoration:none;">vertexadvancedmanufacturing.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `.trim();

          // 异步后台发送邮件（不阻塞响应）
          const emailPayload = {
            subject: `[New Quote] ${input.name} — ${input.processType} (${input.country})`,
            content: emailContent,
            attachments: [], // Files are linked in email body, not attached as binary
          };

          // 保存询价记录到数据库（不阻塞响应）
          saveInquiry({
            name: input.name,
            email: input.email,
            phone: input.phone ?? null,
            customerType: input.customerType,
            country: input.country,
            processType: input.processType,
            description: input.description ?? null,
            filesJson: uploadedFiles.length > 0
              ? JSON.stringify(uploadedFiles.map(f => f.name))
              : null,
            filesMetaJson: fileLinks.length > 0
              ? JSON.stringify(fileLinks)
              : null,
          }).catch(err => console.error("[Contact] Failed to save inquiry to DB:", err));

          // 立即返回成功，邮件在后台异步发送
          const notificationContent = `
**New Quote Request from Vertex Website**

**Customer Information:**
- Name: ${input.name}
- Email: ${input.email}
- Phone: ${input.phone || "Not provided"}
- Type: ${input.customerType}
- Country: ${input.country}

**Project Details:**
- Process Type: ${input.processType}
- Description: ${input.description || "Not provided"}${fileLinks.length > 0 ? "\n\n**Uploaded Files:**\n" + fileLinks.map(f => `- [${f.name}](${f.url})`).join("\n") : ""}

**Reply to:** ${input.email}
          `.trim();

          // 后台发送邮件，不 await
          sendEmail({ ...emailPayload, to: "laiqiongjin2@gmail.com" })
            .catch(err => console.error("[Contact] Background email error:", err));

          return {
            success: true,
            message: "Your quote request has been sent successfully. We will contact you within 24 hours.",
          };
        } catch (error) {
          console.error("[Contact] Error submitting form:", error);
          throw error;
        }
      }),
  }),

  admin: router({
    getInquiries: adminProcedure
      .query(async () => {
        const rows = await getInquiries(500);
        return rows.map(r => ({
          ...r,
          files: r.filesJson ? (JSON.parse(r.filesJson) as string[]) : [],
          filesMeta: r.filesMetaJson
            ? (JSON.parse(r.filesMetaJson) as Array<{ name: string; url: string }>)
            : [],
        }));
      }),
  }),
});

export type AppRouter = typeof appRouter;
