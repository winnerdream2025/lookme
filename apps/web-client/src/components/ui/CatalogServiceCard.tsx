'use client';

import Link from 'next/link';
import { BrandIcon } from './BrandIcon';

interface CatalogServiceCardProps {
  slug: string;
  platform: string;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  popularPrice?: number;
  popularQty?: number;
  deliveryTime: string;
  badge?: string;
}

export function CatalogServiceCard({
  slug,
  platform,
  name,
  description,
  startingPrice,
  popularPrice,
  popularQty,
  deliveryTime,
  badge,
}: CatalogServiceCardProps) {
  const showPopular = popularPrice != null && popularQty != null;

  return (
    <Link
      href={`/services/${slug}`}
      className="group relative block rounded-2xl overflow-hidden transition-all duration-200
                 border border-slate-200 hover:border-blue-300
                 bg-white shadow-sm hover:shadow-md
                 hover:-translate-y-0.5 will-change-transform"
    >
      {/* ── Desktop / Tablet: vertical card layout ── */}
      <div className="hidden sm:block p-6 overflow-hidden">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3.5 min-w-0 overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
              <BrandIcon platform={platform} size="sm" />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 truncate">
                {platform}
              </p>
              <p className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                {name}
              </p>
            </div>
          </div>
          {badge && (
            <span className="shrink-0 inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2 min-h-[40px]">
          {description}
        </p>

        {/* Footer: pricing + CTA */}
        <div className="flex items-end justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              From
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-none whitespace-nowrap">
              ${startingPrice.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5 truncate">{deliveryTime}</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {showPopular && (
              <span className="hidden lg:inline-flex items-center gap-1 h-7 px-3 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Popular · ${popularPrice!.toFixed(2)}
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors whitespace-nowrap">
              View
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile: two-row compact card layout ── */}
      <div className="sm:hidden px-4 py-4">
        {/* Row 1: icon + name + badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <BrandIcon platform={platform} size="sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              {platform}
            </p>
            <p className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2">
              {name}
            </p>
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 shrink-0 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-blue-500" />
              {badge}
            </span>
          )}
        </div>

        {/* Row 2: price + delivery + arrow */}
        <div className="flex items-center justify-between pl-[52px]">
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-slate-900 leading-none">
              ${startingPrice.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">{deliveryTime}</p>
          </div>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shrink-0 active:scale-95 transition-transform">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
