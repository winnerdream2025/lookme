import React from "react";
import Link from "next/link";
import { BrandIcon } from "./BrandIcon";

interface ServiceCardProps {
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

export function ServiceCard(props: ServiceCardProps) {
  const showPopular = props.popularPrice != null && props.popularQty != null;
  
  return (
    <Link 
      href={`/services/${props.slug}`}
      className="group relative block h-full bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm hover:border-[#2563EB] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 will-change-transform overflow-hidden"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] ring-1 ring-[#E5E7EB] flex items-center justify-center shrink-0 group-hover:bg-[#EFF6FF] group-hover:ring-[#BFDBFE] transition-colors">
            <BrandIcon platform={props.platform} size="sm" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-[#6B7280] mb-1 font-semibold uppercase tracking-wider">{props.platform}</div>
            <h3 className="text-[18px] font-bold text-[#0A0A0A] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2 break-words">
              {props.name}
            </h3>
          </div>
        </div>
        {props.badge && (
          <span title={props.badge} className="inline-flex max-w-[45%] items-center h-7 px-3 rounded-full border border-[#E5E7EB] text-[11px] font-semibold text-[#0A0A0A] bg-white truncate">
            {props.badge}
          </span>
        )}
      </div>

      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-6 line-clamp-2 min-h-[44px]">
        {props.description}
      </p>

      <div className="mt-auto flex items-end justify-between pt-4 border-t border-[#E5E7EB]">
        <div>
          <div className="text-[11px] text-[#6B7280] mb-1 font-semibold uppercase tracking-wider">From</div>
          <div className="text-[22px] font-bold text-[#0A0A0A]">${props.startingPrice.toFixed(2)}</div>
          <div className="text-[11px] text-[#6B7280] mt-1">{props.deliveryTime}</div>
        </div>
        <div className="flex items-center gap-2">
          {showPopular && (
            <span className="hidden sm:inline-flex items-center h-7 px-3 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] font-semibold text-[#2563EB]">
              Popular · ${props.popularPrice!.toFixed(2)}
            </span>
          )}
          <span className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold text-[#0A0A0A] opacity-80 group-hover:opacity-100 transition-opacity">
            View
            <span aria-hidden className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A0A0A] text-white">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
