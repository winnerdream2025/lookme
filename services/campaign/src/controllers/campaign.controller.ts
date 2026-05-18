import { Request, Response, NextFunction } from "express";
import { CampaignService } from "../services/campaign.service";
import { success } from "@lookme/utils";
// Campaign validation schemas deprecated - using any for now

const campaignService = new CampaignService();

// NOTE: Campaign service is disconnected from active flow — kept for future batch-order feature.
// Auth source is req.headers["x-user-id"] but schema types are missing from @lookme/validation.

export class CampaignController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as Record<string, unknown>;
      const clientId = req.headers["x-user-id"] as string;
      const result = await campaignService.list(query, clientId);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await campaignService.getById(req.params.id!);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;
      const clientId = req.headers["x-user-id"] as string;
      if (!clientId) throw new Error("Unauthorized");
      const result = await campaignService.create(body, clientId);
      res.status(201).json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;
      const result = await campaignService.update(req.params.id!, body);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await campaignService.publish(req.params.id!);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async pause(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await campaignService.pause(req.params.id!);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await campaignService.cancel(req.params.id!);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }
}
