// ─── Order Status ───

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  WALLET = "WALLET",
  STRIPE = "STRIPE",
}

// ─── Order DTOs ───

export interface OrderDTO {
  id: string;
  
  // Client (optional for guest orders)
  clientId?: string;
  
  // Guest fields
  guestEmail?: string;
  guestName?: string;
  trackingToken?: string;
  
  // Service & pricing
  serviceTypeId: string;
  pricingTierId?: string;
  
  // Order details
  status: OrderStatus;
  quantity: number;
  completedQty: number;
  targetUrl: string;
  targetUsername?: string;
  
  // Pricing
  unitPrice: number;
  totalPrice: number;
  workerReward: number;
  
  // Payment
  paymentMethod: PaymentMethod;
  stripePaymentId?: string;
  
  // Review-specific
  reviewContent?: string;
  reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  reviewRating?: number;
  
  // Additional
  instructions?: string;
  
  // Timestamps
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  progress: number; // completedQty / quantity * 100
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  quantity: number;
  completedQty: number;
  totalPrice: number;
  serviceName: string;
  platformName: string;
  createdAt: string;
  progress: number;
}
