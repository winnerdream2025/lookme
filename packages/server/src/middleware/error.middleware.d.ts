import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    status: number;
    code: string;
    details?: unknown;
    constructor(status: number, code: string, message: string, details?: unknown);
    static badRequest(code: string, message: string, details?: unknown): AppError;
    static unauthorized(message?: string): AppError;
    static forbidden(message?: string): AppError;
    static notFound(code: string, message: string): AppError;
    static conflict(code: string, message: string): AppError;
}
export declare function errorHandler(serviceName: string): (err: Error, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=error.middleware.d.ts.map