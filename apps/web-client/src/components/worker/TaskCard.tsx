import Link from 'next/link';

interface TaskCardProps {
  id: string;
  title: string;
  category: string;
  platform: string;
  reward: number;
  status?: 'available' | 'active' | 'submitted' | 'completed' | 'rejected';
  timeRemaining?: string;
  isReview?: boolean;
  targetUrl?: string;
  instructions?: string;
  submittedAt?: string;
  assignedAt?: string;
}

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    dot: 'bg-blue-500',
    accent: 'border-t-blue-500',
  },
  active: {
    label: 'Active',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500',
    accent: 'border-t-amber-500',
  },
  submitted: {
    label: 'Submitted',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    accent: 'border-t-slate-400',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-500',
    accent: 'border-t-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-red-50 text-red-700 border-red-100',
    dot: 'bg-red-500',
    accent: 'border-t-red-500',
  },
} as const;

export function TaskCard({
  id,
  title,
  category,
  platform,
  reward,
  status = 'available',
  timeRemaining,
  isReview,
  targetUrl,
  instructions,
  submittedAt,
  assignedAt,
}: TaskCardProps) {
  const config = STATUS_CONFIG[status];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className={`group flex flex-col bg-white border-t-2 border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${config.accent}`}>
      <div className="flex flex-col flex-1 p-5">

        {/* Header: status badge + reward */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F6F5F3] text-[#374151] border border-[#E5E7EB]">
              {category}
            </span>
            {isReview && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Review
              </span>
            )}
          </div>
          <div className="text-right shrink-0 min-w-0">
            <p className="text-xl font-bold text-emerald-600 tabular-nums leading-none whitespace-nowrap">${reward.toFixed(2)}</p>
            <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide mt-0.5">reward</p>
          </div>
        </div>

        {/* Title & Platform */}
        <div className="mb-4">
          <p className="text-[15px] font-bold text-[#111827] mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {title}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <svg className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="font-medium">{platform}</span>
          </div>
        </div>

        {/* Target URL */}
        {targetUrl && (
          <div className="mb-3 p-2.5 bg-[#F6F5F3] border border-[#E5E7EB] rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-xs text-[#374151] font-mono break-all">{targetUrl}</span>
            </div>
          </div>
        )}

        {/* Instructions Preview */}
        {instructions && (
          <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{instructions}</p>
        )}

        {/* Time Warning */}
        {timeRemaining && status === 'active' && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-red-700">{timeRemaining} remaining</span>
          </div>
        )}

        {/* Footer: meta + action button */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F3F4F6] mt-auto">
          <p className="text-xs text-[#9CA3AF] truncate min-w-0">
            {assignedAt && status === 'active' && `Started ${formatDate(assignedAt)}`}
            {submittedAt && status === 'submitted' && `Submitted ${formatDate(submittedAt)}`}
          </p>

          <Link
            href={`/my-tasks/${id}`}
            className={`inline-flex items-center gap-1.5 h-9 px-3 text-sm font-semibold rounded-xl transition-all duration-150 shrink-0 ${
              status === 'available'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : status === 'active'
                ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                : 'bg-[#F6F5F3] border border-[#E5E7EB] text-[#374151] hover:bg-[#EDECE9]'
            }`}
          >
            {status === 'available' ? (
              <>Accept <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
            ) : status === 'active' ? (
              <>Continue <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
            ) : (
              <>View <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
            )}
          </Link>
        </div>

      </div>
    </div>
  );
}
