"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { session } from "@/lib/auth";
import { apiGuestPost, apiPost, apiGet } from "@/lib/api";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

function SaveOrderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setFetching(false); return; }
    apiGet<{ order?: { guestEmail?: string; guestName?: string } }>(`/orders/track/${token}`)
      .then((d) => {
        const order = (d as any)?.order ?? d;
        if ((order as any)?.guestEmail) setEmail((order as any).guestEmail);
        if ((order as any)?.guestName) setFirstName((order as any).guestName.split(" ")[0]);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const regData = await apiGuestPost<{ tokens: { accessToken: string; refreshToken: string } }>(
        "/auth/register",
        { email, password, role: "client", firstName: firstName.trim() || email.split("@")[0], lastName: "" }
      );
      session.set(regData.tokens, "client");
      if (token) await apiPost("/orders/claim", { trackingToken: token });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 bg-[#F6F5F3]">
        <div className="text-center">
          <p className="font-semibold text-neutral-900 mb-2">Invalid link</p>
          <Link href="/pricing" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#0A0A0A] text-white text-sm font-semibold hover:bg-neutral-800 transition-colors">Browse services</Link>
        </div>
      </div>
    );
  }

  if (fetching) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-16 bg-[#F6F5F3]">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.75"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Save your order</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create a password to access your order history and track future orders.
          </p>
        </div>

        {/* Email display (read-only — from order) */}
        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2.5">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-sm">
            <span className="text-green-700 font-medium">Order found for </span>
            <span className="font-semibold text-green-900">{email}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              First name <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Choose a password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <ErrorBanner message={error} />

          <Button
            type="submit"
            variant="svcPrimary"
            size="lg"
            loading={loading}
            className="w-full rounded-full"
            arrowRight
          >
            Create account & claim order
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-neutral-100 text-center space-y-2">
          <p className="text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href={`/login?token=${token}`} className="text-neutral-700 font-medium underline underline-offset-2">
              Sign in instead
            </Link>
          </p>
          <p className="text-xs text-neutral-400">
            No thanks —{" "}
            <Link href={`/track/${token}`} className="text-neutral-700 font-medium underline underline-offset-2">
              track as guest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SaveOrderPage() {
  return (
    <Suspense>
      <SaveOrderInner />
    </Suspense>
  );
}
