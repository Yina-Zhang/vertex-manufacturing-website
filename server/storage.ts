// Cloudflare R2 storage helpers
// Uploads files directly to R2.
// Downloads use signed Cloudflare R2 URLs.

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { ENV } from "./_core/env";

function getR2Config() {
  const accessKeyId = ENV.r2AccessKeyId;
  const secretAccessKey = ENV.r2SecretAccessKey;
  const endpoint = ENV.r2Endpoint;
  const bucketName = ENV.r2BucketName;

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
    throw new Error(
      "R2 config missing: set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT and R2_BUCKET_NAME",
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    endpoint: endpoint.replace(/\/+$/, ""),
    bucketName,
  };
}

function createR2Client() {
  const { accessKeyId, secretAccessKey, endpoint } = getR2Config();

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");

  if (lastDot === -1) {
    return `${relKey}_${hash}`;
  }

  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { bucketName } = getR2Config();
  const client = createR2Client();
  const key = appendHashSuffix(normalizeKey(relKey));

  const body =
    typeof data === "string"
      ? Buffer.from(data, "utf8")
      : Buffer.from(data);

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return {
    key,
    url: await storageGetSignedUrl(key),
  };
}

export async function storageGet(
  relKey: string,
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);

  return {
    key,
    url: await storageGetSignedUrl(key),
  };
}

export async function storageGetSignedUrl(
  relKey: string,
): Promise<string> {
  const { bucketName } = getR2Config();
  const client = createR2Client();
  const key = normalizeKey(relKey);

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: 7 * 24 * 60 * 60,
  });
}