export { publishEvent } from './redis-publisher';

// ─── API Response Helpers ───

export function success<T>(data: T, meta?: Record<string, unknown>) {
  return { success: true as const, data, meta };
}

export function error(status: number, code: string, message: string, details?: unknown) {
  return {
    success: false as const,
    error: { status, code, message, details },
  };
}

// ─── Pagination ───

export function paginate(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Async Error Wrapper ───

export function asyncHandler(fn: (...args: unknown[]) => Promise<unknown>) {
  return (...args: unknown[]) => {
    const next = args[2] as (err: unknown) => void;
    return Promise.resolve(fn(...args)).catch(next);
  };
}

// ─── Date Helpers ───

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3600 * 1000);
}

export function isExpired(date: Date): boolean {
  return new Date() > date;
}

// ─── String Helpers ───

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Number Helpers ───

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function toDecimal(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}
