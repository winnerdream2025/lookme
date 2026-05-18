import { Router, type Router as ExpressRouter } from "express";
import { CampaignController } from "../controllers/campaign.controller";

const router: ExpressRouter = Router();
const controller = new CampaignController();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.post("/:id/publish", controller.publish);
router.post("/:id/pause", controller.pause);
router.post("/:id/cancel", controller.cancel);

export { router as campaignRoutes };
