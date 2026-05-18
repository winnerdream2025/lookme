import { z } from "zod";
import { paginationSchema } from "./common.schema";

// ─── Platform ───

export const createPlatformSchema = z.object({
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  name: z.string().min(1).max(100),
  icon: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color").optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const updatePlatformSchema = createPlatformSchema.partial();

// ─── Service Category ───

export const createCategorySchema = z.object({
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Service Type ───

export const createServiceTypeSchema = z.object({
  platformId: z.string().cuid(),
  categoryId: z.string().cuid(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  minQuantity: z.number().int().min(1).default(10),
  maxQuantity: z.number().int().min(1).default(10000),
  basePrice: z.number().positive("Price must be positive"),
  workerReward: z.number().positive("Worker reward must be positive"),
  estimatedTime: z.number().int().min(1).default(30),
  deliveryEstimate: z.string().max(100).optional(),
  requiresProof: z.boolean().default(true),
  proofType: z.enum(["screenshot", "link", "username"]).optional(),
  instructions: z.string().max(5000).optional(),
  metadata: z.record(z.unknown()).optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateServiceTypeSchema = createServiceTypeSchema.partial();

// ─── Pricing Tier ───

export const createPricingTierSchema = z.object({
  serviceTypeId: z.string().cuid(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  multiplier: z.number().min(0.5).max(10).default(1),
  deliveryHours: z.number().int().min(1),
  sortOrder: z.number().int().min(0).default(0),
});

export const updatePricingTierSchema = createPricingTierSchema.partial();

// ─── List/Browse ───

export const listServicesSchema = paginationSchema.extend({
  platformSlug: z.string().optional(),
  categorySlug: z.string().optional(),
});

export type CreatePlatformInput = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateServiceTypeInput = z.infer<typeof createServiceTypeSchema>;
export type UpdateServiceTypeInput = z.infer<typeof updateServiceTypeSchema>;
export type CreatePricingTierInput = z.infer<typeof createPricingTierSchema>;
export type UpdatePricingTierInput = z.infer<typeof updatePricingTierSchema>;
export type ListServicesInput = z.infer<typeof listServicesSchema>;
