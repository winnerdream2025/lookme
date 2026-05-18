/**
 * Shared visual constants used across multiple pages.
 * Centralising these prevents copy-paste drift and keeps styling consistent.
 */

export const STATUS_STYLES: Record<string, { pill: string; label: string }> = {
  PENDING_PAYMENT:      { pill: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Pending Payment" },
  PENDING:              { pill: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Pending" },
  PROCESSING:           { pill: "bg-blue-50 text-blue-700 border-blue-200",     label: "Processing" },
  IN_PROGRESS:          { pill: "bg-blue-50 text-blue-700 border-blue-200",     label: "In Progress" },
  COMPLETED:            { pill: "bg-green-50 text-green-700 border-green-200",  label: "Completed" },
  CANCELLED:            { pill: "bg-neutral-100 text-neutral-500 border-neutral-200", label: "Cancelled" },
  REFUNDED:             { pill: "bg-neutral-100 text-neutral-500 border-neutral-200", label: "Refunded" },
  PARTIALLY_COMPLETED:  { pill: "bg-blue-50 text-blue-700 border-blue-200",     label: "Partially Completed" },
};

export const DASHBOARD_STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PENDING:         "bg-yellow-50 text-yellow-700 border-yellow-200",
  PROCESSING:      "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS:     "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED:       "bg-green-50 text-green-700 border-green-200",
  CANCELLED:       "bg-neutral-100 text-neutral-500 border-neutral-200",
  REFUNDED:        "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export const TIMELINE_STEPS = [
  { key: "placed",      label: "Order Placed",       sub: "Payment confirmed" },
  { key: "in_progress", label: "In Progress",        sub: "Workers completing tasks" },
  { key: "completed",   label: "Delivered",          sub: "All tasks verified" },
] as const;

export function stepDone(status: string, key: string): boolean {
  if (key === "placed") return true;
  if (key === "in_progress") return ["PROCESSING", "IN_PROGRESS", "COMPLETED", "PARTIALLY_COMPLETED"].includes(status);
  if (key === "completed") return status === "COMPLETED";
  return false;
}
