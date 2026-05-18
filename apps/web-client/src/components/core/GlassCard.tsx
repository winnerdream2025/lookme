import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glassCardVariants = cva(
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'glass-card',
        dark: 'glass-card-dark',
        light: 'glass-card-light',
        solid: 'bg-white border border-slate-200 shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        none: '',
        lift: 'hover:scale-[1.02] hover:shadow-2xl',
        glow: 'hover:shadow-glow',
        border: 'hover:border-primary-500/50',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'none',
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article';
}

export function GlassCard({
  children,
  variant,
  padding,
  hover,
  className,
  as: Component = 'div',
  ...props
}: GlassCardProps) {
  return (
    <Component
      className={cn(glassCardVariants({ variant, padding, hover }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// Specialized variants for common use cases
export function ServiceCard({ children, className, ...props }: Omit<GlassCardProps, 'variant'>) {
  return (
    <GlassCard
      variant="light"
      hover="lift"
      className={cn('group cursor-pointer', className)}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

export function DashboardCard({ children, className, ...props }: Omit<GlassCardProps, 'variant'>) {
  return (
    <GlassCard
      variant="solid"
      hover="border"
      className={className}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

export function FeatureCard({ children, className, ...props }: Omit<GlassCardProps, 'variant'>) {
  return (
    <GlassCard
      variant="dark"
      hover="glow"
      className={className}
      {...props}
    >
      {children}
    </GlassCard>
  );
}
