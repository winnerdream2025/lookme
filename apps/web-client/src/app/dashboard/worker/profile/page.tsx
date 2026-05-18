"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";
import type { Me } from "@/lib/types";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function WorkerProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "any">("any");

  useEffect(() => {
    apiGet<Me>("/auth/me")
      .then((data) => {
        setMe(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setGender((data.gender as "male" | "female" | "any") || "any");
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
    setSuccess("");
    setSaving(true);

    try {
      await apiPatch("/auth/profile", { name, gender });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[15px] text-[#6B7280]">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0A0A0A] mb-2">Worker Profile</h1>
        <p className="text-[15px] text-[#6B7280]">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm bg-[#FAFAFA] text-[#6B7280] cursor-not-allowed"
            />
            <p className="text-xs text-[#6B7280] mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-3">
              Gender Preference
            </label>
            <p className="text-xs text-[#6B7280] mb-3">
              This helps match you with appropriate tasks
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "male", label: "Male", emoji: "👨" },
                { value: "female", label: "Female", emoji: "👩" },
                { value: "any", label: "Any", emoji: "👤" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGender(option.value as "male" | "female" | "any")}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    gender === option.value
                      ? "border-[#2563EB] bg-[#DBEAFE]"
                      : "border-[#E5E7EB] hover:border-[#6B7280]"
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-sm font-semibold">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Role Badge */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              Account Type
            </label>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] text-[#2563EB] rounded-lg text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Worker Account
            </div>
          </div>

          {error && <ErrorBanner message={error} />}
          
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full h-11 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-6 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl">
        <h3 className="text-sm font-semibold text-[#0A0A0A] mb-2">Need Help?</h3>
        <p className="text-sm text-[#6B7280] mb-3">
          If you need to change your email or have other account issues, please contact support.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]"
        >
          Contact Support
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
