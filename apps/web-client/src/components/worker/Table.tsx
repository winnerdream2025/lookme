import { ReactNode } from 'react';
import { cn } from '@/styles/worker-design-system';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyState?: ReactNode;
  stickyHeader?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  stickyHeader = false,
}: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div>{emptyState}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead
          className={cn(
            'bg-neutral-50/80 border-y border-neutral-200/80',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3.5 text-left text-[11px] font-bold text-neutral-600 uppercase tracking-wider',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-100/80">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                'group transition-colors duration-100',
                onRowClick
                  ? 'cursor-pointer hover:bg-gradient-to-r hover:from-neutral-50/50 hover:to-transparent'
                  : 'hover:bg-neutral-50/30'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-4 text-sm text-neutral-700',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.render
                    ? column.render(item)
                    : String((item as any)[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Specialized cell components for common patterns
export function MoneyCell({ amount, positive }: { amount: number; positive?: boolean }) {
  return (
    <span
      className={cn(
        'font-semibold tabular-nums',
        positive === true && 'text-success-600',
        positive === false && 'text-error-600',
        positive === undefined && 'text-neutral-900'
      )}
    >
      {positive === false && '-'}${Math.abs(amount).toFixed(2)}
    </span>
  );
}

export function StatusCell({
  status,
  variant = 'default',
}: {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}) {
  const variantStyles = {
    default: 'bg-neutral-100/80 text-neutral-700 border-neutral-200/50',
    success: 'bg-success-50/80 text-success-700 border-success-200/50',
    warning: 'bg-warning-50/80 text-warning-700 border-warning-200/50',
    error: 'bg-error-50/80 text-error-700 border-error-200/50',
    info: 'bg-info-50/80 text-info-700 border-info-200/50',
  };

  const dotColors = {
    default: 'bg-neutral-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border',
        variantStyles[variant]
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      {status}
    </span>
  );
}

export function DateCell({ date }: { date: string | Date }) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-neutral-900">
        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
      <span className="text-xs text-neutral-500">
        {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
