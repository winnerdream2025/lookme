"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  SERVICES,
  SERVICE_CLASSES,
  getPlatformsForClass,
  type ServiceClass,
} from "@/lib/services";
import { CatalogServiceCard } from "@/components/ui/CatalogServiceCard";

function PricingInner() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get("class") as ServiceClass | null;

  const [activeClass, setActiveClass] = useState<ServiceClass | "all">(
    classParam && SERVICE_CLASSES.some((c) => c.id === classParam) ? classParam : "all"
  );
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");

  const platformsForClass = useMemo(() => {
    if (activeClass === "all") return [];
    return getPlatformsForClass(activeClass);
  }, [activeClass]);

  const filtered = useMemo(() => {
    let result = SERVICES.filter((svc) => {
      const matchClass = activeClass === "all" || svc.serviceClass === activeClass;
      const matchPlatform = activePlatform === "all" || svc.platformKey === activePlatform;
      const matchSearch =
        !search ||
        svc.name.toLowerCase().includes(search.toLowerCase()) ||
        svc.platform.toLowerCase().includes(search.toLowerCase()) ||
        svc.description.toLowerCase().includes(search.toLowerCase());
      return matchClass && matchPlatform && matchSearch;
    });

    if (sortBy === "popular") {
      result.sort((a, b) => b.stats.purchasedToday - a.stats.purchasedToday);
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.packages[0].price - b.packages[0].price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.packages[0].price - a.packages[0].price);
    }

    return result;
  }, [activeClass, activePlatform, search, sortBy]);

  function handleClassChange(cls: ServiceClass | "all") {
    setActiveClass(cls);
    setActivePlatform("all");
  }

  const activeClassDef = SERVICE_CLASSES.find((c) => c.id === activeClass);

  const categories = [
    { id: "all" as const, label: "All services", count: SERVICES.length },
    ...SERVICE_CLASSES.map((cls) => ({
      id: cls.id,
      label: cls.label,
      count: SERVICES.filter((s) => s.serviceClass === cls.id).length,
    })),
  ];

  const hasActiveFilters = activeClass !== "all" || activePlatform !== "all" || search;

  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">

        {/* ─── Hero Header ─── */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A0A0A] mb-3 sm:mb-4">
            {activeClassDef ? activeClassDef.label : "Browse services"}
          </h1>
          <p className="text-base sm:text-lg text-[#374151] max-w-2xl leading-relaxed">
            {activeClassDef
              ? activeClassDef.description
              : `${SERVICES.length} services across ${new Set(SERVICES.map((s) => s.platform)).size} platforms. Order as a guest or create an account to track progress.`}
          </p>
        </div>

        {/* ─── Desktop Category Pills ─── */}
        <div className="hidden lg:flex flex-wrap gap-2.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClassChange(cat.id)}
              className={`h-10 px-5 text-sm font-semibold rounded-full transition-all duration-200 border ${
                activeClass === cat.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F0EFED] hover:border-[#D1D5DB]"
              }`}
            >
              {cat.label}
              <span className="ml-2 text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* ─── Mobile Category Select ─── */}
        <div className="lg:hidden mb-5">
          <select
            value={activeClass}
            onChange={(e) => handleClassChange(e.target.value as ServiceClass | "all")}
            className="w-full h-12 px-4 text-base rounded-xl bg-white border border-[#E5E7EB] text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
          >
            <option value="all">All Services ({SERVICES.length})</option>
            {SERVICE_CLASSES.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.label}</option>
            ))}
          </select>
        </div>

        {/* ─── Search & Sort Bar ─── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search services, platforms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-10 pr-4 text-base rounded-xl bg-white border border-[#E5E7EB] text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-12 px-4 text-base rounded-xl bg-white border border-[#E5E7EB] text-[#374151] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none sm:w-48"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
          >
            <option value="popular">Most popular</option>
            <option value="price-low">Lowest price</option>
            <option value="price-high">Highest price</option>
          </select>
        </div>

        {/* ─── Platform Sub-filters ─── */}
        {activeClass !== "all" && platformsForClass.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActivePlatform("all")}
              className={`h-8 px-3.5 text-xs font-semibold rounded-full border transition-all ${
                activePlatform === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F0EFED]"
              }`}
            >
              All Platforms
            </button>
            {platformsForClass.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePlatform(p.key)}
                className={`h-8 px-3.5 text-xs font-semibold rounded-full border transition-all ${
                  activePlatform === p.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-[#333] border-[#D1D5DB] hover:bg-[#F0EFED]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* ─── Results Count ─── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280] font-medium">
            <span className="font-bold text-[#0A0A0A]">{filtered.length}</span> service{filtered.length !== 1 ? "s" : ""}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => { setActiveClass("all"); setActivePlatform("all"); setSearch(""); }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ─── How It Works ─── */}
        <section className="mb-10">
          <div className="rounded-2xl border border-[#D1D5DB] bg-white p-5 sm:p-8 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1">How it works</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0A0A]">Three steps from browse to delivered</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { n: "1", title: "Pick your service", desc: "Browse Instagram followers, YouTube views, Google reviews, and more." },
                { n: "2", title: "Place order", desc: "Enter your URL and email. Pay with Stripe. No account needed." },
                { n: "3", title: "Track progress", desc: "Monitor delivery in real-time. Workers complete tasks and you see results live." },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F6F5F3] border border-[#D1D5DB]">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                  <div>
                    <p className="text-sm font-bold text-[#0A0A0A] mb-1">{s.title}</p>
                    <p className="text-sm text-[#333] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Service Grid: 4→2→1 ─── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-[#0A0A0A] mb-2">No services found</p>
            <p className="text-base text-[#333] mb-6">Try adjusting your filters</p>
            <button
              onClick={() => { setActiveClass("all"); setActivePlatform("all"); setSearch(""); }}
              className="h-12 px-8 text-base font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((svc) => {
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
        )}

        {/* ─── Trust Strip ─── */}
        <section className="mt-16 pt-12 border-t border-[#E5E7EB]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: `${SERVICES.length}+`, label: "Distinct Services" },
              { value: "100%", label: "Real Human Workers" },
              { value: "30-Day", label: "Refill Guarantee" },
              { value: "24/7", label: "Order Support" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2">{item.value}</p>
                <p className="text-xs sm:text-sm text-[#6B7280] font-medium uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingInner />
    </Suspense>
  );
}
