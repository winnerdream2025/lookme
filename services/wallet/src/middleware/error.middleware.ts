import { Request, Response, NextFunction } from "express";
import { createLogger } from "@lookme/logger";

const logger = createLogger("wallet-service");

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ message: err.message, stack: err.stack });

  const status = (err as { status?: number }).status ?? 500;
  const code = (err as { code?: string }).code ?? "WALLET_ERROR";

  res.status(status).json({
    success: false,
    error: {
      status,
      code,
      message: status === 500 ? "Internal server error" : err.message,
    },
  });
}
