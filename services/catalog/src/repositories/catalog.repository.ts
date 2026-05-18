import { prisma } from "@lookme/database";

export class CatalogRepository {
  async findAllPlatforms() {
    return prisma.platform.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findPlatformBySlug(slug: string) {
    return prisma.platform.findUnique({ where: { slug } });
  }

  async createPlatform(data: { slug: string; name: string; icon?: string; color?: string; sortOrder?: number }) {
    return prisma.platform.create({ data });
  }

  async updatePlatform(id: string, data: Record<string, unknown>) {
    return prisma.platform.update({ where: { id }, data });
  }

  async findAllCategories() {
    return prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findCategoryBySlug(slug: string) {
    return prisma.serviceCategory.findUnique({ where: { slug } });
  }

  async createCategory(data: { slug: string; name: string; description?: string; icon?: string; sortOrder?: number }) {
    return prisma.serviceCategory.create({ data });
  }

  async updateCategory(id: string, data: Record<string, unknown>) {
    return prisma.serviceCategory.update({ where: { id }, data });
  }

  async findServices(opts: { platformSlug?: string; categorySlug?: string; page: number; limit: number }) {
    const where: Record<string, unknown> = { isActive: true };

    if (opts.platformSlug) {
      where.platform = { slug: opts.platformSlug };
    }
    if (opts.categorySlug) {
      where.category = { slug: opts.categorySlug };
    }

    const [services, total] = await Promise.all([
      prisma.serviceType.findMany({
        where,
        include: { platform: true, category: true, pricingTiers: { where: { isActive: true } } },
        orderBy: { sortOrder: "asc" },
        skip: (opts.page - 1) * opts.limit,
        take: opts.limit,
      }),
      prisma.serviceType.count({ where }),
    ]);

    return { services, total, page: opts.page, limit: opts.limit, totalPages: Math.ceil(total / opts.limit) };
  }

  async findServiceBySlug(slug: string) {
    return prisma.serviceType.findUnique({
      where: { slug },
      include: { platform: true, category: true, pricingTiers: { where: { isActive: true } } },
    });
  }

  async createServiceType(data: Record<string, unknown>) {
    return prisma.serviceType.create({ data: data as any });
  }

  async updateServiceType(id: string, data: Record<string, unknown>) {
    return prisma.serviceType.update({ where: { id }, data: data as any });
  }

  async createPricingTier(data: Record<string, unknown>) {
    return prisma.pricingTier.create({ data: data as any });
  }
}
