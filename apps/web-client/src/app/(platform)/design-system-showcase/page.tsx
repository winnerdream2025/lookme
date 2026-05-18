'use client';

import { MeshLayout, PageContainer, Section } from '@/components/layout';
import { GlassCard, ServiceCard, DashboardCard } from '@/components/core/GlassCard';
import { Input, Textarea } from '@/components/core/Input';
import { Button, IconButton } from '@/components/core/Button';
import { 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Star,
  Mail,
  User,
  Link as LinkIcon
} from 'lucide-react';

export default function DesignSystemShowcase() {
  return (
    <MeshLayout>
      <PageContainer>
        {/* Header */}
        <Section spacing="lg" className="text-center">
          <h1 className="text-6xl font-extrabold text-white mb-4">
            LookMe <span className="text-gradient">Design System</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Complete component library with glassmorphism, gradients, and premium UI elements
          </p>
        </Section>

        {/* Typography */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Typography</h2>
          <GlassCard variant="dark" padding="lg">
            <div className="space-y-6">
              <div>
                <h1 className="text-white">Heading 1 - 48px Extrabold</h1>
                <h2 className="text-white">Heading 2 - 36px Bold</h2>
                <h3 className="text-white">Heading 3 - 30px Bold</h3>
                <h4 className="text-white">Heading 4 - 24px Semibold</h4>
                <h5 className="text-white">Heading 5 - 20px Semibold</h5>
                <h6 className="text-white">Heading 6 - 18px Semibold</h6>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="body-text-lg text-white">Large body text - 18px</p>
                <p className="body-text text-white">Regular body text - 16px</p>
                <p className="body-text-sm text-white">Small body text - 14px</p>
                <span className="label text-white">LABEL TEXT - 14PX UPPERCASE</span>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-4xl font-extrabold text-gradient">
                  Gradient Text Effect
                </p>
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* Colors */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Color Palette</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-4">Primary</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-400" />
                  <span className="text-white">primary-400</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-500" />
                  <span className="text-white">primary-500</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-600" />
                  <span className="text-white">primary-600</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-4">Semantic</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-success-400" />
                  <span className="text-white">success-400</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-warning-400" />
                  <span className="text-white">warning-400</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-danger-400" />
                  <span className="text-white">danger-400</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-4">Neutrals</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-700" />
                  <span className="text-white">slate-700</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-800" />
                  <span className="text-white">slate-800</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-900" />
                  <span className="text-white">slate-900</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* Buttons */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Buttons</h2>
          <GlassCard variant="dark" padding="lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="glass">Glass</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="xl">Extra Large</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
                    Left Icon
                  </Button>
                  <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Right Icon
                  </Button>
                  <Button variant="primary" isLoading>
                    Loading
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Icon Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <IconButton 
                    icon={<Plus className="w-5 h-5" />} 
                    variant="primary" 
                    size="sm"
                    aria-label="Add"
                  />
                  <IconButton 
                    icon={<Star className="w-5 h-5" />} 
                    variant="primary" 
                    size="md"
                    aria-label="Star"
                  />
                  <IconButton 
                    icon={<CheckCircle2 className="w-6 h-6" />} 
                    variant="success" 
                    size="lg"
                    aria-label="Check"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* Inputs */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Form Inputs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-6">Glass Inputs</h3>
              <div className="space-y-6">
                <Input
                  variant="glass"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  variant="glass"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  helperText="We'll never share your email"
                  icon={<Mail className="w-4 h-4" />}
                />
                <Input
                  variant="glass"
                  label="Profile URL"
                  placeholder="Enter direct profile link..."
                  icon={<LinkIcon className="w-4 h-4" />}
                />
                <Textarea
                  variant="glass"
                  label="Message"
                  placeholder="Your message..."
                  rows={4}
                />
              </div>
            </GlassCard>

            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-6">Input States</h3>
              <div className="space-y-6">
                <Input
                  variant="glass"
                  label="Default State"
                  placeholder="Type here..."
                />
                <Input
                  variant="glass"
                  label="With Helper Text"
                  placeholder="Type here..."
                  helperText="This is helper text"
                />
                <Input
                  variant="glass"
                  label="Error State"
                  placeholder="Type here..."
                  errorMessage="This field is required"
                />
                <Input
                  variant="glass"
                  label="Disabled State"
                  placeholder="Disabled..."
                  disabled
                />
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* Cards */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Card Components</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard variant="dark" hover="glow">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dark Glass Card</h3>
              <p className="text-slate-300 mb-4">
                With glow hover effect
              </p>
              <Button variant="primary" size="sm" fullWidth>
                Action
              </Button>
            </GlassCard>

            <ServiceCard>
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Service Card</h3>
              <p className="text-slate-600 mb-4">
                With lift hover effect
              </p>
              <Button variant="primary" size="sm" fullWidth>
                Order Now
              </Button>
            </ServiceCard>

            <DashboardCard>
              <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Dashboard Card</h3>
              <p className="text-slate-600 mb-4">
                Solid white background
              </p>
              <Button variant="primary" size="sm" fullWidth>
                View Details
              </Button>
            </DashboardCard>
          </div>
        </Section>

        {/* Gradients */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Gradients</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-4">Primary Gradient</h3>
              <div className="h-32 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold">Blue → Cyan</span>
              </div>
            </GlassCard>

            <GlassCard variant="dark" padding="lg">
              <h3 className="text-xl font-bold text-white mb-4">Dark Gradient</h3>
              <div className="h-32 rounded-xl gradient-dark flex items-center justify-center">
                <span className="text-white font-bold">Slate 900 → Slate 800</span>
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* Stats Example */}
        <Section spacing="lg">
          <h2 className="text-3xl font-bold text-white mb-8">Stats Grid Example</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Orders', value: '50K+', color: 'text-primary-400' },
              { label: 'Active Workers', value: '12.5K', color: 'text-cyan-400' },
              { label: 'Success Rate', value: '98%', color: 'text-success-400' },
              { label: 'Avg Response', value: '2.3m', color: 'text-warning-400' },
            ].map((stat) => (
              <GlassCard key={stat.label} variant="dark" hover="glow">
                <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                <p className={`text-4xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </p>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <Section spacing="lg" className="text-center border-t border-white/10">
          <p className="text-slate-400">
            LookMe Design System v1.0.0 • Built with Tailwind CSS v4
          </p>
        </Section>
      </PageContainer>
    </MeshLayout>
  );
}
