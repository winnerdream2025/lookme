import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function requestId() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const id =
      (req.headers["x-request-id"] as string) || randomUUID();
    (req as unknown as Record<string, unknown>).id = id;
    next();
  };
}
