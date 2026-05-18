import { ReactNode } from 'react';
import { cn } from '@/styles/worker-design-system';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  size = 'md',
}: StatCardProps) {
  const variantStyles = {
    default: {
      container: 'bg-white border-neutral-200/80 shadow-sm hover:shadow-md',
      icon: 'bg-neutral-50 text-neutral-600',
      value: 'text-neutral-900',
      label: 'text-neutral-500',
    },
    primary: {
      container: 'bg-gradient-to-br from-white to-primary-50/30 border-primary-200/60 shadow-sm hover:shadow-md hover:border-primary-300/60',
      icon: 'bg-primary-100 text-primary-600',
      value: 'text-primary-900',
      label: 'text-primary-600',
    },
    success: {
      container: 'bg-gradient-to-br from-white to-success-50/30 border-success-200/60 shadow-sm hover:shadow-md hover:border-success-300/60',
      icon: 'bg-success-100 text-success-600',
      value: 'text-success-900',
      label: 'text-success-600',
    },
    warning: {
      container: 'bg-gradient-to-br from-white to-warning-50/30 border-warning-200/60 shadow-sm hover:shadow-md hover:border-warning-300/60',
      icon: 'bg-warning-100 text-warning-600',
      value: 'text-warning-900',
      label: 'text-warning-600',
    },
  };

  const sizeStyles = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const valueSize = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(
      'relative border rounded-xl transition-all duration-200 group',
      styles.container,
      sizeStyles[size]
    )}>
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            {icon && (
              <div className={cn(
                'p-1.5 rounded-lg transition-colors',
                styles.icon
              )}>
                {icon}
              </div>
            )}
            <p className={cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              styles.label
            )}>
              {label}
            </p>
          </div>
          <div className={cn(
            'font-semibold tabular-nums leading-none mb-2',
            valueSize[size],
            styles.value
          )}>
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 font-medium">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold',
            trend.isPositive
              ? 'bg-success-100/80 text-success-700'
              : 'bg-error-100/80 text-error-700'
          )}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d={trend.isPositive ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
              />
            </svg>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
