'use client';

import Link from 'next/link';
import { SERVICE_CLASSES, SERVICES, getServicesByClass } from '@/lib/services';
import { MeshLayout, PageContainer, Section } from '@/components/layout/GlobalLayout';
import { GlassCard, ServiceCard } from '@/components/core/GlassCard';
import { Button } from '@/components/core/Button';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';

export default function ServicesCatalogPage() {
  return (
    <MeshLayout>
      <PageContainer>
        {/* Header Section */}
        <Section spacing="lg" className="text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-card-dark">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">19 Premium Services</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              Services built for{' '}
              <span className="text-gradient">every goal</span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Whether you're growing a brand, launching a product, or building credibility — every service
              is fulfilled by real people on our network. No bots. No automation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="primary">
                Browse All Services
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="glass">
                Custom Request
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Section>

        {/* Custom Request Callout */}
        <Section spacing="md">
          <Link href="/services/request">
            <GlassCard 
              variant="dark" 
              hover="glow"
              className="group cursor-pointer border-2 border-dashed border-primary-500/30 hover:border-primary-500/60"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Need a custom service?
                  </h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Don't see your platform or service listed? Request a custom quote for any app, 
                    platform, or engagement type. We'll get back to you within 24 hours.
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                    Request Custom Service
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        </Section>

        {/* Service Classes Grid */}
        <Section spacing="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CLASSES.map((cls) => {
              const services = getServicesByClass(cls.id);
              const platforms = [...new Set(services.map((s) => s.platform))];
              
              return (
                <Link key={cls.id} href={`/pricing?class=${cls.id}`}>
                  <ServiceCard className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          {cls.label}
                        </h2>
                        <p className="label text-xs">
                          {cls.tagline}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-lg">
                        {services.length}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="body-text-sm mb-6 flex-1">
                      {cls.description}
                    </p>

                    {/* Service List */}
                    <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                      {services.slice(0, 4).map((svc) => (
                        <div
                          key={svc.slug}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-700 font-medium">{svc.name}</span>
                          <span className="text-slate-500 font-semibold">
                            ${svc.packages[0].price}
                          </span>
                        </div>
                      ))}
                      {services.length > 4 && (
                        <p className="text-xs text-slate-400 font-medium pt-1">
                          +{services.length - 4} more services
                        </p>
                      )}
                    </div>

                    {/* Platforms */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {platforms.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium"
                        >
                          {p}
                        </span>
                      ))}
                      {platforms.length > 3 && (
                        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
                          +{platforms.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all">
                      Browse {cls.label}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </ServiceCard>
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Trust Strip */}
        <Section spacing="lg" className="border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: `${SERVICES.length}+`, label: 'Distinct Services' },
              { value: '100%', label: 'Real Human Workers' },
              { value: '30-Day', label: 'Refill Guarantee' },
              { value: '24/7', label: 'Order Support' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-4xl font-extrabold text-gradient mb-2">
                  {item.value}
                </p>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </PageContainer>
    </MeshLayout>
  );
}
