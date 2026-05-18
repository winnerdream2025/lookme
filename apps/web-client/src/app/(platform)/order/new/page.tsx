'use client';

import { useState } from 'react';
import { MeshLayout, PageContainer, Section } from '@/components/layout/GlobalLayout';
import { GlassCard } from '@/components/core/GlassCard';
import { Input, Textarea } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import { 
  Link as LinkIcon, 
  Users, 
  Target, 
  Calendar,
  CheckCircle2,
  ArrowRight 
} from 'lucide-react';

export default function NewOrderPage() {
  const [formData, setFormData] = useState({
    serviceType: '',
    targetUrl: '',
    quantity: '',
    deliverySpeed: 'standard',
    specialInstructions: '',
  });

  return (
    <MeshLayout>
      <PageContainer size="lg">
        {/* Header */}
        <Section spacing="md" className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Configure Your <span className="text-gradient">Campaign</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Set up your order details and we'll match you with qualified workers 
            from our global network.
          </p>
        </Section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <GlassCard variant="dark" padding="lg">
              <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
              
              <form className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="label mb-3 block text-white">
                    Select Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'followers', label: 'Followers', icon: Users },
                      { id: 'likes', label: 'Likes', icon: CheckCircle2 },
                      { id: 'views', label: 'Views', icon: Target },
                      { id: 'reviews', label: 'Reviews', icon: CheckCircle2 },
                    ].map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, serviceType: service.id })}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200
                            ${formData.serviceType === service.id
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-white/10 hover:border-white/20 bg-white/5'
                            }
                          `}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${
                            formData.serviceType === service.id ? 'text-primary-400' : 'text-slate-400'
                          }`} />
                          <span className="text-sm font-semibold text-white">
                            {service.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target URL */}
                <Input
                  variant="glass"
                  label="Target URL"
                  placeholder="Enter direct profile link..."
                  helperText="Paste the full URL to your profile, post, or page"
                  icon={<LinkIcon className="w-4 h-4" />}
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                />

                {/* Quantity */}
                <Input
                  variant="glass"
                  type="number"
                  label="Quantity"
                  placeholder="e.g., 1000"
                  helperText="How many followers, likes, or views do you need?"
                  icon={<Target className="w-4 h-4" />}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />

                {/* Delivery Speed */}
                <div>
                  <label className="label mb-3 block text-white">
                    Delivery Speed
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'standard', label: 'Standard', time: '3-5 days', price: '$0' },
                      { id: 'fast', label: 'Fast', time: '1-2 days', price: '+$10' },
                      { id: 'instant', label: 'Instant', time: '< 24 hours', price: '+$25' },
                    ].map((speed) => (
                      <button
                        key={speed.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, deliverySpeed: speed.id })}
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${formData.deliverySpeed === speed.id
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-white/10 hover:border-white/20 bg-white/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className={`w-4 h-4 ${
                            formData.deliverySpeed === speed.id ? 'text-primary-400' : 'text-slate-400'
                          }`} />
                          <span className="text-sm font-bold text-white">
                            {speed.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-1">{speed.time}</p>
                        <p className="text-xs font-semibold text-primary-400">{speed.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <Textarea
                  variant="glass"
                  label="Special Instructions (Optional)"
                  placeholder="Any specific requirements or preferences..."
                  helperText="Let us know if you have any special requests"
                  rows={4}
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                />

                {/* Submit Button */}
                <Button 
                  size="lg" 
                  fullWidth
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Continue to Payment
                </Button>
              </form>
            </GlassCard>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <GlassCard variant="dark" padding="lg" className="sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-sm text-slate-400">Service</span>
                  <span className="text-sm font-semibold text-white">
                    {formData.serviceType || 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-sm text-slate-400">Quantity</span>
                  <span className="text-sm font-semibold text-white">
                    {formData.quantity || '0'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-sm text-slate-400">Delivery</span>
                  <span className="text-sm font-semibold text-white capitalize">
                    {formData.deliverySpeed}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-extrabold text-gradient">
                    $0.00
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    <span>30-day refill guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    <span>Real human workers only</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </PageContainer>
    </MeshLayout>
  );
}
