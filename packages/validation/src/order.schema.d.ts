import { z } from "zod";
export declare const placeOrderSchema: z.ZodObject<{
    serviceTypeId: z.ZodString;
    pricingTierId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    targetUrl: z.ZodUnion<[z.ZodString, z.ZodString]>;
    targetUsername: z.ZodOptional<z.ZodString>;
    reviewContent: z.ZodOptional<z.ZodString>;
    reviewSentiment: z.ZodOptional<z.ZodEnum<["POSITIVE", "NEGATIVE", "NEUTRAL"]>>;
    reviewRating: z.ZodOptional<z.ZodNumber>;
    instructions: z.ZodOptional<z.ZodString>;
    reviewLanguage: z.ZodOptional<z.ZodString>;
    businessName: z.ZodOptional<z.ZodString>;
    businessCountry: z.ZodOptional<z.ZodString>;
    requiredGender: z.ZodOptional<z.ZodEnum<["MALE", "FEMALE", "ANY"]>>;
}, "strip", z.ZodTypeAny, {
    serviceTypeId: string;
    quantity: number;
    targetUrl: string;
    instructions?: string | undefined;
    pricingTierId?: string | undefined;
    targetUsername?: string | undefined;
    reviewContent?: string | undefined;
    reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
    reviewRating?: number | undefined;
    reviewLanguage?: string | undefined;
    businessName?: string | undefined;
    businessCountry?: string | undefined;
    requiredGender?: "MALE" | "FEMALE" | "ANY" | undefined;
}, {
    serviceTypeId: string;
    quantity: number;
    targetUrl: string;
    instructions?: string | undefined;
    pricingTierId?: string | undefined;
    targetUsername?: string | undefined;
    reviewContent?: string | undefined;
    reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
    reviewRating?: number | undefined;
    reviewLanguage?: string | undefined;
    businessName?: string | undefined;
    businessCountry?: string | undefined;
    requiredGender?: "MALE" | "FEMALE" | "ANY" | undefined;
}>;
export declare const placeGuestOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        serviceTypeId: z.ZodString;
        pricingTierId: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        targetUrl: z.ZodString;
        targetUsername: z.ZodOptional<z.ZodString>;
        instructions: z.ZodOptional<z.ZodString>;
        guestEmail: z.ZodString;
        guestName: z.ZodOptional<z.ZodString>;
        reviewContent: z.ZodOptional<z.ZodString>;
        reviewSentiment: z.ZodOptional<z.ZodEnum<["POSITIVE", "NEGATIVE", "NEUTRAL"]>>;
        reviewRating: z.ZodOptional<z.ZodNumber>;
        businessName: z.ZodOptional<z.ZodString>;
        businessCountry: z.ZodOptional<z.ZodString>;
        reviewLanguage: z.ZodOptional<z.ZodString>;
        requiredGender: z.ZodOptional<z.ZodEnum<["MALE", "FEMALE", "ANY"]>>;
        createAccount: z.ZodOptional<z.ZodBoolean>;
        password: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        serviceTypeId: string;
        quantity: number;
        targetUrl: string;
        guestEmail: string;
        password?: string | undefined;
        instructions?: string | undefined;
        pricingTierId?: string | undefined;
        targetUsername?: string | undefined;
        reviewContent?: string | undefined;
        reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
        reviewRating?: number | undefined;
        reviewLanguage?: string | undefined;
        businessName?: string | undefined;
        businessCountry?: string | undefined;
        requiredGender?: "MALE" | "FEMALE" | "ANY" | undefined;
        guestName?: string | undefined;
        createAccount?: boolean | undefined;
    }, {
        serviceTypeId: string;
        quantity: number;
        targetUrl: string;
        guestEmail: string;
        password?: string | undefined;
        instructions?: string | undefined;
        pricingTierId?: string | undefined;
        targetUsername?: string | undefined;
        reviewContent?: string | undefined;
        reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
        reviewRating?: number | undefined;
        reviewLanguage?: string | undefined;
        businessName?: string | undefined;
        businessCountry?: string | undefined;
        requiredGender?: "MALE" | "FEMALE" | "ANY" | undefined;
        guestName?: string | undefined;
        createAccount?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        serviceTypeId: string;
        quantity: number;
        targetUrl: string;
        guestEmail: string;
        password?: string | undefined;
        instructions?: string | undefined;
        pricingTierId?: string | undefined;
        targetUsername?: string | undefined;
        reviewContent?: string | undefined;
        reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
        reviewRating?: number | undefined;
        reviewLanguage?: string | undefined;
        businessName?: string | undefined;
        businessCountry?: string | undefined;
        requiredGender?: "MALE" | "FEMALE" | "ANY" | undefined;
        guestName?: string | undefined;
        createAccount?: boolean | undefined;
    };
}, {
    body: {
        serviceTypeId: string;
        quantity: number;
        targetUrl: string;
        guestEmail: string;
        password?: string | undefined;
        instructions?: string | undefined;
        pricingTierId?: string | undefined;
        targetUsername?: string | undefined;
        reviewContent?: string | undefined;
        reviewSentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
        reviewRating?: number | undefined;
        reviewLanguage?: string | undefined;
        businessName?: string | undefined;
        businessCountry?: string | undefined;
        requiredGender?: "MALE" | "FEMALE" | "ANY" | undefined;
        guestName?: string | undefined;
        createAccount?: boolean | undefined;
    };
}>;
export declare const trackGuestOrderSchema: z.ZodObject<{
    params: z.ZodObject<{
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        token: string;
    }, {
        token: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        token: string;
    };
}, {
    params: {
        token: string;
    };
}>;
export declare const claimGuestOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        trackingToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        trackingToken: string;
    }, {
        trackingToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        trackingToken: string;
    };
}, {
    body: {
        trackingToken: string;
    };
}>;
export declare const listOrdersSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
} & {
    status: z.ZodOptional<z.ZodEnum<["PENDING", "PROCESSING", "IN_PROGRESS", "COMPLETED", "PARTIALLY_COMPLETED", "CANCELLED", "REFUNDED"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    status?: "PENDING" | "PROCESSING" | "IN_PROGRESS" | "COMPLETED" | "PARTIALLY_COMPLETED" | "CANCELLED" | "REFUNDED" | undefined;
    sortBy?: string | undefined;
}, {
    status?: "PENDING" | "PROCESSING" | "IN_PROGRESS" | "COMPLETED" | "PARTIALLY_COMPLETED" | "CANCELLED" | "REFUNDED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const cancelOrderSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type PlaceGuestOrderInput = z.infer<typeof placeGuestOrderSchema>["body"];
export type TrackGuestOrderParams = z.infer<typeof trackGuestOrderSchema>["params"];
export type ClaimGuestOrderInput = z.infer<typeof claimGuestOrderSchema>["body"];
export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
//# sourceMappingURL=order.schema.d.ts.map