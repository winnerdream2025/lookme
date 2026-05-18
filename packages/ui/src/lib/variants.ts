import { cva, type VariantProps } from "class-variance-authority";

/**
 * Design System Variants
 * Linear-inspired: sharp, precise, minimal
 */

// ─── Button Variants ───
export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-500",
        ghost: "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline: "border border-neutral-300 bg-transparent hover:bg-neutral-50 text-neutral-700",
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// ─── Badge Variants ───
export const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
        info: "bg-blue-50 text-blue-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded",
        md: "px-2.5 py-1 text-sm rounded-md",
        lg: "px-3 py-1.5 text-sm rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ─── Input Variants ───
export const inputVariants = cva(
  "w-full bg-white border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900/10",
        error: "border-red-500 focus:border-red-600 focus:ring-red-600/10",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-4 text-base rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
