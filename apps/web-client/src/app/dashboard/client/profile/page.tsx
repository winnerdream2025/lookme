"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";
import type { Me } from "@/lib/types";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

export default function ClientProfilePage() {
  const { addToast } = useToast();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    apiGet<Me>("/auth/me")
      .then((data) => {
        setMe(data);
        setName(data.name || "");
        setCompanyName(data.profile?.lastName || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await apiPatch("/auth/profile", { name, companyName });
      addToast("Profile updated", "success");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[15px] text-[#6B7280]">Loading your account...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold text-[#0A0A0A] mb-2 tracking-tight">
          Account
        </h1>
        <p className="text-[15px] text-[#6B7280] leading-relaxed">
          Manage your client account settings
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow"
              placeholder="Your name"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Company / Brand Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow"
              placeholder="Optional"
            />
            <p className="text-xs text-[#6B7280] mt-1.5">
              Used for invoices and business communications
            </p>
          </div>

          {/* Email (read-only) */}
          <div className="pt-2">
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Email
            </label>
            <input
              type="email"
              value={me?.email || ""}
              disabled
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm bg-[#FAFAFA] text-[#6B7280] cursor-not-allowed"
            />
            <p className="text-xs text-[#6B7280] mt-1.5">
              Contact support to change your email address
            </p>
          </div>

          {/* Account Type */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-3">
              Account Type
            </label>
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#F3E8FF] text-[#7C3AED] rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Client Account
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="/orders"
          className="group p-5 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#0A0A0A]">My Orders</span>
          </div>
          <p className="text-sm text-[#6B7280] pl-[52px]">View and track all your orders</p>
        </a>

        <a
          href="/contact"
          className="group p-5 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#0A0A0A]">Support</span>
          </div>
          <p className="text-sm text-[#6B7280] pl-[52px]">Get help with your orders</p>
        </a>
      </div>
    </div>
  );
}
