"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { Order } from "@/lib/types";
import { DASHBOARD_STATUS_STYLES } from "@/lib/constants";

export default function ClientDashboardPage() {
  const searchParams = useSearchParams();
  const highlightToken = searchParams.get("token");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ orders: Order[] } | Order[]>("/orders")
      .then((data) => {
        setOrders((data as { orders: Order[] }).orders ?? (data as Order[]) ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = orders.filter((o) =>
    ["PROCESSING", "IN_PROGRESS", "PENDING_PAYMENT"].includes(o.status)
  );
  const completed = orders.filter((o) => o.status === "COMPLETED");

  if (loading) {
    return <div className="text-[15px] text-[#6B7280]">Loading your orders...</div>;
  }

  return (
    <div>
      {/* Success banner */}
      {highlightToken && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[17px] font-semibold text-green-900 mb-1">
                Order placed successfully!
              </p>
              <p className="text-[15px] text-green-700">
                Your order is being processed by our workers.
              </p>
            </div>
            <Link
              href={`/track/${highlightToken}`}
              className="text-[15px] font-medium text-green-900 hover:underline"
            >
              Track order →
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl">
          <div className="text-[36px] font-semibold mb-1">{orders.length}</div>
          <div className="text-[15px] text-[#6B7280]">Total orders</div>
        </div>
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl">
          <div className="text-[36px] font-semibold text-[#2563EB] mb-1">{active.length}</div>
          <div className="text-[15px] text-[#6B7280]">Active</div>
        </div>
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl">
          <div className="text-[36px] font-semibold text-green-600 mb-1">{completed.length}</div>
          <div className="text-[15px] text-[#6B7280]">Completed</div>
        </div>
      </div>

      {/* Orders list */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[21px] font-semibold">Recent orders</h2>
          <Link href="/pricing" className="text-[15px] font-medium hover:underline">
            Place new order →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-xl">
            <div className="text-[48px] mb-4">📦</div>
            <p className="text-[19px] font-semibold mb-2">No orders yet</p>
            <p className="text-[15px] text-[#6B7280] mb-6">
              Start growing your social presence today
            </p>
            <Link
              href="/pricing"
              className="inline-flex h-11 px-6 bg-[#0A0A0A] text-white text-[15px] font-medium rounded-lg hover:bg-black items-center"
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const progress =
                order.totalTasks > 0
                  ? Math.round((order.completedTasks / order.totalTasks) * 100)
                  : 0;
              const isHighlighted = order.trackingToken === highlightToken;
              const platform = order.serviceType?.platform?.name ?? "";
              const service = order.serviceType?.name ?? "Order";

              return (
                <div
                  key={order.id}
                  className={`p-6 bg-white border rounded-xl transition-colors ${
                    isHighlighted
                      ? "border-green-300 bg-green-50/30"
                      : "border-[#E5E7EB] hover:border-[#0A0A0A]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[17px] font-semibold mb-1">
                        {platform && `${platform} — `}
                        {service}
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                        <span>{order.quantity} units</span>
                        <span>·</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                        <span>·</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[13px] font-medium px-3 py-1 rounded-full border ${
                        DASHBOARD_STATUS_STYLES[order.status] ??
                        DASHBOARD_STATUS_STYLES.PROCESSING
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0A0A0A] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[13px] text-[#6B7280] mt-2">
                      <span>{progress}% complete</span>
                      <span>
                        {order.completedTasks}/{order.totalTasks} tasks
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/track/${order.trackingToken}`}
                    className="text-[15px] font-medium hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Help section */}
      <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl">
        <h3 className="text-[17px] font-semibold mb-2">Need help?</h3>
        <p className="text-[15px] text-[#6B7280] mb-4">
          Have questions about an order? Our support team is here to help.
        </p>
        <Link
          href="/contact"
          className="inline-flex h-10 px-5 bg-[#0A0A0A] text-white text-[15px] font-medium rounded-lg hover:bg-black items-center"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
