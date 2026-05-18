import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware — runs before every matched request.
 *
 * Protected routes require the `lookme_logged_in` cookie that is written by
 * session.set() in lib/auth.ts when the user signs in.  Because the cookie is
 * not httpOnly, it is set by client-side JS alongside the localStorage tokens.
 *
 * Unauthenticated visitors are redirected to /login?redirect=<original-path>
 * so they land back on the right page after signing in.
 */

const ALL_AUTHENTICATED = ["/dashboard"];
const WORKER_ROUTES = ["/my-tasks", "/earnings", "/tasks"];
const CLIENT_ROUTES = ["/orders"];

const PROTECTED_PREFIXES = [...ALL_AUTHENTICATED, ...WORKER_ROUTES, ...CLIENT_ROUTES];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const role = req.cookies.get("lookme_logged_in")?.value;

  if (!role) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isWorkerRoute = WORKER_ROUTES.some((p) => pathname.startsWith(p));
  if (isWorkerRoute && role !== "worker" && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isClientRoute = CLIENT_ROUTES.some((p) => pathname.startsWith(p));
  if (isClientRoute && role !== "client" && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/my-tasks/:path*", "/earnings/:path*", "/tasks/:path*"],
};
