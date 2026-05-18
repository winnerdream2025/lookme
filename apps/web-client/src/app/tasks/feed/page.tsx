"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { session } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { TaskItem } from "@/lib/types";
import { TaskCard } from "@/components/worker/TaskCard";
import { MobileTaskRow } from "@/components/worker/MobileTaskRow";

export default function TaskFeedPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = () => {
    if (!session.isAuthenticated) { router.push("/login"); return; }
    setRefreshing(true);
    setError("");
    apiGet<TaskItem[]>("/tasks/feed")
      .then((data) => setTasks(data ?? []))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { loadTasks(); }, [router]);

  if (loading) {
    return (
      <div className="min-h-full bg-[#F6F5F3] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#6B7280]">Loading available tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F6F5F3]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/worker"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F6F5F3] hover:text-[#111827] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0A0A0A]">Available Tasks</h1>
              <p className="text-sm text-[#6B7280]">
                <span className="font-bold text-[#111827]">{tasks.length}</span> tasks ready to accept
              </p>
            </div>
          </div>
          <button
            onClick={loadTasks}
            disabled={refreshing}
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-xl border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F5F3] transition-colors shadow-sm disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* ─── Error ─── */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700">Error loading tasks</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ─── Task Feed ─── */}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#F6F5F3] border border-[#E5E7EB] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-base font-bold text-[#111827] mb-1">No tasks available</p>
            <p className="text-sm text-[#6B7280] max-w-xs">Check back soon — new tasks are added throughout the day.</p>
          </div>
        ) : (
          <>
            {/* Mobile: individual cards */}
            <div className="sm:hidden flex flex-col gap-3">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <MobileTaskRow
                    id={task.id}
                    title={task.serviceName || "Untitled Task"}
                    category={task.categoryName || "General"}
                    platform={task.platformName || "Platform"}
                    reward={Number(task.rewardAmount || 0)}
                    status="available"
                    isReview={task.isReview}
                  />
                </div>
              ))}
            </div>

            {/* Desktop / Tablet: card grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.serviceName || "Untitled Task"}
                  category={task.categoryName || "General"}
                  platform={task.platformName || "Platform"}
                  reward={Number(task.rewardAmount || 0)}
                  status="available"
                  isReview={task.isReview}
                  targetUrl={task.targetUrl}
                  instructions={task.instructions}
                />
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  );
}
