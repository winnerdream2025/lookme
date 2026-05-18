"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { session } from "@/lib/auth";
import type { TaskItem } from "@/lib/types";
import { TaskCard } from "@/components/worker/TaskCard";
import { MobileTaskRow } from "@/components/worker/MobileTaskRow";

const TABS: { key: string; label: string; statuses: string[] }[] = [
  { key: "active",    label: "Active",    statuses: ["ASSIGNED"] },
  { key: "submitted", label: "Submitted", statuses: ["SUBMITTED"] },
  { key: "completed", label: "Completed", statuses: ["VERIFIED", "PAID", "REJECTED"] },
];

function formatTimeLeft(expiresAt: string | undefined): string {
  if (!expiresAt) return "";
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export default function MyTasksPage() {
  const router = useRouter();
  const [tasks, setTasks]       = useState<TaskItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState<string>("active");
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = () => {
    if (!session.isAuthenticated) { router.push("/login"); return; }
    setRefreshing(true);
    setError("");
    apiGet<TaskItem[]>("/tasks/mine")
      .then((data) => setTasks(data ?? []))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { loadTasks(); }, [router]);
  useEffect(() => {
    const i = setInterval(() => {}, 1000);
    return () => clearInterval(i);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-sm text-[#6B7280]">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  const currentTab = TABS.find((x) => x.key === tab);
  const filtered = tasks.filter((t) =>
    currentTab?.statuses.includes(t.status as string)
  );

  const stats = {
    active:      tasks.filter(t => t.status === "ASSIGNED").length,
    submitted:   tasks.filter(t => t.status === "SUBMITTED").length,
    completed:   tasks.filter(t => ["VERIFIED", "PAID"].includes(t.status || "")).length,
    rejected:    tasks.filter(t => t.status === "REJECTED").length,
    totalEarned: tasks
      .filter(t => ["VERIFIED", "PAID"].includes(t.status || ""))
      .reduce((sum, t) => sum + Number(t.rewardAmount || 0), 0),
  };

  return (
    <div className="min-h-full bg-[#F6F5F3] px-4 sm:px-6 py-6 sm:py-8">
    <div className="max-w-[1200px] mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/worker"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">My Tasks</h1>
          </div>
          <p className="text-sm text-[#6B7280] ml-10">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={loadTasks}
          disabled={refreshing}
          className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold bg-white border border-[#E5E7EB] rounded-xl text-[#374151] hover:bg-[#F6F5F3] transition-colors disabled:opacity-50 shrink-0"
        >
          <svg className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* ── Stats ── */}
      {!error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Active",       value: stats.active,                       accent: "border-l-amber-400",   val: "text-amber-600" },
            { label: "In Review",    value: stats.submitted,                    accent: "border-l-slate-400",   val: "text-slate-700" },
            { label: "Completed",    value: stats.completed,                    accent: "border-l-emerald-400", val: "text-emerald-600" },
            { label: "Rejected",     value: stats.rejected,                     accent: "border-l-red-400",     val: "text-red-600" },
            { label: "Total Earned", value: `$${stats.totalEarned.toFixed(2)}`, accent: "border-l-blue-500",    val: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-xl border border-[#E5E7EB] border-l-4 ${s.accent} shadow-sm p-4`}>
              <p className={`text-2xl font-bold tabular-nums leading-none whitespace-nowrap ${s.val}`}>{s.value}</p>
              <p className="text-xs font-semibold text-[#6B7280] mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Error loading tasks</p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex gap-1">
          {TABS.map((t) => {
            const count = tasks.filter((task) => t.statuses.includes(task.status || "")).length;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
                  active ? "text-[#111827]" : "text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {t.label}
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      active ? "bg-blue-100 text-blue-700" : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}>
                      {count}
                    </span>
                  )}
                </span>
                {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Task List / Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F6F5F3] border border-[#E5E7EB] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-base font-bold text-[#111827] mb-1">
            {tab === "active" ? "No active tasks" : tab === "submitted" ? "Nothing awaiting review" : "No completed tasks yet"}
          </p>
          <p className="text-sm text-[#6B7280] max-w-xs mb-6">
            {tab === "active" ? "Accept tasks from the dashboard to get started." : tab === "submitted" ? "Submitted tasks will appear here while under review." : "Completed and paid tasks will show up here."}
          </p>
          {tab === "active" && (
            <Link
              href="/dashboard/worker"
              className="inline-flex items-center gap-2 h-10 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Browse Task Feed
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: individual cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {filtered.map((task) => (
              <div key={task.id} className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
                <MobileTaskRow
                  id={task.id}
                  title={task.serviceName || "Untitled Task"}
                  category={task.categoryName || "General"}
                  platform={task.platformName || "Platform"}
                  reward={Number(task.rewardAmount || 0)}
                  status={
                    tab === "active" ? "active" :
                    tab === "submitted" ? "submitted" :
                    task.status === "PAID" || task.status === "VERIFIED" ? "completed" : "rejected"
                  }
                  isReview={task.isReview}
                />
              </div>
            ))}
          </div>

          {/* Desktop: card grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.serviceName || "Untitled Task"}
                category={task.categoryName || "General"}
                platform={task.platformName || "Platform"}
                reward={Number(task.rewardAmount || 0)}
                status={
                  tab === "active" ? "active" :
                  tab === "submitted" ? "submitted" :
                  task.status === "PAID" || task.status === "VERIFIED" ? "completed" : "rejected"
                }
                timeRemaining={tab === "active" && task.expiresAt ? formatTimeLeft(task.expiresAt) : undefined}
                isReview={task.isReview}
                targetUrl={task.targetUrl}
                instructions={task.instructions}
                submittedAt={task.submittedAt}
                assignedAt={task.assignedAt}
              />
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  );
}

