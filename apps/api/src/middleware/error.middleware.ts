import { Request, Response, NextFunction } from "express";
import { createLogger } from "@lookme/logger";

const logger = createLogger("api-gateway");

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.requestId,
    url: req.originalUrl,
  });

  const status = (err as { status?: number }).status ?? 500;
  const code = (err as { code?: string }).code ?? "SYSTEM_ERROR";

  res.status(status).json({
    success: false,
    error: {
      status,
      code,
      message: status === 500 ? "Internal server error" : err.message,
      requestId: req.requestId,
    },
  });
}
