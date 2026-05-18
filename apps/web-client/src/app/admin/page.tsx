"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiDownload } from "@/lib/api";
import { session } from "@/lib/auth";
import { useWebSocket } from "@/lib/useWebSocket";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import Link from "next/link";

interface DashboardStats {
  tasks: {
    pending: number;
    submitted: number;
    verified: number;
    sampled: number;
  };
  withdrawals: {
    pending: number;
    approved: number;
    totalPending: number;
    totalApproved: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // WebSocket for real-time updates
  const { isConnected } = useWebSocket({
    onMessage: (message) => {
      console.log('[Dashboard] WebSocket message:', message);
      
      // Reload stats when tasks or withdrawals update
      if (message.event === 'task:updated' || message.event === 'withdrawal:updated') {
        loadStats();
      }
    },
    onConnect: () => {
      console.log('[Dashboard] WebSocket connected');
    },
    onDisconnect: () => {
      console.log('[Dashboard] WebSocket disconnected');
    }
  });

  // Auth guard - redirect if not admin
  useEffect(() => {
    if (!session.isAuthenticated || session.role !== 'admin') {
      router.push('/login?redirect=/admin');
      return;
    }
    loadStats();
    
    // Auto-refresh every 30 seconds (fallback if WebSocket fails)
    const interval = setInterval(() => {
      loadStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [router]);

  async function loadStats() {
    try {
      setLoading(true);
      
      // Fetch tasks stats - backend returns {tasks: [], total: X, page, limit}
      const [tasksSubmittedData, tasksVerifiedData, auditQueueData] = await Promise.all([
        apiGet<{ tasks: any[], total: number }>("/tasks?status=SUBMITTED&limit=1"),
        apiGet<{ tasks: any[], total: number }>("/tasks?status=VERIFIED&limit=1"),
        apiGet<{ tasks: any[], total: number }>("/tasks/admin/audit/queue?limit=1"),
      ]);

      // Fetch withdrawals stats
      const withdrawals = await apiGet<Array<{ amount: number; status: string }>>("/wallet/withdrawals/pending");

      const pending = withdrawals.filter(w => w.status === "PENDING");
      const approved = withdrawals.filter(w => w.status === "APPROVED");

      setStats({
        tasks: {
          pending: tasksSubmittedData.total || 0,
          submitted: tasksSubmittedData.total || 0,
          verified: tasksVerifiedData.total || 0,
          sampled: auditQueueData.total || 0,
        },
        withdrawals: {
          pending: pending.length,
          approved: approved.length,
          totalPending: pending.reduce((sum, w) => sum + w.amount, 0),
          totalApproved: approved.reduce((sum, w) => sum + w.amount, 0),
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <ErrorBanner message={error} />
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <ErrorBanner message="No stats available" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Pending Tasks */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700">Pending Tasks</p>
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-blue-900 mb-1">{stats.tasks.submitted}</p>
          <p className="text-xs text-blue-600">Awaiting review</p>
        </div>

        {/* Verified Tasks */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700">Verified Tasks</p>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-green-900 mb-1">{stats.tasks.verified}</p>
          <p className="text-xs text-green-600">In hold period</p>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-yellow-700">Pending Withdrawals</p>
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-yellow-900 mb-1">{stats.withdrawals.pending}</p>
          <p className="text-xs text-yellow-600">${stats.withdrawals.totalPending.toFixed(2)} total</p>
        </div>

        {/* Approved Withdrawals */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-700">Ready to Pay</p>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-purple-900 mb-1">{stats.withdrawals.approved}</p>
          <p className="text-xs text-purple-600">${stats.withdrawals.totalApproved.toFixed(2)} total</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task Approval */}
          <Link
            href="/admin/tasks"
            className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              {stats.tasks.submitted > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                  {stats.tasks.submitted}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600">Review Tasks</h3>
            <p className="text-sm text-gray-600">Approve or reject submitted tasks in bulk</p>
          </Link>

          {/* Withdrawal Management */}
          <Link
            href="/admin/withdrawals"
            className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              {stats.withdrawals.pending > 0 && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
                  {stats.withdrawals.pending}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-purple-600">Manage Withdrawals</h3>
            <p className="text-sm text-gray-600">Review and approve withdrawal requests</p>
          </Link>

          {/* Export Payouts */}
          <button
            onClick={async () => {
              try {
                const today = new Date().toISOString().split("T")[0];
                await apiDownload("/wallet/withdrawals/export-csv", `payouts-${today}.csv`);
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Export failed");
              }
            }}
            className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {stats.withdrawals.approved > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  {stats.withdrawals.approved}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-green-600">Export Payouts</h3>
            <p className="text-sm text-gray-600">Download CSV for PayPal/bank batch payment</p>
          </button>

          {/* Refresh Stats */}
          <button
            onClick={loadStats}
            className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-gray-700">Refresh Stats</h3>
            <p className="text-sm text-gray-600">Update dashboard with latest data</p>
          </button>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">📋 Task Workflow</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Submitted:</strong> Workers completed tasks, awaiting review</li>
            <li>• <strong>Verified:</strong> Approved, in 24-48h fraud protection hold</li>
            <li>• <strong>Paid:</strong> Hold released, money available to workers</li>
          </ul>
        </div>

        {/* Withdrawal Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-bold text-purple-900 mb-2">💰 Withdrawal Workflow</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• <strong>Pending:</strong> Workers requested, awaiting admin approval</li>
            <li>• <strong>Approved:</strong> Ready to export CSV and pay manually</li>
            <li>• <strong>Paid:</strong> Payment sent, awaiting worker confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
