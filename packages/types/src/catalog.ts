// ─── Platform ───

export interface PlatformDTO {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  serviceCount?: number;
}

// ─── Service Category ───

export interface ServiceCategoryDTO {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

// ─── Service Type ───

export interface ServiceTypeDTO {
  id: string;
  platformId: string;
  categoryId: string;
  slug: string;
  name: string;
  description?: string;
  minQuantity: number;
  maxQuantity: number;
  basePrice: number;
  estimatedTime: number;
  deliveryEstimate?: string;
  isActive: boolean;
  requiresProof: boolean;
  proofType?: string;
  instructions?: string;
  sortOrder: number;
  platform?: PlatformDTO;
  category?: ServiceCategoryDTO;
  pricingTiers?: PricingTierDTO[];
}

// ─── Pricing Tier ───

export interface PricingTierDTO {
  id: string;
  serviceTypeId: string;
  slug: string;
  name: string;
  multiplier: number;
  deliveryHours: number;
  isActive: boolean;
  sortOrder: number;
}

// ─── Catalog Browse Response ───

export interface CatalogBrowseResponse {
  platforms: PlatformDTO[];
  categories: ServiceCategoryDTO[];
  services: ServiceTypeDTO[];
}
