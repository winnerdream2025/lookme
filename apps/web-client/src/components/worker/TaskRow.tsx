import Link from 'next/link';
import { cn } from '@/styles/worker-design-system';

interface TaskRowProps {
  id: string;
  title: string;
  category: string;
  platform: string;
  reward: number;
  status?: 'available' | 'active' | 'submitted' | 'completed' | 'rejected';
  timeRemaining?: string;
  isReview?: boolean;
  targetUrl?: string;
  onClick?: () => void;
  showActions?: boolean;
}

export function TaskRow({
  id,
  title,
  category,
  platform,
  reward,
  status = 'available',
  timeRemaining,
  isReview,
  targetUrl,
  onClick,
  showActions = true,
}: TaskRowProps) {
  const statusConfig = {
    available: { 
      label: 'Available', 
      color: 'bg-info-50/80 text-info-700 border border-info-200/50',
      dot: 'bg-info-500'
    },
    active: { 
      label: 'Active', 
      color: 'bg-warning-50/80 text-warning-700 border border-warning-200/50',
      dot: 'bg-warning-500'
    },
    submitted: { 
      label: 'Submitted', 
      color: 'bg-neutral-100/80 text-neutral-700 border border-neutral-200/50',
      dot: 'bg-neutral-500'
    },
    completed: { 
      label: 'Completed', 
      color: 'bg-success-50/80 text-success-700 border border-success-200/50',
      dot: 'bg-success-500'
    },
    rejected: { 
      label: 'Rejected', 
      color: 'bg-error-50/80 text-error-700 border border-error-200/50',
      dot: 'bg-error-500'
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'group relative flex items-center gap-5 px-5 py-4 border-b border-neutral-100/80 last:border-b-0',
        'hover:bg-gradient-to-r hover:from-neutral-50/50 hover:to-transparent transition-all duration-150',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Left accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-r" />
      
      {/* Left: Task Info */}
      <div className="flex-1 min-w-0 pl-1">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold',
            'bg-neutral-100/80 text-neutral-700 border border-neutral-200/50'
          )}>
            {category}
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-xs text-neutral-600 font-medium">{platform}</span>
          {isReview && (
            <>
              <span className="text-neutral-300">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50/80 text-amber-700 border border-amber-200/50">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Review
              </span>
            </>
          )}
          {status !== 'available' && (
            <>
              <span className="text-neutral-300">•</span>
              <span className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold',
                config.color
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                {config.label}
              </span>
            </>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-neutral-900 mb-1 truncate group-hover:text-primary-900 transition-colors">
          {title}
        </h3>
        
        {/* URL */}
        {targetUrl && (
          <p className="text-xs text-neutral-500 truncate font-mono">{targetUrl}</p>
        )}
        
        {/* Time warning */}
        {timeRemaining && status === 'active' && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-error-50 border border-error-200 rounded-lg text-xs font-semibold text-error-700">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timeRemaining} remaining</span>
          </div>
        )}
      </div>

      {/* Right: Reward & Action */}
      <div className="flex items-center gap-5">
        {/* Reward */}
        <div className="text-right">
          <div className="text-xl font-bold text-success-600 tabular-nums leading-none mb-1">
            ${reward.toFixed(2)}
          </div>
          <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wide">Reward</div>
        </div>
        
        {/* Action Button */}
        {showActions && (
          <Link
            href={`/my-tasks/${id}`}
            className={cn(
              'relative px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              status === 'available'
                ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow focus:ring-primary-500'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 focus:ring-neutral-500'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {status === 'available' ? 'Accept Task' : status === 'active' ? 'Continue' : 'View Details'}
          </Link>
        )}
      </div>
    </div>
  );
}
