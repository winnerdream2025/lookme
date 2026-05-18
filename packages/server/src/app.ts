import express, { Router, type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "@lookme/config";
import { requestId } from "./middleware/request-id.middleware";
import { requestLogger } from "./middleware/request-logger.middleware";
import { errorHandler } from "./middleware/error.middleware";

interface CreateAppOptions {
  serviceName: string;
  routes: { path: string; router: Router }[];
}

export function createApp(options: CreateAppOptions): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.origins,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(requestId());
  app.use(requestLogger(options.serviceName));

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      data: { service: options.serviceName, status: "healthy", timestamp: new Date().toISOString() },
    });
  });

  for (const route of options.routes) {
    app.use(route.path, route.router);
  }

  app.use(errorHandler(options.serviceName));

  return app;
}
