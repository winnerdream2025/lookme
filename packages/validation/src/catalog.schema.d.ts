import { z } from "zod";
export declare const createPlatformSchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
    slug: string;
    icon?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    slug: string;
    sortOrder?: number | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}>;
export declare const updatePlatformSchema: z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}>;
export declare const createCategorySchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
    slug: string;
    icon?: string | undefined;
    description?: string | undefined;
}, {
    name: string;
    slug: string;
    sortOrder?: number | undefined;
    icon?: string | undefined;
    description?: string | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    description?: string | undefined;
}>;
export declare const createServiceTypeSchema: z.ZodObject<{
    platformId: z.ZodString;
    categoryId: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    minQuantity: z.ZodDefault<z.ZodNumber>;
    maxQuantity: z.ZodDefault<z.ZodNumber>;
    basePrice: z.ZodNumber;
    workerReward: z.ZodNumber;
    estimatedTime: z.ZodDefault<z.ZodNumber>;
    deliveryEstimate: z.ZodOptional<z.ZodString>;
    requiresProof: z.ZodDefault<z.ZodBoolean>;
    proofType: z.ZodOptional<z.ZodEnum<["screenshot", "link", "username"]>>;
    instructions: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
    slug: string;
    platformId: string;
    categoryId: string;
    minQuantity: number;
    maxQuantity: number;
    basePrice: number;
    workerReward: number;
    estimatedTime: number;
    requiresProof: boolean;
    description?: string | undefined;
    deliveryEstimate?: string | undefined;
    proofType?: "screenshot" | "link" | "username" | undefined;
    instructions?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    name: string;
    slug: string;
    platformId: string;
    categoryId: string;
    basePrice: number;
    workerReward: number;
    sortOrder?: number | undefined;
    description?: string | undefined;
    minQuantity?: number | undefined;
    maxQuantity?: number | undefined;
    estimatedTime?: number | undefined;
    deliveryEstimate?: string | undefined;
    requiresProof?: boolean | undefined;
    proofType?: "screenshot" | "link" | "username" | undefined;
    instructions?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const updateServiceTypeSchema: z.ZodObject<{
    platformId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    minQuantity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    maxQuantity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    basePrice: z.ZodOptional<z.ZodNumber>;
    workerReward: z.ZodOptional<z.ZodNumber>;
    estimatedTime: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    deliveryEstimate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    requiresProof: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    proofType: z.ZodOptional<z.ZodOptional<z.ZodEnum<["screenshot", "link", "username"]>>>;
    instructions: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    platformId?: string | undefined;
    categoryId?: string | undefined;
    minQuantity?: number | undefined;
    maxQuantity?: number | undefined;
    basePrice?: number | undefined;
    workerReward?: number | undefined;
    estimatedTime?: number | undefined;
    deliveryEstimate?: string | undefined;
    requiresProof?: boolean | undefined;
    proofType?: "screenshot" | "link" | "username" | undefined;
    instructions?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    platformId?: string | undefined;
    categoryId?: string | undefined;
    minQuantity?: number | undefined;
    maxQuantity?: number | undefined;
    basePrice?: number | undefined;
    workerReward?: number | undefined;
    estimatedTime?: number | undefined;
    deliveryEstimate?: string | undefined;
    requiresProof?: boolean | undefined;
    proofType?: "screenshot" | "link" | "username" | undefined;
    instructions?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const createPricingTierSchema: z.ZodObject<{
    serviceTypeId: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    multiplier: z.ZodDefault<z.ZodNumber>;
    deliveryHours: z.ZodNumber;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
    slug: string;
    serviceTypeId: string;
    multiplier: number;
    deliveryHours: number;
}, {
    name: string;
    slug: string;
    serviceTypeId: string;
    deliveryHours: number;
    sortOrder?: number | undefined;
    multiplier?: number | undefined;
}>;
export declare const updatePricingTierSchema: z.ZodObject<{
    serviceTypeId: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    multiplier: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    deliveryHours: z.ZodOptional<z.ZodNumber>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    serviceTypeId?: string | undefined;
    multiplier?: number | undefined;
    deliveryHours?: number | undefined;
}, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    slug?: string | undefined;
    serviceTypeId?: string | undefined;
    multiplier?: number | undefined;
    deliveryHours?: number | undefined;
}>;
export declare const listServicesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
} & {
    platformSlug: z.ZodOptional<z.ZodString>;
    categorySlug: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
    platformSlug?: string | undefined;
    categorySlug?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    platformSlug?: string | undefined;
    categorySlug?: string | undefined;
}>;
export type CreatePlatformInput = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateServiceTypeInput = z.infer<typeof createServiceTypeSchema>;
export type UpdateServiceTypeInput = z.infer<typeof updateServiceTypeSchema>;
export type CreatePricingTierInput = z.infer<typeof createPricingTierSchema>;
export type UpdatePricingTierInput = z.infer<typeof updatePricingTierSchema>;
export type ListServicesInput = z.infer<typeof listServicesSchema>;
//# sourceMappingURL=catalog.schema.d.ts.map