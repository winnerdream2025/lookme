import { Request, Response, NextFunction } from "express";
import { createLogger } from "@lookme/logger";

export class AppError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(code: string, message: string, details?: unknown) {
    return new AppError(400, code, message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(403, "FORBIDDEN", message);
  }

  static notFound(code: string, message: string) {
    return new AppError(404, code, message);
  }

  static conflict(code: string, message: string) {
    return new AppError(409, code, message);
  }
}

export function errorHandler(serviceName: string) {
  const logger = createLogger(serviceName);

  return (err: Error, req: Request, res: Response, _next: NextFunction) => {
    const requestId = (req as unknown as Record<string, unknown>).id as string | undefined;

    if (err instanceof AppError) {
      logger.warn({ status: err.status, code: err.code, message: err.message, requestId });
      return res.status(err.status).json({
        success: false,
        error: {
          status: err.status,
          code: err.code,
          message: err.message,
          details: err.details,
          requestId,
        },
      });
    }

    // Handle errors with status property (e.g., from wallet service)
    const errWithStatus = err as Error & { status?: number; code?: string };
    if (errWithStatus.status && errWithStatus.status < 500) {
      logger.warn({ status: errWithStatus.status, code: errWithStatus.code, message: err.message, requestId });
      return res.status(errWithStatus.status).json({
        success: false,
        error: {
          status: errWithStatus.status,
          code: errWithStatus.code || "ERROR",
          message: err.message,
          requestId,
        },
      });
    }

    logger.error({ message: err.message, stack: err.stack, requestId });
    res.status(500).json({
      success: false,
      error: {
        status: 500,
        code: "SYSTEM_INTERNAL_ERROR",
        message: "Internal server error",
        requestId,
      },
    });
  };
}
