import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section — editorial layout, not a perfect grid */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-24">
          {/* Brand column — wider, intentional */}
          <div className="lg:w-[320px] flex-shrink-0">
            <p className="text-lg font-bold text-[#0A0A0A] mb-4 tracking-tight">
              LookMe
            </p>
            <p className="text-[15px] text-neutral-500 leading-relaxed mb-6">
              Real engagement from real people. The marketplace where clients and workers connect for authentic social growth.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center text-neutral-400 hover:text-[#0A0A0A] hover:border-[#0A0A0A] transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center text-neutral-400 hover:text-[#0A0A0A] hover:border-[#0A0A0A] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns — asymmetric spacing */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-5">
                Services
              </p>
              <div className="space-y-3">
                <Link href="/pricing?class=social-growth" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Social Growth
                </Link>
                <Link href="/pricing?class=engagement" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Engagement
                </Link>
                <Link href="/pricing?class=visibility" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Visibility
                </Link>
                <Link href="/pricing?class=reputation" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Reputation
                </Link>
                <Link href="/pricing" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  All Services
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-5">
                Company
              </p>
              <div className="space-y-3">
                <Link href="/about" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  About
                </Link>
                <Link href="/contact" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Contact
                </Link>
                <Link href="/blog" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-5">
                Account
              </p>
              <div className="space-y-3">
                <Link href="/dashboard" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Dashboard
                </Link>
                <Link href="/orders" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Track Order
                </Link>
                <Link href="/login" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="block text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar — royal blue stripe (full-bleed) */}
      <div className="w-full bg-[#2563EB] text-white">
        <div
          className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          <p className="text-xs text-white/90">© 2025 LookMe. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/90 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-white/90 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-xs text-white/90 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
