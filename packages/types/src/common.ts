// ─── Standard API Response ───

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── ID Types ───

export type UserId = string;
export type OrderId = string;
export type TaskId = string;
export type WalletId = string;
export type TransactionId = string;
export type EscrowId = string;
export type PlatformId = string;
export type ServiceTypeId = string;

// ─── Timestamps ───

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
