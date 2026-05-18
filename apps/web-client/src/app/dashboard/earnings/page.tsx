"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import { StatCard } from "@/components/worker/StatCard";
import { Table, MoneyCell, StatusCell, DateCell } from "@/components/worker/Table";
import { Button } from "@/components/worker/Button";
import { cn } from "@/styles/worker-design-system";

interface PendingTask {
  id: string;
  amount: number;
  availableAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency: string;
  minimumWithdrawal: number;
  pendingTasks: PendingTask[];
  transactions: Transaction[];
}

export default function EarningsPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    try {
      setLoading(true);
      const data = await apiGet<WalletData>("/wallet/me");
      setWallet(data);
    } catch (err: any) {
      setError(err.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-sm text-neutral-500">Loading wallet...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-error-900">Error loading wallet</p>
              <p className="text-sm text-error-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
        <Button onClick={loadWallet}>Retry</Button>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4">
        <p className="text-sm font-medium text-error-900">Wallet not found</p>
      </div>
    );
  }

  const canWithdraw = wallet.balance >= wallet.minimumWithdrawal;
  const needsMore = wallet.minimumWithdrawal - wallet.balance;

  function getTimeRemaining(availableAt: string): string {
    const now = new Date();
    const target = new Date(availableAt);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Available now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  }

  // Calculate earnings stats
  const todayEarnings = wallet.transactions
    .filter(t => t.type === 'REWARD' && new Date(t.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);
  
  const weekEarnings = wallet.transactions
    .filter(t => {
      const txDate = new Date(t.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return t.type === 'REWARD' && txDate >= weekAgo;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">

      {/* Balance & Withdraw */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Available Balance"
            value={`$${wallet.balance.toFixed(2)}`}
            subtitle={canWithdraw ? "Ready to withdraw" : `Need $${needsMore.toFixed(2)} more`}
            variant="success"
            size="lg"
          />
          <StatCard
            label="Pending"
            value={`$${wallet.pendingBalance.toFixed(2)}`}
            subtitle={`${wallet.pendingTasks.length} tasks in hold`}
            variant="warning"
          />
          <StatCard
            label="This Week"
            value={`$${weekEarnings.toFixed(2)}`}
            subtitle="Last 7 days"
            variant="primary"
          />
          <StatCard
            label="Total Earned"
            value={`$${wallet.totalEarned.toFixed(2)}`}
            subtitle="All-time"
            variant="default"
          />
        </div>
        
        {/* Withdraw Action */}
        {canWithdraw ? (
          <div className="mt-4">
            <Link href="/dashboard/withdraw">
              <Button 
                variant="primary"
                size="lg"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
              >
                Withdraw ${wallet.balance.toFixed(2)}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 bg-info-50 border border-info-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-info-900">Minimum withdrawal: ${wallet.minimumWithdrawal.toFixed(2)}</p>
                <p className="text-sm text-info-700 mt-1">Complete more tasks to reach the minimum withdrawal amount.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pending Tasks */}
      {wallet.pendingTasks.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Pending Tasks</h2>
                <p className="text-sm text-neutral-500 mt-0.5">{wallet.pendingTasks.length} tasks in hold period</p>
              </div>
            </div>
          </div>
          <Table
            columns={[
              {
                key: 'amount',
                label: 'Amount',
                render: (task: PendingTask) => <MoneyCell amount={task.amount} positive={true} />,
              },
              {
                key: 'id',
                label: 'Task ID',
                render: (task: PendingTask) => (
                  <span className="font-mono text-xs text-neutral-600">{task.id.slice(0, 12)}</span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (task: PendingTask) => {
                  const timeLeft = getTimeRemaining(task.availableAt);
                  const isAvailable = timeLeft === "Available now";
                  return isAvailable ? (
                    <StatusCell status="Available" variant="success" />
                  ) : (
                    <div className="text-sm">
                      <div className="font-medium text-warning-700">In {timeLeft}</div>
                      <div className="text-xs text-neutral-500">{new Date(task.availableAt).toLocaleDateString()}</div>
                    </div>
                  );
                },
                align: 'right',
              },
            ]}
            data={wallet.pendingTasks}
            keyExtractor={(task) => task.id}
          />
          <div className="px-6 py-4 bg-info-50 border-t border-info-200">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-info-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-info-800">
                <strong className="font-semibold">Fraud Protection:</strong> Earnings are held for 24-48 hours to verify task completion and protect both workers and the platform.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Transaction History</h2>
              <p className="text-sm text-neutral-500 mt-0.5">{wallet.transactions.length} total transactions</p>
            </div>
          </div>
        </div>
        <Table
          columns={[
            {
              key: 'description',
              label: 'Description',
              render: (tx: Transaction) => (
                <div>
                  <div className="font-medium text-neutral-900">{tx.description}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {tx.type === 'REWARD' ? 'Task Reward' : tx.type === 'WITHDRAWAL' ? 'Withdrawal' : 'Transaction'}
                  </div>
                </div>
              ),
            },
            {
              key: 'createdAt',
              label: 'Date',
              render: (tx: Transaction) => <DateCell date={tx.createdAt} />,
            },
            {
              key: 'status',
              label: 'Status',
              render: (tx: Transaction) => (
                <StatusCell 
                  status={tx.status} 
                  variant={
                    tx.status === 'COMPLETED' ? 'success' :
                    tx.status === 'PENDING' ? 'warning' :
                    'default'
                  }
                />
              ),
              align: 'center',
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (tx: Transaction) => (
                <MoneyCell 
                  amount={tx.amount} 
                  positive={tx.type === 'REWARD' ? true : tx.type === 'WITHDRAWAL' ? false : undefined}
                />
              ),
              align: 'right',
            },
          ]}
          data={wallet.transactions}
          keyExtractor={(tx) => tx.id}
          emptyState={
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <svg className="w-12 h-12 text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-sm font-medium text-neutral-900 mb-1">No transactions yet</h3>
              <p className="text-sm text-neutral-500">Your transaction history will appear here</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
