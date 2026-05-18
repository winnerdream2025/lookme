"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const { addToast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await apiPost("/contact", form);
      addToast("Message sent. We'll get back to you soon.", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      addToast("Failed to send message. Try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold text-[#0A0A0A] mb-3 tracking-tight">
          Contact Us
        </h1>
        <p className="text-[15px] text-[#6B7280] leading-relaxed">
          Have a question or need help? Send us a message or reach us on Telegram. We'll respond within 24 hours.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="What's this about?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
              placeholder="Tell us what's going on..."
              required
            />
          </div>

          <Button
            type="submit"
            variant="svcPrimary"
            size="lg"
            loading={sending}
            className="w-full rounded-full"
            arrowRight
          >
            Send Message
          </Button>
        </form>
      </div>

      {/* Quick contact options */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#0A0A0A]">Email</span>
          </div>
          <p className="text-sm text-[#6B7280] font-medium">
            support@lookme.com
          </p>
        </div>

        <a
          href="https://t.me/lookme_support"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:border-[#2563EB] hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center group-hover:bg-[#BAE6FD] transition-colors">
              <svg className="w-5 h-5 text-[#0EA5E9]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#0A0A0A]">Telegram</span>
          </div>
          <p className="text-sm text-[#6B7280] font-medium">
            @lookme_support
          </p>
        </a>

        <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#0A0A0A]">Response Time</span>
          </div>
          <p className="text-sm text-[#6B7280] font-medium">
            Usually within 24 hours
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
