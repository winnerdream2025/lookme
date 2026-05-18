"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { TaskItem } from "@/lib/types";
import { TaskCard } from "@/components/worker/TaskCard";
import { MobileTaskRow } from "@/components/worker/MobileTaskRow";

export default function WorkerDashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [myTasks, setMyTasks] = useState<TaskItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    Promise.all([
      apiGet<TaskItem[]>("/tasks/feed"),
      apiGet<TaskItem[]>("/tasks/mine"),
      apiGet<{ balance: number }>("/wallet/me").then(w => ({ balance: w.balance })),
    ])
      .then(([feed, mine, wallet]) => {
        setTasks(feed ?? []);
        setMyTasks(mine ?? []);
        setBalance(typeof wallet?.balance === "number" ? wallet.balance : 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeTask = myTasks.filter((t) => t.status === "ASSIGNED");
  const completedTasks = myTasks.filter((t) => t.status === "PAID");
  const totalTasks = myTasks.length;
  const successRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <div className="text-sm text-[#6B7280]">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* ─── Page header ─── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0A] mb-1">
            Worker Hub
          </h1>
          <p className="text-sm text-[#6B7280]">Complete tasks, earn rewards, withdraw anytime.</p>
        </div>
        {/* Mobile stats toggle */}
        <button
          onClick={() => setShowStats((v) => !v)}
          className="sm:hidden flex items-center gap-2 h-9 px-3 rounded-xl bg-white border border-[#E5E7EB] shadow-sm text-sm font-semibold text-[#374151] shrink-0 mt-0.5"
        >
          <span className="text-emerald-600 font-bold">${balance.toFixed(2)}</span>
          <svg
            className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${showStats ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ─── Stats Grid: always visible desktop, collapsible mobile ─── */}
      <div className={`sm:block overflow-hidden transition-all duration-300 ease-in-out ${
        showStats ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100'
      }`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Available", value: tasks.length, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Active", value: activeTask.length, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Completed", value: `${completedTasks.length}`, sub: `${successRate}%`, icon: "M5 13l4 4L19 7", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Balance", value: `$${balance.toFixed(2)}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-blue-600 bg-blue-50 border-blue-100" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-4 sm:p-5"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${stat.color}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] tabular-nums leading-none">
              {stat.value}
            </p>
            {stat.sub && (
              <p className="text-xs text-[#6B7280] font-medium mt-1">{stat.sub} success rate</p>
            )}
          </div>
        ))}
      </div>
      </div>

      {/* ─── Task Feed ─── */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F3F4F6]">
          <div>
            <h2 className="text-lg font-bold text-[#0A0A0A]">Available Tasks</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">{tasks.length} tasks ready to accept</p>
          </div>
          <Link
            href="/tasks/feed"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#F6F5F3] border border-[#E5E7EB] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#374151] mb-1">No tasks available</p>
            <p className="text-sm text-[#6B7280] max-w-xs">Check back soon for new opportunities. Tasks are added throughout the day.</p>
          </div>
        ) : (
          <>
            {/* Mobile: individual cards */}
            <div className="sm:hidden flex flex-col gap-3 p-4">
              {tasks.slice(0, 8).map((task) => (
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
            <div className="hidden sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-[#F6F5F3] items-stretch">
              {tasks.slice(0, 6).map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.serviceName || "Untitled Task"}
                  category={task.categoryName || "General"}
                  platform={task.platformName || "Platform"}
                  reward={Number(task.rewardAmount || 0)}
                  status="available"
                  isReview={task.isReview}
                />
              ))}
            </div>

            {tasks.length > 6 && (
              <div className="px-5 sm:px-6 py-4 border-t border-[#F3F4F6] text-center bg-white">
                <Link
                  href="/tasks/feed"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View {tasks.length - 6} more tasks</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
