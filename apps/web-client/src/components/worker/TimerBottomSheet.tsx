'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface TimerBottomSheetProps {
  isOpen: boolean;
  durationSeconds: number;
  taskTitle: string;
  platform: string;
  onComplete: () => void;
  onClose: () => void;
}

export function TimerBottomSheet({
  isOpen,
  durationSeconds,
  taskTitle,
  platform,
  onComplete,
  onClose,
}: TimerBottomSheetProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearTimer();
      setRemaining(durationSeconds);
      return;
    }

    setRemaining(durationSeconds);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isOpen, durationSeconds, clearTimer]);

  const isComplete = remaining === 0;
  const progress = durationSeconds > 0 ? ((durationSeconds - remaining) / durationSeconds) * 100 : 0;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  /* Circumference for the SVG ring (r=54) */
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-lg">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-[#D1D5DB]" />
          </div>

          {/* Glass panel */}
          <div className="rounded-t-3xl border border-[#E5E7EB] border-b-0 bg-white px-6 pb-8 pt-4 shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                  {platform}
                </p>
                <h3 className="text-base font-bold text-[#111827] truncate">
                  {taskTitle}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F6F5F3] border border-[#E5E7EB] text-[#6B7280] hover:text-[#374151] hover:bg-[#EDECE9] transition-colors shrink-0 ml-4"
                aria-label="Close timer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Timer ring */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Background ring */}
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                  {/* Progress ring */}
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke={isComplete ? '#22c55e' : '#3b82f6'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isComplete ? (
                    <svg className="w-10 h-10 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-[#111827] tabular-nums leading-none">
                        {timeStr}
                      </span>
                      <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mt-1">
                        remaining
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status text */}
              <p className={`text-sm font-semibold ${isComplete ? 'text-emerald-600' : 'text-[#6B7280]'}`}>
                {isComplete ? 'Timer complete — ready to submit' : 'Complete the task while the timer counts down'}
              </p>
            </div>

            {/* Linear progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] mb-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  isComplete ? 'bg-success-500' : 'bg-primary-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl border border-[#E5E7EB] bg-[#F6F5F3] text-base font-semibold text-[#374151] hover:bg-[#EDECE9] transition-colors"
              >
                Minimize
              </button>
              <button
                onClick={onComplete}
                disabled={!isComplete}
                className={`flex-[2] h-12 rounded-xl text-base font-semibold transition-all active:scale-[0.98] ${
                  isComplete
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                    : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                {isComplete ? 'Submit Proof' : `Wait ${timeStr}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
