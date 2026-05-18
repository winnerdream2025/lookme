import React from "react";
import Link from "next/link";
import { BrandIcon } from "./BrandIcon";
import { ArrowRight, TrendingUp } from "lucide-react";

interface PremiumServiceCardProps {
  slug: string;
  platform: string;
  name: string;
  description: string;
  startingPrice: number;
  popularPrice?: number;
  popularQty?: number;
  deliveryTime: string;
  badge?: string;
  variant?: "glass" | "glass-dark" | "solid";
}

export function PremiumServiceCard(props: PremiumServiceCardProps) {
  const showPopular = props.popularPrice && props.popularQty;
  const variant = props.variant || "glass";
  
  const cardClasses = {
    glass: "glass-card-light hover:shadow-xl",
    "glass-dark": "glass-card-dark text-white hover:bg-slate-900/70",
    solid: "bg-white border border-neutral-200 hover:border-primary-600 hover:shadow-xl"
  };

  const textClasses = {
    glass: "text-neutral-700",
    "glass-dark": "text-gray-300",
    solid: "text-neutral-600"
  };

  const priceClasses = {
    glass: "text-neutral-900",
    "glass-dark": "text-white",
    solid: "text-neutral-900"
  };
  
  return (
    <Link 
      href={`/services/${props.slug}`}
      className={`group relative block rounded-2xl p-6 transition-all duration-300 overflow-hidden ${cardClasses[variant]}`}
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-cyan-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:via-cyan-500/5 group-hover:to-primary-600/5 transition-all duration-500 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Badge */}
        {props.badge && (
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 text-white text-xs font-semibold rounded-full">
            <TrendingUp className="w-3 h-3" />
            {props.badge}
          </div>
        )}

        {/* Platform Icon & Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <BrandIcon platform={props.platform} size="sm" />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-xs font-medium mb-1 uppercase tracking-wide ${textClasses[variant]}`}>
              {props.platform}
            </div>
            <h3 className={`text-lg font-bold leading-tight ${priceClasses[variant]}`}>
              {props.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-6 line-clamp-2 ${textClasses[variant]}`}>
          {props.description}
        </p>

        {/* Pricing Section */}
        <div className="flex items-end justify-between pt-5 border-t border-white/10">
          <div>
            <div className={`text-xs font-medium mb-1 uppercase tracking-wide ${textClasses[variant]}`}>
              Starting at
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent`}>
              ${props.startingPrice.toFixed(2)}
            </div>
            <div className={`text-xs mt-1 ${textClasses[variant]}`}>
              {props.deliveryTime}
            </div>
          </div>
          
          {showPopular && (
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2 py-1 mb-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                  Popular
                </span>
              </div>
              <div className={`text-xl font-bold ${priceClasses[variant]}`}>
                ${props.popularPrice!.toFixed(2)}
              </div>
              <div className={`text-xs ${textClasses[variant]}`}>
                {props.popularQty!.toLocaleString()} units
              </div>
            </div>
          )}
        </div>

        {/* CTA Arrow */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all duration-300">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
