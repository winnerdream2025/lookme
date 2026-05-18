"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { session } from "@/lib/auth";
import type { WalletData, WithdrawalRequest } from "@/lib/types";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

function safeNum(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v) || 0;
  return 0;
}

const TXN_LABELS: Record<string, { label: string; color: string }> = {
  DEPOSIT:        { label: "Deposit", color: "text-blue-700" },
  REWARD:         { label: "Task Reward", color: "text-green-700" },
  WITHDRAWAL:     { label: "Withdrawal", color: "text-red-700" },
  ESCROW_LOCK:    { label: "Escrow Lock", color: "text-neutral-600" },
  ESCROW_RELEASE: { label: "Escrow Release", color: "text-neutral-600" },
  PLATFORM_FEE:   { label: "Platform Fee", color: "text-neutral-600" },
};

const WITHDRAWAL_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pending Review", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  APPROVED:  { label: "Approved — Awaiting Payment", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  REJECTED:  { label: "Rejected — Refunded", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  PAID:      { label: "Paid — Confirm Receipt", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  DISPUTED:  { label: "Disputed", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  RESOLVED:  { label: "Resolved", color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

export default function EarningsPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Withdraw form state
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"PAYPAL" | "MOBILE_MONEY">("PAYPAL");
  const [accountDetails, setAccountDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Confirmation state
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  useEffect(() => {
    if (!session.isAuthenticated) { router.push("/login"); return; }
    Promise.all([
      apiGet<WalletData>("/wallet/me"),
      apiGet<WithdrawalRequest[]>("/wallet/withdrawals/mine"),
    ])
      .then(([w, d]) => {
        setWallet(w);
        setWithdrawals(d ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const amt = parseFloat(amount);
    if (isNaN(amt) || !isFinite(amt) || amt <= 0) { setFormError("Please enter a valid amount."); return; }
    if (amt < 5) { setFormError("Minimum withdrawal is $5.00"); return; }
    if (!accountDetails.trim()) { setFormError("Account details are required"); return; }
    if (amt > (wallet?.balance ?? 0)) { setFormError("Insufficient balance"); return; }

    setSubmitting(true);
    try {
      await apiPost("/wallet/withdrawals/request", {
        amount: amt,
        method,
        accountDetails: accountDetails.trim(),
      });
      // Refresh
      const [w, d] = await Promise.all([
        apiGet<WalletData>("/wallet/me"),
        apiGet<WithdrawalRequest[]>("/wallet/withdrawals/mine"),
      ]);
      setWallet(w);
      setWithdrawals(d ?? []);
      setShowForm(false);
      setAmount("");
      setAccountDetails("");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (id: string, received: boolean) => {
    setError("");
    try {
      await apiPost("/wallet/withdrawals/confirm", {
        requestId: id,
        received,
        ...(received ? {} : { disputeReason: disputeReason.trim() }),
      });
      const d = await apiGet<WithdrawalRequest[]>("/wallet/withdrawals/mine");
      setWithdrawals(d ?? []);
      setConfirmingId(null);
      setDisputeReason("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    }
  };

  if (loading) return <FullPageSpinner label="Loading earnings…" />;

  const balance = wallet?.balance ?? 0;
  const canWithdraw = balance >= 5;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Earnings</h1>
        <Link href="/dashboard?view=worker" className="text-sm text-neutral-500 hover:text-neutral-900 underline">
          Back to Dashboard
        </Link>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Balance cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-neutral-200 rounded-2xl bg-white p-6">
          <p className="text-sm text-neutral-500 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-neutral-900">${balance.toFixed(2)}</p>
        </div>
        <div className="border border-neutral-200 rounded-2xl bg-white p-6">
          <p className="text-sm text-neutral-500 mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-green-600">${(wallet?.totalEarned ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 text-center">
          <p className="text-lg font-bold text-neutral-900">${(wallet?.totalSpent ?? 0).toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Total Spent</p>
        </div>
        <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 text-center">
          <p className="text-lg font-bold text-neutral-900">${(wallet?.totalWithdrawn ?? 0).toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Withdrawn</p>
        </div>
        <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 text-center">
          <p className="text-lg font-bold text-neutral-900">${(wallet?.pendingBalance ?? 0).toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Pending</p>
        </div>
      </div>

      {/* Withdraw action */}
      <div className="border border-neutral-200 rounded-xl bg-white p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-neutral-900 text-sm">Ready to cash out?</p>
            <p className="text-xs text-neutral-500 mt-0.5">Minimum withdrawal: $5.00 · Processed in 3-5 business days</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            disabled={!canWithdraw}
            className="h-10 px-5 text-sm font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!canWithdraw ? `Need $${(5 - balance).toFixed(2)} more` : (showForm ? "Cancel" : "Withdraw")}
          </button>
        </div>

        {/* Withdrawal form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-5 pt-5 border-t border-neutral-100">
            {formError && <ErrorBanner message={formError} />}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Amount (USD)</label>
                <input
                  type="number"
                  min={10}
                  step={0.01}
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10.00"
                  className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <p className="text-xs text-neutral-400 mt-1">Available: ${balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Payout Method</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("PAYPAL")}
                    className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-colors ${
                      method === "PAYPAL"
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("MOBILE_MONEY")}
                    className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-colors ${
                      method === "MOBILE_MONEY"
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    Mobile Money
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  {method === "PAYPAL" ? "PayPal Email" : "Mobile Money Number"}
                </label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder={method === "PAYPAL" ? "your@email.com" : "+1234567890"}
                  className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting…" : `Request $${amount || "0.00"} Withdrawal`}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Withdrawal history */}
      <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
        Withdrawal History
      </h2>

      {withdrawals.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-200 rounded-xl mb-10">
          <p className="text-sm text-neutral-500">No withdrawal requests yet</p>
        </div>
      ) : (
        <div className="space-y-3 mb-10">
          {withdrawals.map((req) => {
            const meta = WITHDRAWAL_STATUS[req.status] || { label: req.status, color: "text-neutral-600", bg: "bg-neutral-50 border-neutral-200" };
            const isPaid = req.status === "PAID";
            return (
              <div key={req.id} className={`border rounded-xl p-5 ${meta.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-neutral-400">{req.method.replace("_", " ")}</span>
                  </div>
                  <span className="text-sm font-bold text-neutral-900">${req.amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-1">
                  {req.method === "PAYPAL" ? "PayPal: " : "Mobile: "}{req.accountDetails}
                </p>
                <p className="text-xs text-neutral-400">
                  Requested {new Date(req.createdAt).toLocaleDateString()}
                </p>

                {/* Admin notes */}
                {req.adminNotes && (
                  <p className="text-xs text-neutral-600 mt-2 italic">Note: {req.adminNotes}</p>
                )}

                {/* Payment proof + confirmation */}
                {isPaid && !req.workerConfirmed && !req.disputeReason && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    {req.paymentProofUrl && (
                      <a
                        href={req.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-700 underline mb-2 block"
                      >
                        View Payment Proof →
                      </a>
                    )}
                    {confirmingId === req.id ? (
                      <div className="space-y-2">
                        <p className="text-xs text-neutral-600">Did you receive the payment?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirm(req.id, true)}
                            className="flex-1 h-8 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Yes, Received
                          </button>
                          <button
                            onClick={() => handleConfirm(req.id, false)}
                            disabled={!disputeReason.trim()}
                            className="flex-1 h-8 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40"
                          >
                            No, Dispute
                          </button>
                        </div>
                        <textarea
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          placeholder="Why didn't you receive it? (required for dispute)"
                          rows={2}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg resize-none"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(req.id)}
                        className="h-8 px-4 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
                      >
                        Confirm Receipt
                      </button>
                    )}
                  </div>
                )}

                {req.status === "RESOLVED" && (
                  <p className="text-xs text-green-600 mt-2 font-medium">Payment confirmed received</p>
                )}
                {req.disputeReason && (
                  <p className="text-xs text-red-600 mt-2">Disputed: {req.disputeReason}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction history */}
      <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
        Recent Transactions
      </h2>

      {(!wallet?.transactions || wallet.transactions.length === 0) ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-xl">
          <p className="text-sm text-neutral-500">No transactions yet</p>
          <p className="text-xs text-neutral-400 mt-1">Complete tasks to start earning</p>
        </div>
      ) : (
        <div className="space-y-2">
          {wallet.transactions.map((tx) => {
            const meta = TXN_LABELS[tx.type] || { label: tx.type, color: "text-neutral-600" };
            const isPositive = ["DEPOSIT", "REWARD", "ESCROW_RELEASE"].includes(tx.type);
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between border border-neutral-200 rounded-xl bg-white px-5 py-4"
              >
                <div>
                  <p className={`text-sm font-medium ${meta.color}`}>{meta.label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString()} · {tx.status.toLowerCase()}
                  </p>
                  {tx.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">{tx.description}</p>
                  )}
                </div>
                <div className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-neutral-900"}`}>
                  {isPositive ? "+" : "-"}${safeNum(tx.amount).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
