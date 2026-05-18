"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ServiceRequestPage() {
  const { addToast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectName: "",
    platformName: "",
    url: "",
    requestedAction: "",
    quantity: "",
    deadline: "",
    region: "",
    gender: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const message = `
SERVICE REQUEST QUOTE

Project Details:
- Project Name: ${form.projectName}
- Platform: ${form.platformName}
- URL: ${form.url || "Not provided"}

Request:
- Action Needed: ${form.requestedAction}
- Quantity: ${form.quantity}
- Deadline: ${form.deadline || "Flexible"}
- Region: ${form.region || "Any"}
- Gender Preference: ${form.gender || "Any"}

Additional Notes:
${form.notes || "None"}

Contact:
- Name: ${form.name}
- Email: ${form.email}
      `.trim();

      await apiPost("/contact", {
        name: form.name,
        email: form.email,
        subject: "Service Request Quote",
        message,
      });

      addToast("Request submitted! We'll contact you within 24 hours.", "success");
      setForm({
        name: "",
        email: "",
        projectName: "",
        platformName: "",
        url: "",
        requestedAction: "",
        quantity: "",
        deadline: "",
        region: "",
        gender: "",
        notes: "",
      });
    } catch {
      addToast("Failed to submit request. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0A0A0A] mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </Link>
        <h1 className="text-[32px] font-bold text-[#0A0A0A] mb-3 tracking-tight">
          Request Custom Service
        </h1>
        <p className="text-[15px] text-[#6B7280] leading-relaxed">
          Need a service or platform that's not listed? Tell us what you need and we'll get back to you with a custom quote within 24 hours.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="pb-6 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                  Email <span className="text-red-500">*</span>
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
          </div>

          {/* Project Details */}
          <div className="pb-6 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4">Project Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.projectName}
                  onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="My App or Business Name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Platform Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.platformName}
                    onChange={(e) => setForm((f) => ({ ...f, platformName: e.target.value }))}
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="e.g., TikTok, Amazon, Custom App"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    URL (if applicable)
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Requirements */}
          <div className="pb-6 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4">Service Requirements</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                  Requested Action <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.requestedAction}
                  onChange={(e) => setForm((f) => ({ ...f, requestedAction: e.target.value }))}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select an action...</option>
                  <option value="Reviews">Reviews</option>
                  <option value="Followers">Followers</option>
                  <option value="Likes">Likes</option>
                  <option value="Views">Views</option>
                  <option value="Subscribers">Subscribers</option>
                  <option value="Downloads/Installs">Downloads/Installs</option>
                  <option value="Traffic">Traffic</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="e.g., 100, 1000, or 'as many as possible'"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Deadline
                  </label>
                  <input
                    type="text"
                    value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="e.g., 1 week, ASAP, flexible"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Targeting Preferences */}
          <div className="pb-6 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4">Targeting Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                  Region/Country
                </label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="e.g., USA, Global, Europe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                  Gender Preference
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
              placeholder="Any specific requirements, budget range, or additional details..."
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
            Submit request
          </Button>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-5 bg-[#F0F9FF] border border-[#BFDBFE] rounded-2xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-[#0A0A0A] mb-1">What happens next?</p>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Our team will review your request and get back to you within 24 hours with pricing, feasibility, and next steps. We'll work with you to create a custom solution that fits your needs.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
