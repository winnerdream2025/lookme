import * as React from "react";
import { badgeVariants, type BadgeVariants } from "../lib/variants";
import { cn } from "../lib/cn";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
