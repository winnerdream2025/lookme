"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { session } from "@/lib/auth";
import { apiGuestPost } from "@/lib/api";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

type Role = "client" | "worker";

const ROLES: { value: Role; icon: string; label: string; desc: string }[] = [
  { value: "client", icon: "🎯", label: "I'm a Client", desc: "Grow my social presence" },
  { value: "worker", icon: "💼", label: "I'm a Worker", desc: "Earn by completing tasks" },
];

function RegisterInner() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("client");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("" );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (session.isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (role === "worker" && !termsAccepted) {
        setError("You must accept the Terms of Service and Privacy Policy to continue.");
        setLoading(false);
        return;
      }

      const data = await apiGuestPost<{ tokens: { accessToken: string; refreshToken: string }; user: { role: string } }>(
        "/auth/register",
        { ...form, role, ...(role === "worker" ? { termsAccepted: true, ...(gender ? { gender } : {}) } : {}) }
      );
      session.set(data.tokens, data.user.role);
      router.push(role === "worker" ? "/dashboard?view=worker" : "/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F6F5F3]">
      <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
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
                <p className="text-sm font-semibold text-[#6B7280] mb-3">Create your account</p>
                <h2 className="text-[36px] leading-[1.1] font-semibold tracking-tight text-[#0A0A0A] mb-4">Built for clarity and speed</h2>
                <p className="text-[15px] text-[#6B7280] mb-6">Choose a role and get started in minutes. No fluff — just a clean, focused experience.</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-[#0A0A0A]"><svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>Real people power every order</div>
                  <div className="flex items-center gap-2 text-[#0A0A0A]"><svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>Safe, secure checkout</div>
                  <div className="flex items-center gap-2 text-[#0A0A0A]"><svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>Track progress in real time</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="w-full max-w-sm ml-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Create account</h1>
                <p className="text-neutral-500 mt-1 text-sm">Free forever. Choose your role to get started.</p>
              </div>

              {/* Role selector */}
              <div className="mb-6">
                <div className="flex rounded-full border border-[#E5E7EB] bg-white p-1">
                  {ROLES.map((r) => {
                    const active = role === (r.value as Role);
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${
                          active
                            ? "bg-[#0A0A0A] text-white"
                            : "text-[#0A0A0A] hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">First name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Jane"
                      className="w-full h-11 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full h-11 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                  </div>
                </div>

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
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 chars, 1 uppercase, 1 number"
                    minLength={8}
                    required
                    className="w-full h-11 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  />
                </div>

                {role === "worker" && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <p className="text-xs font-semibold text-neutral-800">Worker Agreement</p>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      As a worker, you agree to complete tasks honestly using real accounts. No bots or automation.
                    </p>

                    <div>
                      <p className="text-xs font-semibold text-neutral-800 mb-2">Your gender <span className="font-normal text-neutral-500">(optional — used for review task matching)</span></p>
                      <div className="flex gap-2">
                        {([
                          { value: "FEMALE", label: "♀ Female" },
                          { value: "MALE",   label: "♂ Male" },
                        ] as const).map((g) => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setGender((prev) => prev === g.value ? "" : g.value)}
                            className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                              gender === g.value
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-neutral-900 shrink-0"
                      />
                      <span className="text-xs text-neutral-700">
                        I have read and agree to the {" "}
                        <Link href="/terms" className="underline font-medium" target="_blank">Terms of Service</Link>
                        {" "}and {" "}
                        <Link href="/privacy" className="underline font-medium" target="_blank">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="svcPrimary"
                  size="lg"
                  loading={loading}
                  disabled={role === "worker" && !termsAccepted}
                  className="w-full rounded-full"
                  arrowRight
                >
                  Create {role === "worker" ? "worker" : "client"} account
                </Button>
              </form>

              <p className="text-center text-sm text-neutral-500 mt-6">
                Already have an account? {" "}
                <Link href="/login" className="font-medium text-neutral-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterInner />
    </Suspense>
  );
}
