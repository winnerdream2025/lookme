"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { session } from "@/lib/auth";
import { apiGuestPost, apiPost } from "@/lib/api";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingToken = searchParams.get("token");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirect = searchParams.get("redirect");

  // Redirect if already logged in
  useEffect(() => {
    if (session.isAuthenticated) {
      router.push(redirect || "/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiGuestPost<{ tokens: { accessToken: string; refreshToken: string }; user: { role: string } }>(
        "/auth/login",
        form
      );
      session.set(data.tokens, data.user.role);

      if (trackingToken) {
        await apiPost("/orders/claim", { trackingToken });
        router.push(`/dashboard?token=${trackingToken}`);
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push(data.user.role === "worker" ? "/dashboard?view=worker" : "/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F6F5F3]">
      <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block">
            <div className="relative rounded-3xl border border-[#E5E7EB] bg-white p-10 overflow-hidden shadow-sm">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative">
                <p className="text-sm font-semibold text-[#6B7280] mb-3">Welcome back</p>
                <h2 className="text-[36px] leading-[1.1] font-semibold tracking-tight text-[#0A0A0A] mb-4">Access your dashboard</h2>
                <p className="text-[15px] text-[#6B7280] mb-6">Manage orders, track progress, and get support in one place.</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-[#0A0A0A]"><svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>Secure sign-in</div>
                  <div className="flex items-center gap-2 text-[#0A0A0A]"><svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>Real-time order tracking</div>
                  <div className="flex items-center gap-2 text-[#0A0A0A]"><svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>Fast support</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="w-full max-w-sm ml-auto">
              {trackingToken && (
                <div className="mb-6 p-4 bg-neutral-900 text-white rounded-xl text-sm">
                  <p className="font-semibold mb-0.5">Welcome back!</p>
                  <p className="text-neutral-300">Sign in to view your order in your dashboard.</p>
                </div>
              )}

              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Sign in</h1>
                <p className="text-neutral-500 mt-1 text-sm">Welcome back. Access your orders and dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full h-11 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-neutral-700">Password</label>
                    <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Forgot password?</Link>
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                    required
                    className="w-full h-11 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  />
                </div>

                <ErrorBanner message={error} />

                <Button type="submit" variant="svcPrimary" size="lg" loading={loading} className="w-full rounded-full" arrowRight>
                  Sign in
                </Button>
              </form>

              <p className="text-center text-sm text-neutral-500 mt-6">
                Don't have an account?{" "}
                <Link href={trackingToken ? `/register?token=${trackingToken}` : "/register"} className="font-medium text-neutral-900 hover:underline">
                  Create one free
                </Link>
              </p>

              <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
                <p className="text-xs text-neutral-400 mb-2">Just need to track an order?</p>
                <Link href="/orders" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline underline-offset-2">
                  Track via email instead →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
