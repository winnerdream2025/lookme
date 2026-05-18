/** Shared domain types used across the app. */

export type UserRole = "client" | "worker" | "admin";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  language?: string;
}

export interface Me {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  profile?: UserProfile;
  name?: string;
  gender?: string;
}

export interface Order {
  id: string;
  trackingToken?: string;
  status: string;
  serviceType?: { name: string; platform?: { name: string } };
  service?: string;
  platform?: string;
  quantity: number;
  totalPrice: number;
  guestEmail?: string;
  guestName?: string;
  completedTasks: number;
  totalTasks: number;
  createdAt: string;
}

export interface Task {
  id: string;
  status: string;
  serviceType?: { name: string; platform?: { name: string } };
  targetUrl?: string;
  instructions?: string;
  reward?: number;
  order?: {
    businessName?: string;
    businessCountry?: string;
    requiredGender?: string;
    reviewRating?: number;
    referenceImageUrl?: string;
  };
}

export interface TaskItem {
  id: string;
  instructions: string;
  targetUrl: string;
  rewardAmount: number;
  scheduledFor?: string;
  platformName: string;
  platformSlug: string;
  categoryName: string;
  categorySlug: string;
  serviceName: string;
  isReview: boolean;
  requiresTimer?: boolean;
  minViewDuration?: number;
  mediaType?: string | null;
  reviewRating?: number;
  reviewContent?: string;
  reviewLanguage?: string;
  businessName?: string;
  businessCountry?: string;
  requiredGender?: string;
  referenceImageUrl?: string | null;
  status?: string;
  assignedAt?: string;
  expiresAt?: string;
  submittedAt?: string;
  proof?: {
    status: string;
    proofUrl?: string;
    screenshotUrl?: string;
    proofText?: string;
    rejectionReason?: string;
  };
  order?: {
    serviceType?: { name: string; platform?: { name: string } };
  };
}

export interface WorkerStats {
  active: number;
  submitted: number;
  completed: number;
  rejected: number;
  total: number;
  completionRate: number;
  trustScore: number;
  level: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  method: string;
  accountDetails: string;
  status: string;
  adminNotes?: string;
  paymentProofUrl?: string;
  workerConfirmed: boolean;
  disputeReason?: string;
  createdAt: string;
  reviewedAt?: string;
  paidAt?: string;
}

export interface WalletData {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
  totalWithdrawn: number;
  currency: string;
  transactions: Transaction[];
}

/** Canonical API response envelope. */
export type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code: string; status: number } };
