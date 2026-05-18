import Link from "next/link";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Hero } from "@/components/Hero";
import { CatalogServiceCard } from "@/components/ui/CatalogServiceCard";
import { SERVICES } from "@/lib/services";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />

      <section className="bg-[#0A0A0A] text-white px-6 lg:px-12 py-24" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-20">
            <div>
              <h2 className="text-[42px] font-semibold tracking-tight leading-[1.1] mb-6" style={{ color: '#FFFFFF' }}>
                A marketplace built on trust
              </h2>
              <p className="text-[17px] text-neutral-200 leading-[1.6] mb-8">
                We connect clients with a global network of real people who complete engagement tasks. Every order is verified. Every worker is scored. No bots, no automation.
              </p>
              <div className="space-y-6">
                <div>
                  <div className="text-[15px] font-medium mb-2">For businesses & creators</div>
                  <div className="text-[15px] text-neutral-300 leading-relaxed">
                    Choose your platform and service. Set your target URL. Pay once. Workers handle the rest.
                  </div>
                </div>
                <div>
                  <div className="text-[15px] font-medium mb-2">For workers</div>
                  <div className="text-[15px] text-neutral-300 leading-relaxed">
                    Browse available tasks. Complete them on your schedule. Submit proof. Get paid.
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8 lg:pt-12">
              <div className="border-l-2 border-neutral-700 pl-6">
                <div className="text-[15px] font-medium mb-2">Escrow protection</div>
                <div className="text-[15px] text-neutral-300">Funds held until delivery confirmed</div>
              </div>
              <div className="border-l-2 border-neutral-700 pl-6">
                <div className="text-[15px] font-medium mb-2">Fraud detection</div>
                <div className="text-[15px] text-neutral-300">Automated screening on every task</div>
              </div>
              <div className="border-l-2 border-neutral-700 pl-6">
                <div className="text-[15px] font-medium mb-2">Worker trust scores</div>
                <div className="text-[15px] text-neutral-300">Quality ratings on all submissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 lg:px-12 py-20 scroll-mt-24 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="rounded-3xl border border-neutral-900 p-6 md:p-8 shadow-lg" style={{ backgroundColor: '#0A0A0A' }}>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>How it works</p>
              <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight mt-1" style={{ color: '#FFFFFF' }}>Three steps from browse to delivered</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Step 1</p>
                  <h3 className="text-sm font-semibold text-neutral-900">Pick your service</h3>
                  <p className="text-sm text-neutral-600 mt-1">Browse Instagram followers, YouTube views, Google reviews, and more. Filter by platform or engagement type.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Step 2</p>
                  <h3 className="text-sm font-semibold text-neutral-900">Place order</h3>
                  <p className="text-sm text-neutral-600 mt-1">Enter your URL and email. Pay with Stripe. No account needed. Takes under a minute.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Step 3</p>
                  <h3 className="text-sm font-semibold text-neutral-900">Track progress</h3>
                  <p className="text-sm text-neutral-600 mt-1">Create a free account to monitor delivery in real-time. Workers complete tasks and you see results live.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F5F3] px-6 lg:px-12 py-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Top rated</p>
              <h2 className="text-[32px] sm:text-[36px] font-semibold tracking-tight text-[#0A0A0A]">Popular services</h2>
            </div>
            <Link href="/pricing" className="text-[15px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all →
            </Link>
          </div>

          {/* Cards — same grid & component as pricing page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {SERVICES.slice()
              .sort((a, b) => b.stats.purchasedToday - a.stats.purchasedToday)
              .slice(0, 8)
              .map((svc) => {
                const startingPkg = svc.packages[0];
                const popularPkg = svc.packages.find((p) => p.popular);
                const badge = svc.stats.purchasedToday > 200 ? "POPULAR" : undefined;
                return (
                  <CatalogServiceCard
                    key={svc.slug}
                    slug={svc.slug}
                    platform={svc.platform}
                    name={svc.name}
                    description={svc.description}
                    category={svc.category}
                    startingPrice={startingPkg.price}
                    popularPrice={popularPkg?.price}
                    popularQty={popularPkg?.qty}
                    deliveryTime={svc.deliveryTime.split(",")[0]}
                    badge={badge}
                  />
                );
              })}
          </div>

          {/* Platform quick-nav chips */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { href: "/services/tiktok-followers", platform: "TikTok", label: "TikTok" },
              { href: "/services/google-reviews", platform: "Google Business", label: "Google" },
              { href: "/services/facebook-reviews", platform: "Facebook", label: "Facebook" },
              { href: "/services/twitter-followers", platform: "X (Twitter)", label: "X" },
              { href: "/pricing?class=music-promotion", platform: "Spotify", label: "Spotify" },
              { href: "/pricing", platform: null, label: "+9 more" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-[14px] font-semibold text-[#374151]"
              >
                {item.platform && <BrandIcon platform={item.platform} size="sm" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section
        className="relative px-6 lg:px-12 py-32 overflow-hidden"
        style={{
          backgroundImage: "url(/images/hero-desktop.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/70 shadow-sm p-8">
            <h2 className="text-[48px] font-semibold tracking-tight leading-[1.1] mb-6 text-[#0A0A0A]">
              Start growing today
            </h2>
            <p className="text-[19px] text-neutral-700 leading-relaxed mb-10">
              No contracts. No subscriptions. Pay per order. Track everything in real-time.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="h-12 px-7 bg-[#0A0A0A] text-white text-[15px] font-medium rounded-full hover:bg-black inline-flex items-center">
                Browse services
              </Link>
              <Link
                href="/register"
                className="h-12 px-7 text-[15px] font-medium inline-flex items-center rounded-full bg-white text-[#0A0A0A] border border-[#E5E7EB] hover:bg-[#F5F5F5]"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
