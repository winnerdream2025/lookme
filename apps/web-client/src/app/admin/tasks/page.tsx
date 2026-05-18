"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { session } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface Task {
  id: string;
  status: string;
  rewardAmount: number;
  workerId: string;
  createdAt: string;
  proof?: {
    screenshotUrl?: string;
    status: string;
  };
  order: {
    serviceType: {
      name: string;
      category: {
        name: string;
      };
    };
  };
}

interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export default function TaskApprovalQueue() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<"SUBMITTED" | "VERIFIED">("SUBMITTED");
  const [viewProof, setViewProof] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!session.isAuthenticated || session.role !== 'admin') {
      router.push('/login?redirect=/admin/tasks');
      return;
    }
    loadTasks();
  }, [router, filter]);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet<TaskListResponse>(`/tasks?status=${filter}&limit=50`);
      setTasks(data.tasks || []);
      setSelectedIds(new Set());
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(taskId: string) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedIds(newSelected);
  }

  function toggleSelectAll() {
    if (selectedIds.size === tasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map(t => t.id)));
    }
  }

  async function bulkApprove() {
    if (selectedIds.size === 0) {
      alert("Please select at least one task");
      return;
    }

    if (selectedIds.size > 100) {
      alert("Maximum 100 tasks can be approved at once");
      return;
    }

    if (!confirm(`Approve ${selectedIds.size} task(s)?`)) {
      return;
    }

    try {
      setProcessing(true);
      setError("");
      
      const result = await apiPost<{
        approved: number;
        rejected: number;
        duplicates: number;
        failed: string[];
      }>("/tasks/bulk-review", {
        taskIds: Array.from(selectedIds),
        status: "VERIFIED",
      });

      alert(`Success!\nApproved: ${result.approved}\nDuplicates: ${result.duplicates}\nFailed: ${result.failed.length}`);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Failed to approve tasks");
    } finally {
      setProcessing(false);
    }
  }

  async function bulkReject() {
    if (selectedIds.size === 0) {
      alert("Please select at least one task");
      return;
    }

    const reason = prompt("Rejection reason:");
    if (!reason) return;

    if (!confirm(`Reject ${selectedIds.size} task(s)?`)) {
      return;
    }

    try {
      setProcessing(true);
      setError("");
      
      const result = await apiPost<{
        approved: number;
        rejected: number;
        duplicates: number;
        failed: string[];
      }>("/tasks/bulk-review", {
        taskIds: Array.from(selectedIds),
        status: "REJECTED",
        rejectionReason: reason,
      });

      alert(`Success!\nRejected: ${result.rejected}\nFailed: ${result.failed.length}`);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Failed to reject tasks");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Task Approval Queue</h1>
            <p className="text-gray-600 mt-1">Review and approve submitted tasks</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter("SUBMITTED")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === "SUBMITTED"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Submitted ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("VERIFIED")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === "VERIFIED"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Verified (In Hold)
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Bulk Actions Bar */}
      {filter === "SUBMITTED" && tasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === tasks.length && tasks.length > 0}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="font-medium">
                  {selectedIds.size === 0
                    ? "Select All"
                    : `${selectedIds.size} selected`}
                </span>
              </label>
              {selectedIds.size > 0 && (
                <span className="text-sm text-gray-600">
                  (Max 100 per batch)
                </span>
              )}
            </div>

            {selectedIds.size > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={bulkApprove}
                  disabled={processing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {processing ? "Processing..." : `✓ Approve ${selectedIds.size}`}
                </button>
                <button
                  onClick={bulkReject}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  ✗ Reject {selectedIds.size}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No {filter.toLowerCase()} tasks</h3>
          <p className="text-gray-600">
            {filter === "SUBMITTED" 
              ? "All tasks have been reviewed" 
              : "No tasks currently in hold period"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white border-2 rounded-xl p-6 transition-all ${
                selectedIds.has(task.id)
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                {filter === "SUBMITTED" && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(task.id)}
                    onChange={() => toggleSelect(task.id)}
                    className="w-5 h-5 mt-1 rounded border-gray-300"
                  />
                )}

                {/* Task Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {task.order.serviceType.category.name} - {task.order.serviceType.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Task ID: <code className="bg-gray-100 px-2 py-1 rounded">{task.id}</code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${Number(task.rewardAmount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Proof */}
                  {task.proof?.screenshotUrl && (
                    <div className="mt-3">
                      <button
                        onClick={() => setViewProof(task.proof!.screenshotUrl!)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                      >
                        📸 View Proof Screenshot
                      </button>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      task.status === "SUBMITTED"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "VERIFIED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof Modal */}
      {viewProof && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setViewProof(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Proof Screenshot</h3>
              <button
                onClick={() => setViewProof(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <img
              src={viewProof}
              alt="Proof"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
