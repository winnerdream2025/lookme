"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { env } from "@/lib/env";
import type { Order } from "@/lib/types";
import { FullPageSpinner } from "@/components/ui/Spinner";

// ─── Stripe instance (created once, outside components) ──────────────────────
const stripePromise = loadStripe(env.stripePublicKey);

// ─── Custom LookMe appearance for Stripe PaymentElement ──────────────────────
const stripeAppearance = {
  theme: "flat" as const,
  variables: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "16px",
    colorPrimary: "#2563eb",
    colorBackground: "#1e293b",
    colorText: "#f8fafc",
    colorTextPlaceholder: "#64748b",
    borderRadius: "12px",
    spacingGridRow: "12px",
  },
  rules: {
    ".Input": {
      backgroundColor: "rgba(30, 41, 59, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
    },
    ".Input:focus": {
      border: "1px solid #2563eb",
      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.3)",
    },
    ".Label": {
      color: "#94a3b8",
      fontSize: "13px",
      fontWeight: "600",
    },
    ".Tab, .AccordionItem": {
      backgroundColor: "rgba(15, 23, 42, 0.5)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      color: "#94a3b8",
    },
    ".Tab--selected, .AccordionItem--selected": {
      backgroundColor: "#2563eb",
      border: "1px solid #2563eb",
      color: "#ffffff",
    },
    ".Tab:hover": {
      border: "1px solid rgba(37, 99, 235, 0.4)",
      color: "#f8fafc",
    },
  },
};

// ─── Payment form (must be inside <Elements> context) ─────────────────────────
function PaymentForm({
  order,
  trackingToken,
}: {
  order: Order;
  trackingToken: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const price =
    typeof order.totalPrice === "string"
      ? parseFloat(order.totalPrice)
      : Number(order.totalPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success?token=${trackingToken}`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      router.push(`/order-success?token=${trackingToken}`);
      return;
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order summary card */}
      <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Order Summary
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Service</span>
            <span className="font-semibold text-slate-100 text-right">
              {order.serviceType?.platform?.name
                ? `${order.serviceType.platform.name} — `
                : ""}
              {order.serviceType?.name ?? order.service ?? "Service"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Quantity</span>
            <span className="font-semibold text-slate-100">
              {order.quantity.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Receipt to</span>
            <span className="font-semibold text-slate-100 truncate max-w-[180px] text-right">
              {order.guestEmail}
            </span>
          </div>
          <div className="border-t border-white/[0.06] pt-3 flex justify-between items-center">
            <span className="font-bold text-white">Total</span>
            <span className="text-2xl font-bold text-white">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Stripe PaymentElement */}
      <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg
            className="w-4 h-4 text-primary-400"
            viewBox="0 0 20 20"
            fill="none"
          >
            <rect
              x="2"
              y="5"
              width="16"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className="font-semibold text-slate-100 text-sm">
            Secure Payment
          </p>
          <span className="ml-auto text-xs bg-white/[0.06] text-slate-400 px-2 py-0.5 rounded-full border border-white/[0.08]">
            SSL encrypted
          </span>
        </div>

        <PaymentElement
          options={{ layout: isMobile ? "accordion" : "tabs" }}
        />
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full h-14 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl transition-colors shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 10l4 4L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pay ${price.toFixed(2)} securely
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        By paying you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-2 hover:text-slate-300 transition-colors"
        >
          Terms of Service
        </Link>
        . Your payment is protected by 256-bit SSL encryption.
      </p>

      <p className="text-center text-xs text-slate-600">
        Need to change something?{" "}
        <Link
          href="/pricing"
          className="underline underline-offset-2 hover:text-slate-400 transition-colors"
        >
          Back to services
        </Link>
      </p>
    </form>
  );
}

// ─── Inner page — fetches order + creates payment intent ──────────────────────
function OrderConfirmInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loadError, setLoadError] = useState("");

  const init = useCallback(async () => {
    if (!token) return;
    try {
      // 1. Fetch order by tracking token (public endpoint)
      const res = await fetch(`${env.apiUrl}/orders/track/${token}`);
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error?.message || "Order not found");
      const orderData: Order = json.data;
      setOrder(orderData);

      // 2. Create Stripe PaymentIntent using the order's real DB id
      const piRes = await fetch(
        `${env.apiUrl}/orders/${orderData.id}/payment-intent`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const piJson = await piRes.json();
      if (!piRes.ok)
        throw new Error(
          piJson.error?.message || "Could not initialise payment"
        );
      setClientSecret(piJson.data.clientSecret);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Could not load order"
      );
    }
  }, [token]);

  useEffect(() => {
    init();
  }, [init]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-100 mb-2">
            No order token
          </p>
          <Link href="/pricing" className="text-sm text-slate-400 underline">
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-5 h-5 text-red-400"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 6v5M10 14v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-100 mb-1">
            {loadError}
          </p>
          <Link href="/pricing" className="text-sm text-slate-400 underline">
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  if (!order || !clientSecret) {
    return (
      <FullPageSpinner label="Setting up secure payment…" />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-lg mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Step 2 of 2
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Complete your payment
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            All major cards, Apple Pay, Google Pay &amp; more accepted.
          </p>
        </div>

        {/* Elements wrapper — provides Stripe context to PaymentForm */}
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: stripeAppearance }}
        >
          <PaymentForm order={order} trackingToken={token} />
        </Elements>
      </div>
    </div>
  );
}

export default function OrderConfirmPage() {
  return (
    <Suspense>
      <OrderConfirmInner />
    </Suspense>
  );
}
