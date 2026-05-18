import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: "url('/images/Gemini_Generated_Image_8154h08154h08154.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-black/40"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-full mb-6 shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[#0A0A0A]">Trusted by 50,000+ customers worldwide</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            <span className="text-white" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)' }}>
              Building the Future of
            </span>
            <br/>
            <span className="text-yellow-300" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)' }}>
              Social Trust
            </span>
          </h1>
          <p className="text-xl text-white/95 leading-relaxed mb-10 max-w-3xl mx-auto drop-shadow-md">
            LookMe is the premium social engagement marketplace where businesses, creators, and brands build credible online presences through high-quality, authentic engagement from real people.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing">
              <button className="inline-flex items-center justify-center rounded-full px-10 h-14 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                Explore Services
              </button>
            </Link>
            <Link href="/contact">
              <button className="inline-flex items-center justify-center rounded-full px-10 h-14 text-base font-semibold bg-white text-gray-900 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all border-2 border-white/50">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2563EB] mb-2">50k+</div>
              <div className="text-sm text-[#374151] font-semibold">Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2563EB] mb-2">15k+</div>
              <div className="text-sm text-[#374151] font-semibold">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2563EB] mb-2">98%</div>
              <div className="text-sm text-[#374151] font-semibold">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2563EB] mb-2">24/7</div>
              <div className="text-sm text-[#374151] font-semibold">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">Why Choose LookMe?</h2>
            <p className="text-lg text-[#374151] max-w-2xl mx-auto">We're not just another engagement service. Here's what makes us different.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Real People, Real Results</h3>
              <p className="text-[#374151] leading-relaxed mb-4">
                Every interaction comes from genuine accounts operated by real people. No bots, no fake profiles, no risk to your reputation.
              </p>
              <ul className="space-y-2 text-sm text-[#1F2937]">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Verified human workers</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Natural engagement patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Platform-compliant methods</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Lightning-Fast Delivery</h3>
              <p className="text-[#374151] leading-relaxed mb-4">
                Our automated task distribution system ensures your order starts processing within minutes of payment confirmation.
              </p>
              <ul className="space-y-2 text-sm text-[#1F2937]">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Instant order activation</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Real-time progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Completion within 24-72 hours</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">100% Safe & Secure</h3>
              <p className="text-[#374151] leading-relaxed mb-4">
                Your privacy and account security are our top priorities. We never ask for sensitive information.
              </p>
              <ul className="space-y-2 text-sm text-[#1F2937]">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>No passwords required</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Encrypted payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>GDPR compliant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 px-6 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">How LookMe Works</h2>
            <p className="text-lg text-[#374151] max-w-2xl mx-auto">A simple, transparent process from order to delivery.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-[#F6F5F3] rounded-2xl p-6 border-2 border-[#E5E7EB] hover:border-[#2563EB] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Choose Your Service</h3>
                <p className="text-sm text-[#1F2937] leading-relaxed">Browse our catalog and select the service that matches your growth goals.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#F6F5F3] rounded-2xl p-6 border-2 border-[#E5E7EB] hover:border-[#2563EB] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Place Your Order</h3>
                <p className="text-sm text-[#1F2937] leading-relaxed">Provide your profile URL and customize your package. No account or password needed.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#F6F5F3] rounded-2xl p-6 border-2 border-[#E5E7EB] hover:border-[#2563EB] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">We Distribute Tasks</h3>
                <p className="text-sm text-[#1F2937] leading-relaxed">Our platform assigns tasks to verified workers who complete them naturally over time.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#F6F5F3] rounded-2xl p-6 border-2 border-[#E5E7EB] hover:border-[#2563EB] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">4</div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Track & Grow</h3>
                <p className="text-sm text-[#1F2937] leading-relaxed">Monitor your order in real-time and watch your social presence grow organically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-block px-4 py-2 bg-[#EFF6FF] text-[#2563EB] rounded-full text-sm font-bold mb-6">Our Story</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-6 leading-tight">Bridging the Social Proof Gap</h2>
              <div className="space-y-5 text-[#374151] leading-relaxed text-lg">
                <p>
                  Founded in 2024, LookMe was born from a simple observation: <strong className="text-[#0A0A0A]">the digital economy runs on trust</strong>, but building that trust from scratch is incredibly difficult for new businesses and creators.
                </p>
                <p>
                  We saw talented entrepreneurs with amazing products struggle to gain traction simply because they lacked the initial social proof to be taken seriously. Meanwhile, established competitors with mediocre offerings thrived purely on perception.
                </p>
                <p>
                  That's when we decided to build a marketplace that levels the playing field—connecting businesses with real people who provide authentic engagement, helping quality rise to the top.
                </p>
                <p className="text-[#0A0A0A] font-semibold">
                  Today, LookMe serves over 15,000 active clients across 50+ countries, helping them bridge the "social proof gap" and get the attention their hard work deserves.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-bold text-[#2563EB] mb-2">50k+</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">Orders Completed</div>
                </div>
                <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-bold text-[#16A34A] mb-2">15k+</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">Happy Clients</div>
                </div>
                <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-bold text-[#EA580C] mb-2">98%</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">Satisfaction</div>
                </div>
                <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-bold text-[#D97706] mb-2">24/7</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#0A0A0A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="!text-white text-4xl md:text-5xl font-bold mb-6">
            Ready to grow your presence?
          </h2>
          <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful brands and creators who use LookMe to scale their social impact.
          </p>
          <Link href="/pricing">
            <Button variant="svcPrimary" size="lg" className="rounded-full px-12 h-14 text-base font-bold shadow-xl hover:shadow-2xl transition-shadow">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
