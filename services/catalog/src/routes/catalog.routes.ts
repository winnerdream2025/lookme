import { Router, type Router as ExpressRouter } from "express";
import { validate, requireAdmin } from "@lookme/server";
import {
  createPlatformSchema,
  updatePlatformSchema,
  createCategorySchema,
  updateCategorySchema,
  createServiceTypeSchema,
  updateServiceTypeSchema,
  createPricingTierSchema,
  listServicesSchema,
} from "@lookme/validation";
import { CatalogController } from "../controllers/catalog.controller";

const router: ExpressRouter = Router();
const controller = new CatalogController();

// ─── Public: Browse ───
router.get("/platforms", controller.listPlatforms);
router.get("/categories", controller.listCategories);
router.get("/services", validate(listServicesSchema, "query"), controller.listServices);
router.get("/services/:slug", controller.getServiceBySlug);

// ─── Admin: Platforms ───
router.post("/platforms", requireAdmin, validate(createPlatformSchema), controller.createPlatform);
router.patch("/platforms/:id", requireAdmin, validate(updatePlatformSchema), controller.updatePlatform);

// ─── Admin: Categories ───
router.post("/categories", requireAdmin, validate(createCategorySchema), controller.createCategory);
router.patch("/categories/:id", requireAdmin, validate(updateCategorySchema), controller.updateCategory);

// ─── Admin: Service Types ───
router.post("/services", requireAdmin, validate(createServiceTypeSchema), controller.createServiceType);
router.patch("/services/:id", requireAdmin, validate(updateServiceTypeSchema), controller.updateServiceType);

// ─── Admin: Pricing Tiers ───
router.post("/pricing-tiers", requireAdmin, validate(createPricingTierSchema), controller.createPricingTier);

export { router as catalogRoutes };
