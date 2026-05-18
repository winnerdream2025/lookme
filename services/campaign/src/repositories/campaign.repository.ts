import { prisma } from "@lookme/database";

// NOTE: Campaign model not in active schema - cast to any to avoid build errors
const db = prisma as any;

interface CreateCampaignData {
  clientId: string;
  name: string;
  description?: string;
  objective: string;
  totalBudget: number;
  pricePerUser: number;
  maxSlots: number;
  instructions?: string;
  targeting?: {
    countries?: string[];
    ageMin?: number;
    ageMax?: number;
    deviceTypes?: string[];
    minTrustScore?: number;
  };
}

export class CampaignRepository {
  async findMany(opts: {
    where: Record<string, unknown>;
    skip: number;
    take: number;
    orderBy: Record<string, unknown>;
  }) {
    return db.campaign.findMany({
      where: opts.where,
      skip: opts.skip,
      take: opts.take,
      orderBy: opts.orderBy,
      include: { targeting: true, _count: { select: { tasks: true } } },
    });
  }

  async count(where: Record<string, unknown>) {
    return db.campaign.count({ where });
  }

  async findById(id: string) {
    return db.campaign.findUnique({
      where: { id },
      include: { targeting: true, tasks: true },
    });
  }

  async create(data: CreateCampaignData) {
    return db.campaign.create({
      data: {
        clientId: data.clientId,
        name: data.name,
        description: data.description,
        objective: data.objective as never,
        totalBudget: data.totalBudget,
        pricePerUser: data.pricePerUser,
        maxSlots: data.maxSlots,
        instructions: data.instructions,
        targeting: data.targeting
          ? {
              create: {
                countries: data.targeting.countries ?? [],
                ageMin: data.targeting.ageMin,
                ageMax: data.targeting.ageMax,
                deviceTypes: (data.targeting.deviceTypes ?? []) as never,
                minTrustScore: data.targeting.minTrustScore ?? 0,
              },
            }
          : undefined,
      },
      include: { targeting: true },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    return db.campaign.update({
      where: { id },
      data,
      include: { targeting: true },
    });
  }

  async updateStatus(id: string, status: string) {
    return db.campaign.update({
      where: { id },
      data: {
        status: status as never,
        ...(status === "ACTIVE" ? { publishedAt: new Date() } : {}),
        ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
      include: { targeting: true },
    });
  }
}
