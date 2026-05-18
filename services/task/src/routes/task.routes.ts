import { Router } from "express";
import multer from "multer";
import { validate, requireAdmin } from "@lookme/server";
import {
  taskFeedSchema,
  acceptTaskSchema,
  submitProofSchema,
  listTasksSchema,
  reviewProofSchema,
} from "@lookme/validation";
import { TaskController } from "../controllers/task.controller";
import { antiFraudMiddleware } from "../middleware/anti-fraud.middleware";
import { botDetectionMiddleware } from "../middleware/bot-detection.middleware";

const router: Router = Router();
const controller = new TaskController();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Worker endpoints
router.get("/feed", validate(taskFeedSchema, "query"), controller.feed);
router.post("/accept", validate(acceptTaskSchema), antiFraudMiddleware, controller.accept);
router.post("/submit", validate(submitProofSchema), botDetectionMiddleware, controller.submitProof);
router.post("/upload-screenshot", upload.single("screenshot"), controller.uploadScreenshot);
router.post("/media-session", controller.mediaSession.bind(controller));
router.post("/heartbeat", controller.heartbeat.bind(controller));
router.get("/mine", controller.listMine);
router.get("/stats", controller.getStats);

// Admin / system endpoints
router.get("/admin/audit/queue", requireAdmin, controller.auditQueue.bind(controller));
router.post("/release-expired", requireAdmin, controller.releaseExpired);
router.post("/review", requireAdmin, validate(reviewProofSchema), controller.reviewProof);
router.post("/bulk-review", requireAdmin, controller.bulkReview.bind(controller));

// Admin list (before /:id to avoid route conflict)
router.get("/", validate(listTasksSchema, "query"), controller.list);

// Shared
router.get("/:id", controller.getById);

export { router as taskRoutes };
