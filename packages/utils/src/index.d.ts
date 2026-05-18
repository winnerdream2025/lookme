export declare function success<T>(data: T, meta?: Record<string, unknown>): {
    success: true;
    data: T;
    meta: Record<string, unknown> | undefined;
};
export declare function error(status: number, code: string, message: string, details?: unknown): {
    success: false;
    error: {
        status: number;
        code: string;
        message: string;
        details: unknown;
    };
};
export declare function paginate(page: number, limit: number): {
    skip: number;
    take: number;
};
export declare function paginationMeta(total: number, page: number, limit: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export declare function asyncHandler(fn: (...args: unknown[]) => Promise<unknown>): (...args: unknown[]) => Promise<unknown>;
export declare function addMinutes(date: Date, minutes: number): Date;
export declare function addHours(date: Date, hours: number): Date;
export declare function isExpired(date: Date): boolean;
export declare function slugify(text: string): string;
export declare function clamp(value: number, min: number, max: number): number;
export declare function toDecimal(value: number, decimals?: number): number;
//# sourceMappingURL=index.d.ts.map