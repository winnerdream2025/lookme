"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "svcPrimary"
    | "svcSecondary"
    | "chip";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  arrowRight?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", arrowRight, ...props }, ref) => {
    const isDisabled = disabled || loading;

    // Base — always applied
    const base =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 ease-out rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    // Variants
    const variants = {
      primary:
        "bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm",
      secondary:
        "bg-white text-[#0A0A0A] border border-[#E5E7EB] hover:bg-[#F9FAFB]",
      ghost:
        "bg-transparent text-[#0A0A0A] hover:bg-[#F9FAFB]",
      danger:
        "bg-[#DC2626] text-white hover:bg-[#B91C1C]",

      // Services pages — neutral capsule style
      svcPrimary:
        "bg-[#0A0A0A] text-white hover:bg-black rounded-full focus-visible:ring-[#0A0A0A]",
      svcSecondary:
        "bg-white text-[#0A0A0A] border border-[#E5E7EB] hover:bg-[#F5F5F5] rounded-full focus-visible:ring-[#0A0A0A]",
      chip:
        "bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] hover:bg-[#E5E7EB] rounded-full",
    } as const;

    // Sizes — intentional, not arbitrary scale
    const sizes = {
      sm: "h-9 px-4 text-sm gap-1.5",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-12 px-8 text-[15px] gap-2",
    };

    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    const arrowDiscClass =
      variant === "svcSecondary"
        ? "ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A0A0A] text-white"
        : "ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#0A0A0A]";

    return (
      <button ref={ref} disabled={isDisabled} className={classes} {...props}>
        {loading && (
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
        {arrowRight && (
          <span aria-hidden className={arrowDiscClass}>→</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
