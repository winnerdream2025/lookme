import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.S3_BUCKET_NAME || "";
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

export async function uploadReferenceToS3(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  if (!BUCKET) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  const ext = originalName.split(".").pop() || "jpg";
  const key = `references/${randomBytes(16).toString("hex")}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    })
  );

  if (CLOUDFRONT_URL) {
    return `${CLOUDFRONT_URL}/${key}`;
  }
  return `https://${BUCKET}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}
