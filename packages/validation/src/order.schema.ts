import { z } from "zod";
import { paginationSchema } from "./common.schema";

const orderStatuses = [
  "PENDING",
  "PROCESSING",
  "IN_PROGRESS",
  "COMPLETED",
  "PARTIALLY_COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

const reviewSentiments = ["POSITIVE", "NEGATIVE", "NEUTRAL"] as const;

// ─── Registered User Order ───

const genders = ["MALE", "FEMALE", "ANY"] as const;

export const placeOrderSchema = z.object({
  serviceTypeId: z.string().min(1), // accepts cuid or slug; service resolves both
  pricingTierId: z.string().cuid().optional(),
  quantity: z.number().int().min(1),
  targetUrl: z.string().url("Must be a valid URL").or(z.string().min(1).max(500)),
  targetUsername: z.string().min(1).max(200).optional(),
  reviewContent: z.string().min(10).max(5000).optional(),
  reviewSentiment: z.enum(reviewSentiments).optional(),
  reviewRating: z.number().int().min(1).max(5).optional(),
  instructions: z.string().max(2000).optional(),
  referenceImageUrl: z.string().url().optional(),
  // review targeting
  reviewLanguage: z.string().min(2).max(50).optional(),
  businessName: z.string().min(1).max(300).optional(),
  businessCountry: z.string().length(2).optional(),
  requiredGender: z.enum(genders).optional(),
});

// ─── Guest Order ───

export const placeGuestOrderSchema = z.object({
  body: z.object({
    serviceTypeId: z.string().min(1), // accepts cuid or slug; service resolves both
    pricingTierId: z.string().cuid().optional(),
    quantity: z.number().int().positive(),
    targetUrl: z.string().url(),
    targetUsername: z.string().optional(),
    instructions: z.string().max(2000).optional(),
    referenceImageUrl: z.string().url().optional(),
    // Guest fields
    guestEmail: z.string().email(),
    guestName: z.string().min(2).max(100).optional(),
    // Review-specific
    reviewContent: z.string().max(1000).optional(),
    reviewSentiment: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).optional(),
    reviewRating: z.number().int().min(1).max(5).optional(),
    businessName: z.string().min(1).max(300).optional(),
    businessCountry: z.string().length(2).optional(),
    reviewLanguage: z.string().min(2).max(50).optional(),
    requiredGender: z.enum(genders).optional(),
    // Optional: create account after purchase
    createAccount: z.boolean().optional(),
    password: z.string().min(8).optional(),
  }),
});

export const trackGuestOrderSchema = z.object({
  params: z.object({
    token: z.string().cuid(),
  }),
});

export const claimGuestOrderSchema = z.object({
  body: z.object({
    trackingToken: z.string().cuid(),
  }),
});

// ─── Common Order Schemas ───

export const listOrdersSchema = paginationSchema.extend({
  status: z.enum(orderStatuses).optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().max(1000).optional(),
});

// ─── Type Exports ───

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type PlaceGuestOrderInput = z.infer<typeof placeGuestOrderSchema>["body"];
export type TrackGuestOrderParams = z.infer<typeof trackGuestOrderSchema>["params"];
export type ClaimGuestOrderInput = z.infer<typeof claimGuestOrderSchema>["body"];
export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
