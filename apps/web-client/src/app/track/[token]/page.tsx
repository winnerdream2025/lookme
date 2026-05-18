"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { Order } from "@/lib/types";
import { STATUS_STYLES, TIMELINE_STEPS, stepDone } from "@/lib/constants";
import { FullPageSpinner } from "@/components/ui/Spinner";

export default function TrackOrderPage() {
  const params = useParams();
  const token = params.token as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const loadOrder = async () => {
    try {
      const data = await apiGet<Order>(`/orders/track/${token}`);
      setOrder(data);
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageSpinner label="Loading order..." />;

  if (offline) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6v5M10 14v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Service unavailable</h1>
        <p className="text-sm text-neutral-500 mb-6">
          The tracking service is temporarily offline. Your order is safe — check back in a few minutes.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setLoading(true); loadOrder(); }}
            className="h-9 px-5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Retry
          </button>
          <Link href="/orders" className="h-9 px-5 text-sm font-medium border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors inline-flex items-center">
            Track by email
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Order not found</h1>
        <p className="text-sm text-neutral-500 mb-6">
          This tracking link is invalid or has expired.
        </p>
        <Link href="/orders" className="text-sm font-medium text-neutral-900 underline underline-offset-2">
          Track by email instead
        </Link>
      </div>
    );
  }

  const progress = order.totalTasks > 0
    ? Math.round((order.completedTasks / order.totalTasks) * 100)
    : 0;
  const statusMeta = STATUS_STYLES[order.status] ?? STATUS_STYLES.PROCESSING;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      {/* Back */}
      <Link href="/orders" className="text-sm text-neutral-500 hover:text-neutral-900 mb-6 inline-block">
        ← Track another order
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">Order Tracking</p>
          <h1 className="text-2xl font-bold text-neutral-900">{order.platform} — {order.service}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {order.quantity.toLocaleString()} units · Placed {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusMeta.pill}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Progress */}
      <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-white">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-medium text-neutral-700">Delivery progress</span>
          <span className="font-bold text-neutral-900">{progress}%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400">
          <span>0 / {order.totalTasks} tasks</span>
          <span>{order.completedTasks} completed</span>
        </div>
      </div>

      {/* Order details */}
      <div className="border border-neutral-200 rounded-2xl p-6 mb-6 bg-white">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Order ID",  value: order.id.slice(0, 8).toUpperCase() },
            { label: "Quantity",  value: order.quantity.toLocaleString() },
            { label: "Platform",  value: order.platform },
            { label: "Service",   value: order.service },
            { label: "Date",      value: new Date(order.createdAt).toLocaleDateString() },
            { label: "Status",    value: statusMeta.label },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-xs text-neutral-400 mb-0.5">{row.label}</p>
              <p className="text-sm font-semibold text-neutral-900">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="border border-neutral-200 rounded-2xl p-6 mb-8 bg-white">
        <h2 className="text-sm font-semibold text-neutral-700 mb-5">Timeline</h2>
        <div className="space-y-5">
          {TIMELINE_STEPS.map((step, i) => {
            const done = stepDone(order.status, step.key);
            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    done ? "bg-neutral-900 border-neutral-900" : "bg-white border-neutral-300"
                  }`}>
                    {done && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${done ? "bg-neutral-900" : "bg-neutral-200"}`} />
                  )}
                </div>
                <div className="pt-0.5">
                  <p className={`text-sm font-semibold ${done ? "text-neutral-900" : "text-neutral-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="border border-neutral-100 rounded-2xl p-6 bg-neutral-50">
        <p className="font-semibold text-neutral-900 mb-1">Manage your order in your dashboard</p>
        <p className="text-sm text-neutral-500 mb-4">
          Create a free account or sign in to track this order, get updates, and place new orders.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/register?token=${token}`}
            className="h-9 px-5 text-sm font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center"
          >
            Create free account
          </Link>
          <Link
            href={`/login?token=${token}`}
            className="h-9 px-5 text-sm font-medium border border-neutral-200 text-neutral-700 rounded-lg hover:bg-white transition-colors inline-flex items-center"
          >
            Sign in
          </Link>
          <Link
            href="/pricing"
            className="h-9 px-5 text-sm font-medium text-neutral-400 hover:text-neutral-700 transition-colors inline-flex items-center"
          >
            Place another order
          </Link>
        </div>
      </div>
    </div>
  );
}
