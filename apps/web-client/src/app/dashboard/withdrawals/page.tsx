"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import Link from "next/link";

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: string;
  requestedAt: string;
  reviewedAt?: string;
  paidAt?: string;
  rejectionReason?: string;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function loadWithdrawals() {
    try {
      setLoading(true);
      const data = await apiGet<Withdrawal[]>("/wallet/withdrawals/mine");
      setWithdrawals(data);
    } catch (err: any) {
      setError(err.message || "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  }

  async function confirmReceipt(withdrawalId: string) {
    try {
      setConfirmingId(withdrawalId);
      await apiPost("/wallet/withdrawals/confirm", {
        requestId: withdrawalId,
        received: true,
      });
      await loadWithdrawals();
    } catch (err: any) {
      setError(err.message || "Failed to confirm receipt");
    } finally {
      setConfirmingId(null);
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
      PAID: "bg-purple-100 text-purple-800 border-purple-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Withdrawal History</h1>
        <Link
          href="/dashboard/earnings"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Earnings
        </Link>
      </div>

      {error && <ErrorBanner message={error} />}

      {withdrawals.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Withdrawals Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't requested any withdrawals. Once you have enough balance, you can request a payout.
          </p>
          <Link
            href="/dashboard/earnings"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            View Earnings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${withdrawal.amount.toFixed(2)}
                    </h3>
                    {getStatusBadge(withdrawal.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {withdrawal.method} • {withdrawal.accountDetails}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Requested {new Date(withdrawal.requestedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`flex items-center ${withdrawal.status !== 'REJECTED' ? 'text-green-600' : 'text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-xs font-medium">Requested</span>
                </div>
                <div className={`h-0.5 flex-1 ${['APPROVED', 'PAID', 'CONFIRMED'].includes(withdrawal.status) ? 'bg-green-600' : 'bg-gray-300'}`} />
                <div className={`flex items-center ${['APPROVED', 'PAID', 'CONFIRMED'].includes(withdrawal.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-xs font-medium">Approved</span>
                </div>
                <div className={`h-0.5 flex-1 ${['PAID', 'CONFIRMED'].includes(withdrawal.status) ? 'bg-green-600' : 'bg-gray-300'}`} />
                <div className={`flex items-center ${['PAID', 'CONFIRMED'].includes(withdrawal.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-xs font-medium">Paid</span>
                </div>
              </div>

              {/* Status Messages */}
              {withdrawal.status === 'PENDING' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Pending Review:</strong> An admin will review your request within 1-2 business days.
                  </p>
                </div>
              )}

              {withdrawal.status === 'APPROVED' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Approved:</strong> Your withdrawal has been approved. Payment will be processed within 3-5 business days.
                  </p>
                  {withdrawal.reviewedAt && (
                    <p className="text-xs text-blue-600 mt-1">
                      Approved on {new Date(withdrawal.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {withdrawal.status === 'PAID' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800 mb-2">
                    <strong>Payment Sent:</strong> The admin has marked this as paid. Please confirm receipt.
                  </p>
                  {withdrawal.paidAt && (
                    <p className="text-xs text-purple-600 mb-3">
                      Paid on {new Date(withdrawal.paidAt).toLocaleString()}
                    </p>
                  )}
                  <button
                    onClick={() => confirmReceipt(withdrawal.id)}
                    disabled={confirmingId === withdrawal.id}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 text-sm font-medium"
                  >
                    {confirmingId === withdrawal.id ? "Confirming..." : "Confirm Receipt"}
                  </button>
                </div>
              )}

              {withdrawal.status === 'CONFIRMED' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>✓ Completed:</strong> You confirmed receipt of this payment.
                  </p>
                </div>
              )}

              {withdrawal.status === 'REJECTED' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Rejected:</strong> {withdrawal.rejectionReason || "Your withdrawal request was rejected."}
                  </p>
                  {withdrawal.reviewedAt && (
                    <p className="text-xs text-red-600 mt-1">
                      Rejected on {new Date(withdrawal.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
