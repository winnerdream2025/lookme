"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WalletData {
  balance: number;
  pendingBalance: number;
  minimumWithdrawal: number;
}

export default function WithdrawPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    method: "PAYPAL" as "PAYPAL" | "MOBILE_MONEY",
    accountDetails: "",
  });

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    try {
      setLoading(true);
      const data = await apiGet<WalletData>("/wallet/me");
      setWallet(data);
      
      // Pre-fill with available balance
      if (data.balance >= data.minimumWithdrawal) {
        setFormData(prev => ({ ...prev, amount: data.balance.toFixed(2) }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const amount = parseFloat(formData.amount);

    // Validation
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!wallet) {
      setError("Wallet not loaded");
      return;
    }

    if (amount < wallet.minimumWithdrawal) {
      setError(`Minimum withdrawal is $${wallet.minimumWithdrawal}`);
      return;
    }

    if (amount > wallet.balance) {
      setError(`Insufficient balance. You have $${wallet.balance.toFixed(2)} available.`);
      return;
    }

    if (!formData.accountDetails.trim()) {
      setError("Please enter your account details");
      return;
    }

    try {
      setSubmitting(true);
      await apiPost("/wallet/withdrawals/request", {
        amount,
        method: formData.method,
        accountDetails: formData.accountDetails.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/withdrawals");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to request withdrawal");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorBanner message="Wallet not found" />
      </div>
    );
  }

  const canWithdraw = wallet.balance >= wallet.minimumWithdrawal;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Request Withdrawal</h1>
        <Link
          href="/dashboard/earnings"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Earnings
        </Link>
      </div>

      {/* Balance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-blue-900">${wallet.balance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-yellow-700 mb-1">Pending (In Hold)</p>
            <p className="text-3xl font-bold text-yellow-900">${wallet.pendingBalance.toFixed(2)}</p>
          </div>
        </div>
        {!canWithdraw && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Cannot withdraw:</strong> You need at least ${wallet.minimumWithdrawal} available. 
              You currently have ${wallet.balance.toFixed(2)} available.
            </p>
          </div>
        )}
      </div>

      {success ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Withdrawal Requested!</h2>
          <p className="text-green-700 mb-4">
            Your withdrawal request has been submitted. An admin will review and process it shortly.
          </p>
          <p className="text-sm text-green-600">Redirecting to withdrawal history...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6">
          {error && <ErrorBanner message={error} />}

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min={wallet.minimumWithdrawal}
                max={wallet.balance}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                disabled={!canWithdraw}
                required
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Minimum: ${wallet.minimumWithdrawal} • Maximum: ${wallet.balance.toFixed(2)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, method: "PAYPAL" })}
                className={`p-4 border-2 rounded-lg font-medium transition-all ${
                  formData.method === "PAYPAL"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                disabled={!canWithdraw}
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c2.347 0 4.203.494 5.52 1.467 1.318.973 1.977 2.413 1.977 4.32 0 1.907-.66 3.347-1.977 4.32-1.317.973-3.173 1.467-5.52 1.467H9.76l-1.684 6.696z"/>
                </svg>
                PayPal
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, method: "MOBILE_MONEY" })}
                className={`p-4 border-2 rounded-lg font-medium transition-all ${
                  formData.method === "MOBILE_MONEY"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                disabled={!canWithdraw}
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Mobile Money
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.method === "PAYPAL" ? "PayPal Email" : "Mobile Money Number"} *
            </label>
            <input
              type="text"
              value={formData.accountDetails}
              onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={formData.method === "PAYPAL" ? "your@email.com" : "+1234567890"}
              disabled={!canWithdraw}
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              {formData.method === "PAYPAL" 
                ? "Enter the email address associated with your PayPal account"
                : "Enter your mobile money number (e.g., M-Pesa, MTN, Airtel)"
              }
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Processing Time</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Admin review: 1-2 business days</li>
              <li>• Payment processing: 3-5 business days</li>
              <li>• You'll be notified via email when payment is sent</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canWithdraw || submitting}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white ${
              canWithdraw && !submitting
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <Spinner size="sm" />
                <span className="ml-2">Submitting...</span>
              </span>
            ) : (
              `Request Withdrawal`
            )}
          </button>
        </form>
      )}
    </div>
  );
}
