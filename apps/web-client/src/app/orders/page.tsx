"use client";

import { useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { Order } from "@/lib/types";
import { STATUS_STYLES } from "@/lib/constants";

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiGet<Order[]>(`/orders?email=${encodeURIComponent(email)}`);
      setOrders(data ?? []);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Track Your Orders
        </h1>
        <p className="text-neutral-500">
          Enter the email you used at checkout to see all your orders.
        </p>
      </div>

      {/* Email Lookup */}
      <form onSubmit={handleLookup} className="flex gap-3 mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 h-10 px-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 px-5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Looking up..." : "View Orders"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {/* Results */}
      {submitted && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-16 border border-neutral-100 rounded-xl bg-neutral-50">
              <p className="font-medium text-neutral-700">No orders found</p>
              <p className="text-sm text-neutral-500 mt-1">
                No orders found for <strong>{email}</strong>
              </p>
              <Link
                href="/pricing"
                className="inline-flex mt-4 text-sm font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
              >
                Browse services →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-neutral-500 mb-4">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found for{" "}
                <strong className="text-neutral-700">{email}</strong>
              </p>
              {orders.map((order) => {
                const progress = order.totalTasks > 0
                  ? Math.round((order.completedTasks / order.totalTasks) * 100)
                  : 0;
                return (
                  <div
                    key={order.id}
                    className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-neutral-900">
                            {order.platform} — {order.service}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-500">
                          <span>{order.quantity} units</span>
                          <span>·</span>
                          <span>${order.totalPrice.toFixed(2)}</span>
                          <span>·</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${
                          (STATUS_STYLES[order.status] ?? STATUS_STYLES.PROCESSING).pill
                        }`}
                      >
                        {(STATUS_STYLES[order.status] ?? STATUS_STYLES.PROCESSING).label}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Progress</span>
                        <span>{order.completedTasks}/{order.totalTasks} tasks</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/track/${order.trackingToken}`}
                      className="text-sm font-medium text-neutral-900 hover:underline underline-offset-2"
                    >
                      View details →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sign in CTA */}
      <div className="mt-10 pt-8 border-t border-neutral-100 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Want to manage orders in a dashboard?
        </p>
        <Link
          href="/register"
          className="text-sm font-medium text-neutral-900 border border-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Create free account →
        </Link>
      </div>
    </div>
  );
}
