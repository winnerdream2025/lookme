import { Request, Response, NextFunction } from "express";
import { CatalogService } from "../services/catalog.service";

const service = new CatalogService();

export class CatalogController {
  async listPlatforms(_req: Request, res: Response, next: NextFunction) {
    try {
      const platforms = await service.listPlatforms();
      res.json({ success: true, data: platforms });
    } catch (err) {
      next(err);
    }
  }

  async listCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await service.listCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  async listServices(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req as unknown as Record<string, unknown>).validatedQuery as Record<string, unknown> | undefined;
      const services = await service.listServices(query);
      res.json({ success: true, data: services });
    } catch (err) {
      next(err);
    }
  }

  async getServiceBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getServiceBySlug(req.params.slug!);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async createPlatform(req: Request, res: Response, next: NextFunction) {
    try {
      const platform = await service.createPlatform(req.body);
      res.status(201).json({ success: true, data: platform });
    } catch (err) {
      next(err);
    }
  }

  async updatePlatform(req: Request, res: Response, next: NextFunction) {
    try {
      const platform = await service.updatePlatform(req.params.id!, req.body);
      res.json({ success: true, data: platform });
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await service.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await service.updateCategory(req.params.id!, req.body);
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  async createServiceType(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceType = await service.createServiceType(req.body);
      res.status(201).json({ success: true, data: serviceType });
    } catch (err) {
      next(err);
    }
  }

  async updateServiceType(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceType = await service.updateServiceType(req.params.id!, req.body);
      res.json({ success: true, data: serviceType });
    } catch (err) {
      next(err);
    }
  }

  async createPricingTier(req: Request, res: Response, next: NextFunction) {
    try {
      const tier = await service.createPricingTier(req.body);
      res.status(201).json({ success: true, data: tier });
    } catch (err) {
      next(err);
    }
  }
}
