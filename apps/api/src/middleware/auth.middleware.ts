import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@lookme/config";
import type { JWTPayload, Role } from "@lookme/types";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { status: 401, code: "AUTH_NO_TOKEN", message: "Authentication required" },
    });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { status: 401, code: "AUTH_INVALID_TOKEN", message: "Invalid or expired token" },
    });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { status: 401, code: "AUTH_NO_USER", message: "Authentication required" },
      });
    }
    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({
        success: false,
        error: { status: 403, code: "AUTH_FORBIDDEN", message: "Insufficient permissions" },
      });
    }
    next();
  };
}
