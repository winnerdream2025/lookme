import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image Layer with Responsive Sources */}
      <picture className="absolute inset-0 z-0">
        <source 
          media="(max-width: 767px)" 
          srcSet="/images/hero-mobile.webp" 
          type="image/webp"
        />
        <source 
          media="(min-width: 768px)" 
          srcSet="/images/hero-desktop.webp" 
          type="image/webp"
        />
        <img
          src="/images/hero-desktop.jpg"
          alt="LookMe Team"
          className="w-full h-full object-cover object-right"
        />
      </picture>

      {/* Gradient Overlay - Desktop: left-to-right fade, Mobile: uniform tint */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:from-black/70 md:via-black/50 md:to-transparent lg:from-black/75 lg:via-black/40 lg:to-transparent" />
      
      {/* Mobile uniform overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-black/50 md:hidden" />

      {/* Content Container */}
      <div className="relative z-20 w-full px-6 lg:px-12 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">
                100% Real People. No Bots.
              </span>
            </div>

            {/* Heading with Gradient Text */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">Grow your brand with </span>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                real people
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-lg">
              A marketplace connecting businesses with authentic workers who deliver genuine engagement across 15+ platforms.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                href="/pricing"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
              >
                <span className="relative z-10">Order Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link 
                href="#how-it-works"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30"
              >
                How it works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-gray-300">Orders Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">15</div>
                <div className="text-sm text-gray-300">Platforms</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
