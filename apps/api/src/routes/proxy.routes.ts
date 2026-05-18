import { Router, Request, Response, NextFunction, type Router as ExpressRouter } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { ClientRequest } from "http";
import { config } from "@lookme/config";
import type { JWTPayload } from "@lookme/types";

const router: ExpressRouter = Router();

// Each entry: [routePrefix, serviceHost, servicePort]
// HOST is read from env so Docker containers can be reached by name (e.g. "auth-service")
const serviceMap: [string, string, number][] = [
  ["auth",    config.serviceHosts.auth,    config.ports.auth],
  ["catalog", config.serviceHosts.catalog, config.ports.catalog],
  ["orders",  config.serviceHosts.order,   config.ports.order],
  ["tasks",   config.serviceHosts.task,    config.ports.task],
  ["wallet",  config.serviceHosts.wallet,  config.ports.wallet],
];

for (const [path, host, port] of serviceMap) {
  // Middleware to strip the service prefix from req.url before proxying
  // Express router.use already strips it for req.url, but http-proxy-middleware
  // reconstructs the path from req.originalUrl. We fix it here.
  const stripPrefix = (req: Request, _res: Response, next: NextFunction) => {
    req.originalUrl = req.originalUrl.replace(`/api/v1/${path}`, "") || "/";
    next();
  };

  router.use(
    `/${path}`,
    stripPrefix,
    createProxyMiddleware({
      target: `http://${host}:${port}`,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq: ClientRequest, req: Request) => {
          // Inject user context
          const user = (req as Request & { user?: JWTPayload }).user;
          if (user) {
            proxyReq.setHeader("x-user-id", user.sub);
            proxyReq.setHeader("x-user-role", user.role);
            proxyReq.setHeader("x-user-email", user.email);
          }
          // Re-stream body consumed by body parsers
          const body = (req as Request & { body?: unknown }).body;
          if (Buffer.isBuffer(body)) {
            // Raw body (e.g. Stripe webhook) — forward original bytes as-is so
            // the downstream service can verify the Stripe signature.
            proxyReq.setHeader("Content-Length", body.length);
            proxyReq.write(body);
          } else if (body && typeof body === "object" && Object.keys(body).length > 0) {
            const bodyStr = JSON.stringify(body);
            proxyReq.setHeader("Content-Type", "application/json");
            proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyStr));
            proxyReq.write(bodyStr);
          }
        },
      },
    })
  );
}

export { router as proxyRouter };
