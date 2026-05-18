import { Request, Response, NextFunction } from "express";
import { createLogger } from "@lookme/logger";

export function requestLogger(serviceName: string) {
  const logger = createLogger(serviceName);

  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 400 ? "warn" : "info";
      logger[level]({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        requestId: (req as unknown as Record<string, unknown>).id,
      });
    });

    next();
  };
}
