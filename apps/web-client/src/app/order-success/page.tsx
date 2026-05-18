"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { env } from "@/lib/env";
import type { Order } from "@/lib/types";
import { FullPageSpinner } from "@/components/ui/Spinner";

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const redirectStatus = searchParams.get("redirect_status");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${env.apiUrl}/orders/track/${token}`)
      .then((r) => r.json())
      .then((j) => { if (j.data) setOrder(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <FullPageSpinner label="Confirming your order…" />;

  // Stripe sent redirect_status=failed — show error
  if (redirectStatus === "failed") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment failed</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your card was not charged. Please try again with a different payment method.
          </p>
          {token && (
            <Link
              href={`/order-confirm?token=${token}`}
              className="inline-flex items-center justify-center h-11 px-6 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Try again
            </Link>
          )}
        </div>
      </div>
    );
  }

  const price = order
    ? typeof order.totalPrice === "string"
      ? parseFloat(order.totalPrice)
      : Number(order.totalPrice)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-20">

        {/* Success badge */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full bg-primary-600/20 animate-ping opacity-50" />
            <div className="relative w-20 h-20 rounded-full bg-primary-600/10 border-2 border-primary-500/40 flex items-center justify-center">
              <svg className="w-9 h-9 text-primary-400" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Payment confirmed!
          </h1>

          {order ? (
            <p className="text-slate-400 text-sm leading-relaxed">
              {order.quantity.toLocaleString()} ×{" "}
              {order.serviceType?.platform?.name && `${order.serviceType.platform.name} `}
              {order.serviceType?.name ?? "service"} · <span className="text-white font-semibold">${price.toFixed(2)}</span>
            </p>
          ) : (
            <p className="text-slate-400 text-sm">Your order has been placed successfully.</p>
          )}

          {order?.guestEmail && (
            <p className="text-xs text-slate-500 mt-2">
              Confirmation sent to{" "}
              <span className="text-slate-300 font-medium">{order.guestEmail}</span>
            </p>
          )}

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
            <p className="text-xs font-medium text-primary-300">
              Workers are being assigned to your order
            </p>
          </div>
        </div>

        {/* CTA cards */}
        <div className="space-y-3">
          {/* Save to account — primary action */}
          <Link
            href={`/save-order?token=${token}`}
            className="block w-full bg-[rgba(15,23,42,0.7)] backdrop-blur-xl border border-white/[0.08] hover:border-primary-500/30 rounded-2xl p-5 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary-400" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 13a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="font-bold text-slate-100 text-base">
                    Save to a free account
                  </p>
                  <span className="ml-auto text-xs bg-primary-600/20 text-primary-300 px-2 py-0.5 rounded-full border border-primary-500/20 font-medium">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed ml-9">
                  Set a password in seconds. Access your order dashboard, track delivery, and reorder with one click.
                </p>
                <div className="mt-3 ml-9 flex flex-wrap gap-2">
                  {["Full dashboard", "Order history", "Priority support"].map((f) => (
                    <span key={f} className="text-xs bg-white/[0.05] text-slate-400 px-2 py-0.5 rounded-full border border-white/[0.06]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-primary-400 flex-shrink-0 ml-3 mt-1 transition-colors" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>

          {/* Track as guest */}
          <Link
            href={`/track/${token}`}
            className="block w-full bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 5v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-300 text-base">
                    Track without an account
                  </p>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed ml-9">
                  Bookmark the tracking link. We also emailed it to you — check your inbox.
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 ml-3 mt-1 transition-colors" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Tracking URL pill */}
        {token && (
          <div className="mt-6 flex items-center gap-2 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L10 6l4.5.7-3.25 3.16.77 4.47L8 12.17l-4.02 2.16.77-4.47L1.5 6.7 6 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <p className="text-xs text-slate-500 flex-1 truncate">
              Track later:{" "}
              <Link
                href={`/track/${token}`}
                className="text-slate-400 underline underline-offset-2 hover:text-slate-200 transition-colors"
              >
                /track/{token.slice(0, 16)}…
              </Link>
            </p>
          </div>
        )}

        {/* Place another order */}
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2"
          >
            Place another order
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessInner />
    </Suspense>
  );
}
