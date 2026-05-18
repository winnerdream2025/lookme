/**
 * Centralised session management.
 *
 * Tokens live in localStorage (client-only) so JS can attach them to every
 * request. A lightweight non-httpOnly cookie (`lookme_logged_in`) is also
 * written so the Next.js Edge middleware can protect routes without a
 * round-trip to the API.
 */

const KEY_ACCESS  = "accessToken";
const KEY_REFRESH = "refreshToken";
const KEY_ROLE    = "userRole";
const COOKIE_NAME = "lookme_logged_in";
const COOKIE_TTL  = 60 * 60 * 24 * 7; // 7 days

function isClient() {
  return typeof window !== "undefined";
}

/**
 * Decode JWT token to extract user ID
 * Returns null if token is invalid or doesn't contain userId
 */
function decodeToken(token: string): { userId: string } | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return decoded.userId ? { userId: decoded.userId } : null;
  } catch {
    return null;
  }
}

export const session = {
  /** Returns the stored Bearer token, or null. */
  get token(): string | null {
    return isClient() ? localStorage.getItem(KEY_ACCESS) : null;
  },

  /** Returns the stored user role, or null. */
  get role(): string | null {
    return isClient() ? localStorage.getItem(KEY_ROLE) : null;
  },

  /** Returns the user ID from the JWT token, or null. */
  get userId(): string | null {
    const token = this.token;
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded?.userId || null;
  },

  /** Returns true when a session token is present. */
  get isAuthenticated(): boolean {
    return Boolean(this.token);
  },

  /**
   * Persist tokens + role after a successful login / register / save-order.
   * Also writes a non-httpOnly cookie so the Edge middleware can read it.
   */
  set(
    tokens: { accessToken: string; refreshToken: string },
    role: string
  ): void {
    if (!isClient()) return;
    localStorage.setItem(KEY_ACCESS,  tokens.accessToken);
    localStorage.setItem(KEY_REFRESH, tokens.refreshToken);
    localStorage.setItem(KEY_ROLE,    role);
    document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=${COOKIE_TTL}; SameSite=Lax`;
  },

  /** Wipes all session data and the indicator cookie. */
  clear(): void {
    if (!isClient()) return;
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
    localStorage.removeItem(KEY_ROLE);
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  },
};
