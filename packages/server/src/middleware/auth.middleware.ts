import { Request, Response, NextFunction } from "express";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req.headers["x-user-role"] as string) || "";
    if (!roles.includes(role)) {
      res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Insufficient permissions", status: 403 },
      });
      return;
    }
    next();
  };
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = (req.headers["x-user-role"] as string) || "";
  if (role !== "admin") {
    res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN", message: "Admin role required", status: 403 },
    });
    return;
  }
  next();
};
