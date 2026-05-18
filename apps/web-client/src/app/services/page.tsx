import Link from "next/link";
import { SERVICE_CLASSES, SERVICES, getServicesByClass } from "@/lib/services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">
          What we offer
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Services built for every goal
        </h1>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Whether you are growing a brand, launching a product or building credibility — every service
          is fulfilled by real people on our network. No bots. No automation.
        </p>
      </div>

      {/* Custom Request Callout */}
      <Link
        href="/services/request"
        className="group block border border-[#E5E7EB] bg-white rounded-2xl p-6 mb-8 hover:border-neutral-400 hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#0A0A0A] mb-1">
              Need a custom service?
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
              Don't see your platform or service listed? Request a custom quote for any app, platform, or engagement type. We'll get back to you within 24 hours.
            </p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] group-hover:gap-2 transition-all">
              Request Custom Service
              <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Class cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {SERVICE_CLASSES.map((cls) => {
          const services = getServicesByClass(cls.id);
          const platforms = [...new Set(services.map((s) => s.platform))];
          return (
            <Link
              key={cls.id}
              href={`/pricing?class=${cls.id}`}
              className="group flex flex-col border border-neutral-200 rounded-2xl p-6 hover:border-neutral-400 hover:shadow-md transition-all bg-white"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-1">{cls.label}</h2>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    {cls.tagline}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-lg">
                  {services.length} service{services.length !== 1 ? "s" : ""}
                </span>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed mb-5 flex-1">
                {cls.description}
              </p>

              {/* Service list */}
              <div className="space-y-1.5 mb-5">
                {services.slice(0, 4).map((svc) => (
                  <div
                    key={svc.slug}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-neutral-700">{svc.name}</span>
                    <span className="text-neutral-400 text-xs">
                      from ${svc.packages[0].price}
                    </span>
                  </div>
                ))}
                {services.length > 4 && (
                  <p className="text-xs text-neutral-400 pt-1">
                    +{services.length - 4} more
                  </p>
                )}
              </div>

              {/* Platforms */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-md"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-neutral-900 group-hover:gap-2 transition-all">
                Browse {cls.label}
                <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Trust strip */}
      <div className="border-t border-neutral-100 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: `${SERVICES.length}+`, label: "Distinct services" },
            { value: "100%", label: "Real human workers" },
            { value: "30-day", label: "Refill guarantee" },
            { value: "24/7", label: "Order support" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-neutral-900 mb-1">{item.value}</p>
              <p className="text-sm text-neutral-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
