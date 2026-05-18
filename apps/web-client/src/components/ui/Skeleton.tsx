"use client";

import { type HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "block" | "text" | "circle";
  width?: string;
  height?: string;
}

export function Skeleton({
  variant = "block",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const base = "animate-pulse bg-[#F3F4F6] rounded-lg";

  const defaults = {
    block: "w-full h-32",
    text: "w-3/4 h-4",
    circle: "w-10 h-10 rounded-full",
  };

  const classes = `${base} ${defaults[variant]} ${className}`;

  return (
    <div
      className={classes}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

// Pre-built patterns — common layouts, not a design system
export function SkeletonCard() {
  return (
    <div className="p-6 border border-[#E5E7EB] rounded-2xl space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border border-[#E5E7EB] rounded-xl space-y-3">
          <Skeleton variant="text" width="50%" height="36px" />
          <Skeleton variant="text" width="70%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-xl">
          <Skeleton variant="circle" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="25%" />
          </div>
          <Skeleton variant="text" width="80px" />
        </div>
      ))}
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton variant="text" width="240px" height="32px" />
        <Skeleton variant="text" width="400px" />
      </div>
      <SkeletonStats />
      <div className="space-y-4">
        <Skeleton variant="text" width="120px" height="24px" />
        <SkeletonList count={4} />
      </div>
    </div>
  );
}
