import crypto from "crypto";
import { config } from "@lookme/config";

// Derive a dedicated key so media tokens are namespaced from JWT tokens
const MEDIA_SECRET = config.jwt.secret + "_lookme_media_v1";

const TTL_SECONDS = 90 * 60; // 90 minutes max to complete a media task

export interface MediaSessionPayload {
  taskId: string;
  workerId: string;
  issuedAt: number;   // Unix timestamp ms
  requiredSeconds: number;
  mediaType: string;  // "youtube" | "tiktok" | "spotify" | "website"
}

/**
 * Signs a media session payload with HMAC-SHA256.
 * Token format: base64url(payload).signature
 * A valid token proves the worker legitimately opened the task page.
 * Without the server SECRET, Postman cannot forge a valid token.
 */
export function createMediaSessionToken(payload: MediaSessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", MEDIA_SECRET)
    .update(encoded)
    .digest("hex");
  return `${encoded}.${sig}`;
}

/**
 * Verifies a media session token.
 * Throws a descriptive error if invalid, expired, or tampered.
 */
export function verifyMediaSessionToken(
  token: string,
  expectedTaskId: string,
  expectedWorkerId: string
): MediaSessionPayload {
  const parts = token.split(".");
  if (parts.length !== 2) {
    throw new Error("INVALID_SESSION_TOKEN: malformed token");
  }

  const encoded = parts[0] as string;
  const sig = parts[1] as string;

  // Verify HMAC signature (constant-time comparison prevents timing attacks)
  const expectedSig = crypto
    .createHmac("sha256", MEDIA_SECRET)
    .update(encoded)
    .digest("hex");

  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expectedSig, "hex");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error("INVALID_SESSION_TOKEN: signature mismatch — possible tampering");
  }

  let payload: MediaSessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw new Error("INVALID_SESSION_TOKEN: cannot decode payload");
  }

  // Verify token belongs to this task and worker
  if (payload.taskId !== expectedTaskId) {
    throw new Error("INVALID_SESSION_TOKEN: task mismatch");
  }
  if (payload.workerId !== expectedWorkerId) {
    throw new Error("INVALID_SESSION_TOKEN: worker mismatch");
  }

  // Verify TTL
  const elapsedSeconds = (Date.now() - payload.issuedAt) / 1000;
  if (elapsedSeconds > TTL_SECONDS) {
    throw new Error(`SESSION_EXPIRED: token issued ${Math.round(elapsedSeconds / 60)} minutes ago (max ${TTL_SECONDS / 60} min)`);
  }

  return payload;
}

/**
 * Detect media type from URL to know which IFrame API to use.
 */
export function detectMediaType(url: string): string {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/open\.spotify\.com/i.test(url)) return "spotify";
  if (/soundcloud\.com/i.test(url)) return "soundcloud";
  return "website";
}

/**
 * Extract YouTube video ID from any YouTube URL format.
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}
