import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { authMiddleware } from "./middleware/auth.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { proxyRouter } from "./routes/proxy.routes";
import { healthRouter } from "./routes/health.routes";
import { sendEmail, contactNotificationEmail } from "@lookme/email";

const app = express();
const logger = createLogger("api-gateway");

// ─── Global Middleware ───
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);
      // In dev, allow any localhost or 127.0.0.1 origin regardless of port
      if (config.isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, origin);
      }
      // In prod (or dev for non-local), check the explicit allow-list
      if (config.cors.origins.includes(origin)) {
        return callback(null, origin);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
// Global rate limit — all routes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: "RATE_LIMIT", message: "Too many requests" } },
  })
);

// Strict auth rate limit — brute-force protection on credential endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,                  // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: "AUTH_RATE_LIMIT", message: "Too many attempts. Try again in 15 minutes." } },
});
app.use("/api/v1/auth/login", authRateLimit);
app.use("/api/v1/auth/register", authRateLimit);
app.use("/api/v1/auth/forgot-password", authRateLimit);

// ─── Stripe webhook — raw Buffer BEFORE express.json() ───────────────────────
// This preserves the original bytes Stripe signed; the proxy forwards them as-is.
app.use("/api/v1/orders/stripe-webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

// ─── Public Routes ───
app.use("/health", healthRouter);

// ─── Auth Middleware (skip public paths) ───
const publicPaths = [
  "/health",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/orders/guest",
  "/api/v1/orders/track",
  "/api/v1/orders/stripe-webhook",
  "/api/v1/catalog/platforms",
  "/api/v1/catalog/categories",
  "/api/v1/catalog/services",
];
app.use((req, res, next) => {
  if (publicPaths.some((p) => req.path.startsWith(p))) {
    return next();
  }
  // Allow guests to create payment intents for their orders (no login required)
  if (/^\/api\/v1\/orders\/[^/]+\/payment-intent$/.test(req.path)) {
    return next();
  }
  return authMiddleware(req, res, next);
});

// ─── Contact Route (authenticated — handled in gateway, user context injected above) ───
app.post("/api/v1/contact", async (req, res) => {
  const { message, orderId } = req.body as { message?: string; orderId?: string };
  if (!message?.trim()) {
    res.status(400).json({ success: false, error: { code: "MISSING_MESSAGE", message: "message is required" } });
    return;
  }
  const userId = req.headers["x-user-id"] as string | undefined;
  const userEmail = req.headers["x-user-email"] as string | undefined;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@lookme.io";
  const tpl = contactNotificationEmail({
    fromEmail: userEmail || "unknown",
    orderId,
    message: message.trim(),
    adminEmail,
  });
  sendEmail({ to: adminEmail, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(() => {});
  logger.info({ userId, userEmail, orderId }, "Contact form submitted");
  res.json({ success: true, data: { message: "Message received. We'll get back to you soon." } });
});

// ─── Service Proxy Routes ───
app.use("/api/v1", proxyRouter);

// ─── Error Handler ───
app.use(errorHandler);

// ─── Start ───
const port = config.ports.gateway;
app.listen(port, () => {
  logger.info(`API Gateway running on port ${port}`);
});

export default app;
