import { Request, Response, NextFunction } from "express";
import { createLogger } from "@lookme/logger";

const logger = createLogger("api-gateway");

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      requestId: req.requestId,
      userId: req.user?.sub,
    });
  });
  next();
}
