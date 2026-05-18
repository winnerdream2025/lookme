"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SERVICE_MAP } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { ReferenceImageUpload } from "@/components/ui/ReferenceImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function OrderReviewInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceSlug = searchParams.get("service") || "";
  const qty = parseInt(searchParams.get("qty") || "0");
  const price = parseFloat(searchParams.get("price") || "0");

  const service = SERVICE_MAP.get(serviceSlug);

  const [targetUrl, setTargetUrl] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!service || !qty) {
    return (
      <div className="min-h-screen bg-[#F6F5F3]">
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-2xl font-bold text-neutral-900 mb-3">No order selected</p>
        <p className="text-neutral-500 mb-6">Go back and choose a service package first.</p>
        <Link href="/pricing" className="inline-flex items-center h-10 px-6 bg-[#0A0A0A] text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors">
          Browse services
        </Link>
        </div>
      </div>
    );
  }

  const unitPrice = price / qty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) { setError("Please enter your profile or content URL."); return; }
    if (!guestEmail.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/orders/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: service.slug,
          quantity: qty,
          targetUrl: targetUrl.trim(),
          guestEmail: guestEmail.trim(),
          guestName: guestName.trim() || undefined,
          referenceImageUrl: referenceImageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to place order");
      router.push(`/order-confirm?token=${data.data.trackingToken}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back */}
        <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to {service.name}
        </Link>

        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Review your order</h1>
        <p className="text-sm text-neutral-500 mb-8">Confirm what you&apos;re buying before we process your order.</p>

        {/* Order summary card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">{service.platform}</p>
              <p className="text-lg font-bold text-neutral-900">{service.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-neutral-900">${price.toFixed(2)}</p>
              <p className="text-xs text-neutral-400">${unitPrice.toFixed(2)} each</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-neutral-100 mb-5">
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-1">Quantity</p>
              <p className="text-base font-bold text-neutral-900">{qty.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">{service.category}</p>
            </div>
            <div className="text-center border-x border-neutral-100">
              <p className="text-xs text-neutral-400 mb-1">Delivery</p>
              <p className="text-xs font-semibold text-neutral-700 leading-snug">{service.deliveryTime.split(",")[0]}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-1">Quality</p>
              <p className="text-xs font-semibold text-green-700">Real accounts</p>
            </div>
          </div>

          {/* What&apos;s included */}
          <div className="space-y-2">
            {service.features.slice(0, 4).map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-neutral-700">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery details form */}
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <p className="text-base font-bold text-neutral-900 mb-0.5">
              {service.orderConfig?.targetDescription ?? `Where should we deliver?`}
            </p>
            <p className="text-xs text-neutral-500">
              {service.orderConfig?.requiresPublicAccount
                ? `Make sure your ${service.platform} account is set to Public before placing the order.`
                : `No account changes needed — just paste the link below.`}
            </p>
          </div>

          {service.orderConfig?.requiresPublicAccount && (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M8 6v3.5M8 11v.5M2.5 13.5h11L8 2.5 2.5 13.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-xs text-amber-800">
                Your {service.platform} account must be <strong>public</strong> before we start delivery. Private accounts cannot receive {service.category}.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
              {service.orderConfig?.targetLabel ?? `${service.platform} URL`} <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder={service.orderConfig?.targetPlaceholder ?? `https://...`}
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-xs text-neutral-400 mt-1">
              {service.orderConfig?.targetHint ?? "Paste the full URL here."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <ReferenceImageUpload
            theme="light"
            onChange={setReferenceImageUrl}
            label="Reference image (optional)"
            hint="Upload a screenshot or photo to give workers extra context about your request."
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Total row */}
          <div className="flex items-center justify-between py-3 border-t border-neutral-100">
            <div>
              <p className="text-sm font-semibold text-neutral-900">{qty.toLocaleString()} {service.name}</p>
              <p className="text-xs text-neutral-400">{service.deliveryTime.split(",")[0]}</p>
            </div>
            <p className="text-xl font-bold text-neutral-900">${price.toFixed(2)}</p>
          </div>

          <Button
            type="submit"
            variant="svcPrimary"
            size="lg"
            loading={loading}
            className="w-full rounded-full"
            arrowRight
          >
            Place order — ${price.toFixed(2)}
          </Button>

          <p className="text-xs text-neutral-400 text-center">
            No account required · Secure payment via Stripe · Cancel anytime
          </p>
        </form>

      </div>
    </div>
  );
}

export default function OrderReviewPage() {
  return (
    <Suspense>
      <OrderReviewInner />
    </Suspense>
  );
}
