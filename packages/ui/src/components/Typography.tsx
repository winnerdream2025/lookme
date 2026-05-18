import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Typography System - Sharp, precise, minimal
 * Inspired by Linear's typography hierarchy
 */

// ─── Display (Hero sections) ───

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function Display({ className, children, ...props }: DisplayProps) {
  return (
    <h1
      className={cn(
        "text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

// ─── Title (Page headers) ───

export function Title({ className, children, ...props }: DisplayProps) {
  return (
    <h2
      className={cn(
        "text-4xl font-semibold tracking-tight text-neutral-900 leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

// ─── Heading (Section headers) ───

export function Heading({ className, children, ...props }: DisplayProps) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold text-neutral-900 leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// ─── Subheading ───

export function Subheading({ className, children, ...props }: DisplayProps) {
  return (
    <h4
      className={cn(
        "text-lg font-medium text-neutral-700 leading-normal",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

// ─── Body Text ───

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  muted?: boolean;
}

export function Body({ className, children, size = "md", muted, ...props }: BodyProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <p
      className={cn(
        "leading-relaxed",
        sizeClasses[size],
        muted ? "text-neutral-600" : "text-neutral-700",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Caption (Small text, labels) ───

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  muted?: boolean;
}

export function Caption({ className, children, muted, ...props }: CaptionProps) {
  return (
    <span
      className={cn(
        "text-sm font-medium",
        muted ? "text-neutral-500" : "text-neutral-600",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── Label (Form labels, metadata) ───

export function Label({ className, children, ...props }: CaptionProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-neutral-700 block mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

// ─── Code (Inline code, monospace) ───

export function Code({ className, children, ...props }: CaptionProps) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-900 font-mono text-sm",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
