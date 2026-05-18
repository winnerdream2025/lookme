import { Request, Response, NextFunction } from "express";
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map