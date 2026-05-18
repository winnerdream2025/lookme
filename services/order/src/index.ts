import express from "express";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { errorHandler, requestId, requestLogger } from "@lookme/server";
import { orderRoutes, webhookRouter } from "./routes/order.routes";

const logger = createLogger("order-service");
const app = express();

app.use(requestId());
app.use(requestLogger("order-service"));

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { service: "order-service", status: "healthy", timestamp: new Date().toISOString() } });
});

// ─── Stripe webhook — express.raw() MUST come BEFORE express.json() ──────────
// Stripe signature verification requires the raw Buffer body.
app.use("/stripe-webhook", express.raw({ type: "application/json" }), webhookRouter);

// ─── All other routes — standard JSON body ────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use("/", orderRoutes);

app.use(errorHandler("order-service"));

const port = config.ports.order;
app.listen(port, () => {
  logger.info(`Order service running on port ${port}`);
});
