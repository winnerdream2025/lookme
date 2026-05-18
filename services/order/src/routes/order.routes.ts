import { Router, type Router as ExpressRouter } from "express";
import multer from "multer";
import { validate } from "@lookme/server";
import { placeOrderSchema, listOrdersSchema, cancelOrderSchema } from "@lookme/validation";
import { OrderController } from "../controllers/order.controller";

const router: ExpressRouter = Router();
const webhookRouter: ExpressRouter = Router();
const controller = new OrderController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ─── Public: Guest ───
router.post("/upload-reference", upload.single("reference"), controller.uploadReference);
router.post("/guest", controller.placeGuestOrder);
router.get("/track/:token", controller.trackGuestOrder);

// ─── Public: Payment intent (guest has no auth token) ───
router.post("/:id/payment-intent", controller.createPaymentIntent);

// ─── Authenticated ───
router.post("/claim", controller.claimOrder);
router.post("/", validate(placeOrderSchema), controller.placeOrder);
router.get("/", controller.listOrders);
router.get("/:id", controller.getOrder);
router.post("/:id/cancel", validate(cancelOrderSchema), controller.cancelOrder);

// ─── Stripe webhook (raw body — mounted separately in index.ts) ───────────────
webhookRouter.post("/", controller.handleStripeWebhook);

export { router as orderRoutes, webhookRouter };
