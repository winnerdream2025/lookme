import { ReactNode } from 'react';
import { cn } from '@/styles/worker-design-system';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'minimal';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      variant === 'default' ? 'py-16 px-6' : 'py-12 px-4'
    )}>
      {icon && (
        <div className="mb-4 text-neutral-300">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-neutral-900 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
