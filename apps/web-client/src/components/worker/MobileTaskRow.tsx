'use client';

import Link from 'next/link';

interface MobileTaskRowProps {
  id: string;
  title: string;
  category: string;
  platform: string;
  reward: number;
  status?: 'available' | 'active' | 'submitted' | 'completed' | 'rejected';
  isReview?: boolean;
  onStartTimer?: (id: string) => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z',
  TikTok: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z',
  YouTube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z',
  Facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  Spotify: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0z',
};

const STATUS_CONFIG = {
  available:  { color: 'bg-blue-500',    label: '' },
  active:     { color: 'bg-amber-500',   label: 'Active' },
  submitted:  { color: 'bg-slate-400',   label: 'Submitted' },
  completed:  { color: 'bg-emerald-500', label: 'Done' },
  rejected:   { color: 'bg-red-500',     label: 'Rejected' },
} as const;

export function MobileTaskRow({
  id,
  title,
  platform,
  reward,
  status = 'available',
  isReview,
  onStartTimer,
}: MobileTaskRowProps) {
  const config = STATUS_CONFIG[status];
  const iconPath = PLATFORM_ICONS[platform] || PLATFORM_ICONS.Instagram;

  const handleAction = (e: React.MouseEvent) => {
    if (status === 'available' && onStartTimer) {
      e.preventDefault();
      onStartTimer(id);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFB] transition-colors active:bg-[#F3F4F6] overflow-hidden">
      {/* Left: Platform icon with status dot */}
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-xl bg-[#F6F5F3] border border-[#E5E7EB] flex items-center justify-center">
          <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="currentColor">
            <path d={iconPath} />
          </svg>
        </div>
        {status !== 'available' && (
          <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${config.color} border-2 border-white`} />
        )}
        {isReview && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        )}
      </div>

      {/* Middle: Task info + payout */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <h4 className="text-sm font-semibold text-[#111827] truncate leading-snug">
          {title}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5 overflow-hidden">
          <span className="text-xs text-[#6B7280] font-medium truncate max-w-[80px]">{platform}</span>
          {config.label && (
            <>
              <span className="text-[#D1D5DB] shrink-0">·</span>
              <span className="text-xs font-semibold text-[#6B7280] shrink-0">{config.label}</span>
            </>
          )}
          <span className="text-[#D1D5DB] shrink-0">·</span>
          <span className="text-sm font-bold text-emerald-600 tabular-nums shrink-0 whitespace-nowrap">${reward.toFixed(2)}</span>
        </div>
      </div>

      {/* Right: Action button */}
      {status === 'available' ? (
        <Link
          href={`/my-tasks/${id}`}
          onClick={handleAction}
          className="shrink-0 h-10 px-4 flex items-center gap-1.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.96] transition-all shadow-sm"
        >
          Start
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      ) : status === 'active' ? (
        <Link
          href={`/my-tasks/${id}`}
          className="shrink-0 h-10 px-4 flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-100 active:scale-[0.96] transition-all"
        >
          Continue
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <Link
          href={`/my-tasks/${id}`}
          className="shrink-0 h-10 px-4 flex items-center rounded-xl bg-[#F6F5F3] border border-[#E5E7EB] text-[#374151] text-sm font-semibold hover:bg-[#EDECE9] active:scale-[0.96] transition-all"
        >
          View
        </Link>
      )}
    </div>
  );
}
