export declare enum OrderStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentMethod {
    WALLET = "WALLET",
    STRIPE = "STRIPE"
}
export interface OrderDTO {
    id: string;
    clientId?: string;
    guestEmail?: string;
    guestName?: string;
    trackingToken?: string;
    serviceTypeId: string;
    pricingTierId?: string;
    status: OrderStatus;
    quantity: number;
    completedQty: number;
    targetUrl: string;
    targetUsername?: string;
    unitPrice: number;
    totalPrice: number;
    workerReward: number;
    paymentMethod: PaymentMethod;
    stripePaymentId?: string;
    reviewContent?: string;
    reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
    reviewRating?: number;
    instructions?: string;
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    progress: number;
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
//# sourceMappingURL=order.d.ts.map