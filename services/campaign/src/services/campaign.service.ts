import { createLogger } from "@lookme/logger";
import { paginate, paginationMeta } from "@lookme/utils";
// Campaign validation schemas deprecated - using generic types
import { CampaignRepository } from "../repositories/campaign.repository";

const logger = createLogger("campaign-service");
const repo = new CampaignRepository();

export class CampaignService {
  async list(query: Record<string, unknown>, clientId?: string) {
    const { skip, take } = paginate(query.page as number, query.limit as number);
    const where = {
      ...(clientId ? { clientId } : {}),
      ...(query.status ? { status: (query.status as string).toUpperCase() } : {}),
    };

    const [campaigns, total] = await Promise.all([
      repo.findMany({ where, skip, take, orderBy: { createdAt: query.sortOrder } }),
      repo.count(where),
    ]);

    return {
      campaigns,
      meta: paginationMeta(total, query.page as number, query.limit as number),
    };
  }

  async getById(id: string) {
    const campaign = await repo.findById(id);
    if (!campaign) {
      const err = new Error("Campaign not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "CAMPAIGN_NOT_FOUND";
      throw err;
    }
    return campaign;
  }

  async create(input: Record<string, unknown>, clientId: string) {
    const campaign = await repo.create({
      clientId,
      name: input.name as string,
      description: input.description as string | undefined,
      objective: (input.objective as string).toUpperCase(),
      totalBudget: input.totalBudget as number,
      pricePerUser: input.pricePerUser as number,
      maxSlots: input.maxSlots as number,
      instructions: input.instructions as string | undefined,
      targeting: input.targeting as any,
    });

    logger.info({ campaignId: campaign.id, clientId }, "Campaign created");
    return campaign;
  }

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id); // ensure exists
    return repo.update(id, input);
  }

  async publish(id: string) {
    const campaign = await this.getById(id);
    if (campaign.status !== "DRAFT") {
      const err = new Error("Only draft campaigns can be published") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "CAMPAIGN_INVALID_STATE";
      throw err;
    }
    const updated = await repo.updateStatus(id, "ACTIVE");
    logger.info({ campaignId: id }, "Campaign published");
    return updated;
  }

  async pause(id: string) {
    const campaign = await this.getById(id);
    if (campaign.status !== "ACTIVE") {
      const err = new Error("Only active campaigns can be paused") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "CAMPAIGN_INVALID_STATE";
      throw err;
    }
    return repo.updateStatus(id, "PAUSED");
  }

  async cancel(id: string) {
    const campaign = await this.getById(id);
    if (campaign.status === "COMPLETED" || campaign.status === "CANCELLED") {
      const err = new Error("Campaign already finalized") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "CAMPAIGN_INVALID_STATE";
      throw err;
    }
    return repo.updateStatus(id, "CANCELLED");
  }
}
