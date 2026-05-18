import { env } from "./env";
import { session } from "./auth";
import type { ApiEnvelope } from "./types";

/**
 * Typed fetch wrapper for the LookMe API.
 *
 * - All requests go through the API gateway.
 * - Auto-attaches Bearer token from session.
 * - On 401: clears session and redirects to /login.
 * - Throws a plain Error with the server's message on non-2xx.
 * - Returns the unwrapped `data` field from the API envelope.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = session.token;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, { ...options, headers });

  if (res.status === 401) {
    session.clear();
    if (typeof window !== "undefined") {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Session expired. Please sign in again.");
  }

  // Check if response is JSON
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Non-JSON response:", text.substring(0, 200));
    throw new Error("Server error. Please try again later.");
  }

  const json: ApiEnvelope<T> = await res.json();

  if (!res.ok || !json.success) {
    const msg = (json as Extract<ApiEnvelope<T>, { success: false }>).error?.message;
    throw new Error(msg || "An unexpected error occurred.");
  }

  return (json as Extract<ApiEnvelope<T>, { success: true }>).data;
}

export const apiGet  = <T>(path: string)                   => apiFetch<T>(path);
export const apiPost = <T>(path: string, body: unknown)    => apiFetch<T>(path, { method: "POST",  body: JSON.stringify(body) });
export const apiPatch= <T>(path: string, body: unknown)    => apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) });
export const apiDel  = <T>(path: string)                   => apiFetch<T>(path, { method: "DELETE" });

/**
 * Upload a file via multipart FormData (no Content-Type header — browser sets boundary).
 */
export async function apiUpload<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("screenshot", file);

  const headers: Record<string, string> = {};
  const token = session.token;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401) {
    session.clear();
    if (typeof window !== "undefined") {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Session expired. Please sign in again.");
  }

  const json: ApiEnvelope<T> = await res.json();

  if (!res.ok || !json.success) {
    const msg = (json as Extract<ApiEnvelope<T>, { success: false }>).error?.message;
    throw new Error(msg || "An unexpected error occurred.");
  }

  return (json as Extract<ApiEnvelope<T>, { success: true }>).data;
}

/**
 * Upload a file via multipart FormData without authentication (for guest order flows).
 */
export async function apiGuestUpload<T>(path: string, file: File, fieldName = "reference"): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const res = await fetch(`${env.apiUrl}${path}`, { method: "POST", body: formData });

  const json: ApiEnvelope<T> = await res.json();

  if (!res.ok || !json.success) {
    const msg = (json as Extract<ApiEnvelope<T>, { success: false }>).error?.message;
    throw new Error(msg || "Upload failed. Please try again.");
  }

  return (json as Extract<ApiEnvelope<T>, { success: true }>).data;
}

/**
 * Authenticated file download — fetches with Bearer token and triggers browser save-as.
 * Used for admin CSV exports that require auth.
 */
export async function apiDownload(path: string, filename: string): Promise<void> {
  const headers: Record<string, string> = {};
  const token = session.token;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, { headers });

  if (res.status === 401) {
    session.clear();
    if (typeof window !== "undefined") {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) throw new Error("Download failed. Please try again.");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Guest (unauthenticated) POST — no Bearer token, just sends the body.
 * Used for order creation, auth endpoints, etc.
 */
export const apiGuestPost = <T>(path: string, body: unknown) =>
  fetch(`${env.apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (res) => {
    const json: ApiEnvelope<T> = await res.json();
    if (!res.ok || !json.success) {
      const msg = (json as Extract<ApiEnvelope<T>, { success: false }>).error?.message;
      throw new Error(msg || "An unexpected error occurred.");
    }
    return (json as Extract<ApiEnvelope<T>, { success: true }>).data;
  });
