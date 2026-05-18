// ─── Enums ───

export type TransactionTypeString =
  | "DEPOSIT"
  | "ESCROW_LOCK"
  | "ESCROW_RELEASE"
  | "ESCROW_REFUND"
  | "WITHDRAWAL"
  | "PLATFORM_FEE"
  | "REWARD";

export type TransactionStatusString =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type EscrowStatusString =
  | "HELD"
  | "PARTIALLY_RELEASED"
  | "RELEASED"
  | "REFUNDED";

// ─── DTOs ───

export interface WalletDTO {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
  totalWithdrawn: number;
  currency: string;
}

export interface TransactionDTO {
  id: string;
  walletId: string;
  type: TransactionTypeString;
  status: TransactionStatusString;
  amount: number;
  fee: number;
  description?: string;
  referenceId?: string;
  referenceType?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  createdAt: string;
}

export interface EscrowDTO {
  id: string;
  orderId: string;
  fromWalletId: string;
  totalAmount: number;
  releasedAmount: number;
  refundedAmount: number;
  status: EscrowStatusString;
  lockedAt: string;
  releasedAt?: string;
  refundedAt?: string;
}
