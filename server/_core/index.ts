import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import multer from "multer";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { storagePut } from "../storage";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// In-memory file cache for email attachments (fileKey -> { buffer, mimetype, originalName })
// Entries expire after 30 minutes to avoid memory leaks
export const fileCache = new Map<string, { buffer: Buffer; mimetype: string; originalName: string; expiresAt: number }>();

setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  fileCache.forEach((val, key) => {
    if (val.expiresAt < now) keysToDelete.push(key);
  });
  keysToDelete.forEach(key => fileCache.delete(key));
}, 5 * 60 * 1000); // cleanup every 5 minutes

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "200mb" }));
  app.use(express.urlencoded({ limit: "200mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // File upload endpoint: POST /api/upload
  // Uses multer (memory storage) to handle multipart/form-data file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB per file
  });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }
      const originalName = req.file.originalname;
      // Sanitize filename: replace special chars with underscore
      const ext = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')) : '';
      const baseName = originalName.slice(0, originalName.length - ext.length);
      const safeName = baseName.replace(/[^a-zA-Z0-9._\-]/g, '_');
      const hash = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
      const storageKey = `contact-uploads/${safeName}_${hash}${ext}`;

      // Cache file buffer in memory for 30 minutes (used for email attachment)
      const cacheKey = `${hash}_${safeName}${ext}`;
      fileCache.set(cacheKey, {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype || 'application/octet-stream',
        originalName,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });

      const result = await storagePut(storageKey, req.file.buffer, req.file.mimetype || 'application/octet-stream');

      res.json({ storageUrl: result.url, originalName, cacheKey });
    } catch (e) {
      console.error("[Upload] Error:", e);
      res.status(500).json({ error: "Upload failed" });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
