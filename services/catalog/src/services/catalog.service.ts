import { CatalogRepository } from "../repositories/catalog.repository";
import { AppError } from "@lookme/server";

const repo = new CatalogRepository();

export class CatalogService {
  async listPlatforms() {
    return repo.findAllPlatforms();
  }

  async listCategories() {
    return repo.findAllCategories();
  }

  async listServices(query?: Record<string, unknown>) {
    return repo.findServices({
      platformSlug: query?.platformSlug as string | undefined,
      categorySlug: query?.categorySlug as string | undefined,
      page: (query?.page as number) || 1,
      limit: (query?.limit as number) || 50,
    });
  }

  async getServiceBySlug(slug: string) {
    const service = await repo.findServiceBySlug(slug);
    if (!service) {
      throw AppError.notFound("SERVICE_NOT_FOUND", `Service '${slug}' not found`);
    }
    return service;
  }

  async createPlatform(data: { slug: string; name: string; icon?: string; color?: string; sortOrder?: number }) {
    const existing = await repo.findPlatformBySlug(data.slug);
    if (existing) {
      throw AppError.conflict("PLATFORM_EXISTS", `Platform '${data.slug}' already exists`);
    }
    return repo.createPlatform(data);
  }

  async updatePlatform(id: string, data: Record<string, unknown>) {
    return repo.updatePlatform(id, data);
  }

  async createCategory(data: { slug: string; name: string; description?: string; icon?: string; sortOrder?: number }) {
    const existing = await repo.findCategoryBySlug(data.slug);
    if (existing) {
      throw AppError.conflict("CATEGORY_EXISTS", `Category '${data.slug}' already exists`);
    }
    return repo.createCategory(data);
  }

  async updateCategory(id: string, data: Record<string, unknown>) {
    return repo.updateCategory(id, data);
  }

  async createServiceType(data: Record<string, unknown>) {
    const slug = data.slug as string;
    const existing = await repo.findServiceBySlug(slug);
    if (existing) {
      throw AppError.conflict("SERVICE_TYPE_EXISTS", `Service type '${slug}' already exists`);
    }
    return repo.createServiceType(data);
  }

  async updateServiceType(id: string, data: Record<string, unknown>) {
    return repo.updateServiceType(id, data);
  }

  async createPricingTier(data: Record<string, unknown>) {
    return repo.createPricingTier(data);
  }
}
