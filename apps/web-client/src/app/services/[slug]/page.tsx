"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiGuestPost } from "@/lib/api";
import { ReferenceImageUpload } from "@/components/ui/ReferenceImageUpload";
import { SERVICE_MAP, SERVICE_CLASSES, type ServicePackage } from "@/lib/services";

// ─── Review order constants ───────────────────────────────────────────────────

const REVIEW_QTY_PRESETS = [5, 10, 25, 50, 100, 200, 500];

const GENDER_OPTIONS = [
  { value: "FEMALE", emoji: "♀", label: "Female", hint: "Hair salons, nail spas, waxing..." },
  { value: "ANY", emoji: "⚥", label: "Both", hint: "Most businesses (recommended)" },
  { value: "MALE", emoji: "♂", label: "Male", hint: "Barbershops, gyms, whiskey bars..." },
] as const;

const REVIEW_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "cs", name: "Czech" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "tl", name: "Filipino" },
  { code: "he", name: "Hebrew" },
  { code: "el", name: "Greek" },
  { code: "uk", name: "Ukrainian" },
] as const;

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
] as const;


export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const service = SERVICE_MAP.get(slug);
  const serviceClassDef = service ? SERVICE_CLASSES.find((c) => c.id === service.serviceClass) : null;
  const isReviewService = service?.category === "reviews";

  // ── Non-review state ──────────────────────────────────────────────────────
  const [selected, setSelected] = useState<ServicePackage | null>(
    service?.packages.find((p) => p.popular) ?? service?.packages[1] ?? null
  );

  // ── Review form state (always defined — rules of hooks) ───────────────────
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState("");
  const [businessUrl, setBusinessUrl] = useState("");
  const [businessCountry, setBusinessCountry] = useState("US");
  const [qty, setQty] = useState(REVIEW_QTY_PRESETS[1]);
  const [useCustomQty, setUseCustomQty] = useState(false);
  const [customQtyStr, setCustomQtyStr] = useState("");
  const [requiredGender, setRequiredGender] = useState<"FEMALE" | "ANY" | "MALE">("ANY");
  const [reviewLanguage, setReviewLanguage] = useState("en");
  const reviewConfig = service?.reviewConfig;
  const [reviewRating, setReviewRating] = useState<number>(
    service?.reviewConfig?.starOptions[0] ?? 5
  );
  const [instructions, setInstructions] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const finalQty = useCustomQty ? (parseInt(customQtyStr) || 0) : qty;
  const pricePerUnit = service ? service.packages[0].price / service.packages[0].qty : 0;
  const totalPrice = (finalQty * pricePerUnit).toFixed(2);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalQty < 1) { setOrderError("Please enter a valid quantity."); return; }
    if (!businessUrl.trim()) { setOrderError("Please enter your business profile URL."); return; }
    if (!guestEmail.trim()) { setOrderError("Please enter your email address."); return; }
    setOrderLoading(true);
    setOrderError("");
    try {
      const data = await apiGuestPost<{ trackingToken: string }>("/orders/guest", {
        serviceTypeId: service!.slug,
        quantity: finalQty,
        targetUrl: businessUrl.trim(),
        guestEmail: guestEmail.trim(),
        businessName: businessName.trim() || undefined,
        businessCountry,
        requiredGender,
        reviewRating,
        reviewLanguage,
        instructions: instructions.trim() || undefined,
        referenceImageUrl: referenceImageUrl || undefined,
      });
      router.push(`/order-confirm?token=${data.trackingToken}`);
    } catch (err: any) {
      setOrderError(err.message || "Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-4xl font-bold text-slate-100 mb-3">Service not found</p>
        <p className="text-slate-400 mb-6">
          The service you&apos;re looking for doesn&apos;t exist or has been renamed.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center h-12 px-8 bg-primary-600 text-white text-base font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
        >
          Browse all services
        </Link>
      </div>
    );
  }

  const checkoutUrl = selected
    ? `/order-review?service=${service.slug}&qty=${selected.qty}&price=${selected.price}`
    : `/order-review?service=${service.slug}`;

  /* ── Shared input classes — 16px base, dark glass, focus ring ── */
  const inputCls = "w-full h-12 px-4 text-base rounded-xl bg-[rgba(15,23,42,0.5)] border border-white/[0.08] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all";
  const selectCls = `${inputCls} appearance-none`;
  const selectArrow = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' } as const;
  const labelCls = "block text-sm font-semibold text-slate-300 mb-2";
  const hintCls = "text-xs text-slate-500 mt-1.5";
  const errorCls = "text-xs font-medium text-danger-400 bg-danger-500/10 border border-danger-500/20 rounded-xl px-4 py-2.5";

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
        <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
        <span className="text-slate-700">/</span>
        <Link href="/pricing" className="hover:text-slate-300 transition-colors">Services</Link>
        {serviceClassDef && (
          <>
            <span className="text-slate-700">/</span>
            <Link
              href={`/pricing?class=${service.serviceClass}`}
              className="hover:text-slate-300 transition-colors"
            >
              {serviceClassDef.label}
            </Link>
          </>
        )}
        <span className="text-slate-700">/</span>
        <span className="text-slate-200">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10">

        {/* LEFT: Service Info */}
        <div>
          {/* Platform badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] text-sm font-medium mb-5">
            <span className="text-slate-200">{service.platform}</span>
            <span className="text-slate-600">·</span>
            <span className="capitalize text-slate-400">{service.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50 mb-3">
            {service.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-6">
            {service.longDescription}
          </p>

          {/* Live Stats */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 p-4 rounded-2xl border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="font-semibold text-slate-100">{service.stats.purchasedToday}</span>
              <span className="text-slate-400">ordered today</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/[0.08]" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-100 font-semibold">{service.stats.fiveStarReviews.toLocaleString()}</span>
              <span className="text-slate-400">five-star reviews</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/[0.08]" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-100 font-semibold">{service.stats.repeatPurchasers.toLocaleString()}</span>
              <span className="text-slate-400">repeat customers</span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              What&apos;s included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-success-500 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
              How it works
            </h2>
            <div className="space-y-5">
              {[
                { n: "1", title: "Choose a package", desc: "Select the quantity that fits your goal from the options on the right." },
                { n: "2", title: "Enter your details", desc: `Provide your ${service.platform} profile or content URL and your email — no account or password needed.` },
                { n: "3", title: "Receive your order", desc: `Delivery starts ${service.deliveryTime.toLowerCase()}. Track progress in real time.` },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 text-sm mb-0.5">{s.title}</div>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {service.faq.map((item) => (
                <div key={item.q} className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-4">
                  <p className="font-semibold text-slate-100 text-sm mb-1.5">{item.q}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Review form OR package selector */}
        <div>
          <div className="sticky top-6">

            {isReviewService ? (
              <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-white/[0.08] bg-[rgba(15,23,42,0.6)] backdrop-blur-xl overflow-hidden shadow-2xl">

                {/* Step progress bar */}
                <div className="flex border-b border-white/[0.06]">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { if (s < step || (s === 2 && businessUrl)) setStep(s as 1 | 2 | 3); }}
                      className={`flex-1 py-3.5 text-xs font-bold tracking-wide transition-colors ${
                        step === s
                          ? "bg-primary-600 text-white"
                          : s < step
                          ? "bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]"
                          : "bg-transparent text-slate-600 cursor-default"
                      }`}
                    >
                      {s === 1 ? "① Business" : s === 2 ? "② Package" : "③ Confirm"}
                    </button>
                  ))}
                </div>

                <div className="p-5 sm:p-6 space-y-4">

                  {/* ── STEP 1: Business details ── */}
                  {step === 1 && (
                    <>
                      <div>
                        <p className="text-base font-bold text-slate-100 mb-0.5">Tell us about your business</p>
                        <p className="text-xs text-slate-500">We use this to match reviewers who know your area.</p>
                      </div>

                      <div>
                        <label className={labelCls}>Business Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Mary's Hair Studio"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>
                          {reviewConfig?.urlLabel ?? "Business Profile Link"} <span className="text-danger-400">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          placeholder={reviewConfig?.urlPlaceholder ?? "https://..."}
                          value={businessUrl}
                          onChange={(e) => setBusinessUrl(e.target.value)}
                          className={inputCls}
                        />
                        <p className={hintCls}>{reviewConfig?.urlHint ?? "Paste your business profile link here."}</p>
                      </div>

                      {reviewConfig?.hasCountry && (
                      <div>
                        <label className={labelCls}>Business Country</label>
                        <select
                          value={businessCountry}
                          onChange={(e) => setBusinessCountry(e.target.value)}
                          className={selectCls}
                          style={selectArrow}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                          ))}
                        </select>
                        <p className={hintCls}>We assign reviewers from matching locations when possible.</p>
                      </div>
                      )}

                      <button
                        type="button"
                        onClick={() => { if (!businessUrl.trim()) { setOrderError("Please enter your business profile link."); return; } setOrderError(""); setStep(2); }}
                        className="w-full h-12 rounded-full bg-primary-600 text-white text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 active:scale-[0.98]"
                      >
                        Continue
                      </button>
                      {orderError && <p className={errorCls}>{orderError}</p>}
                    </>
                  )}

                  {/* ── STEP 2: Package + gender ── */}
                  {step === 2 && (
                    <>
                      <div>
                        <p className="text-base font-bold text-slate-100 mb-0.5">How many reviews?</p>
                        <p className="text-xs text-slate-500">Each review is written by a real person from a real account.</p>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {REVIEW_QTY_PRESETS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => { setQty(q); setUseCustomQty(false); setCustomQtyStr(""); }}
                            className={`h-10 rounded-full border text-sm font-semibold transition-all ${
                              !useCustomQty && qty === q
                                ? "border-primary-500 bg-primary-600 text-white"
                                : "border-white/[0.1] text-slate-300 hover:bg-white/[0.06]"
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setUseCustomQty(true)}
                          className={`h-10 rounded-full border text-sm font-semibold transition-all col-span-4 ${
                            useCustomQty
                              ? "border-primary-500 bg-primary-500/10 text-primary-300"
                              : "border-dashed border-white/[0.12] text-slate-500 hover:border-white/[0.2]"
                          }`}
                        >
                          Custom quantity
                        </button>
                      </div>

                      {useCustomQty && (
                        <input
                          type="number"
                          min={1}
                          max={10000}
                          placeholder="Enter number of reviews"
                          value={customQtyStr}
                          onChange={(e) => setCustomQtyStr(e.target.value)}
                          className={inputCls}
                          autoFocus
                        />
                      )}

                      {finalQty > 0 && (
                        <div className="flex items-center justify-between p-3.5 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                          <span className="text-sm text-primary-300">{finalQty} reviews × ${pricePerUnit.toFixed(2)}</span>
                          <span className="font-bold text-primary-200 text-lg">${totalPrice}</span>
                        </div>
                      )}

                      {/* Review language — stacks on mobile */}
                      <div>
                        <label className={labelCls}>
                          Review Language <span className="text-danger-400">*</span>
                        </label>
                        <select value={reviewLanguage} onChange={(e) => setReviewLanguage(e.target.value)} className={selectCls} style={selectArrow}>
                          {REVIEW_LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                          ))}
                        </select>
                        <p className={hintCls}>Every reviewer will write in this language.</p>
                      </div>

                      {/* Reviewer gender */}
                      <div>
                        <label className={labelCls}>Reviewer Gender Preference</label>
                        <div className="grid grid-cols-3 gap-2">
                          {GENDER_OPTIONS.map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => setRequiredGender(g.value)}
                              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all ${
                                requiredGender === g.value
                                  ? "border-primary-500 bg-primary-600 text-white"
                                  : "border-white/[0.1] text-slate-400 hover:border-white/[0.2]"
                              }`}
                            >
                              <span className="text-lg leading-none">{g.emoji}</span>
                              <span>{g.label}</span>
                            </button>
                          ))}
                        </div>
                        <p className={hintCls}>
                          {GENDER_OPTIONS.find((g) => g.value === requiredGender)?.hint}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 h-12 rounded-full border border-white/[0.1] text-slate-300 text-base font-semibold hover:bg-white/[0.06] transition-colors">
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (finalQty < 1) { setOrderError("Please choose a quantity."); return; } setOrderError(""); setStep(3); }}
                          className="flex-[2] h-12 rounded-full bg-primary-600 text-white text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 active:scale-[0.98]"
                        >
                          Continue
                        </button>
                      </div>
                      {orderError && <p className={errorCls}>{orderError}</p>}
                    </>
                  )}

                  {/* ── STEP 3: Confirm + email ── */}
                  {step === 3 && (
                    <>
                      <div>
                        <p className="text-base font-bold text-slate-100 mb-0.5">Almost done!</p>
                        <p className="text-xs text-slate-500">Review your order and enter your email to receive your tracking link.</p>
                      </div>

                      {/* Order summary */}
                      <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Business</span>
                          <span className="font-medium text-slate-200 truncate max-w-[180px]">{businessName || businessUrl}</span>
                        </div>
                        {reviewConfig?.hasCountry && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Country</span>
                          <span className="font-medium text-slate-200">{COUNTRIES.find((c) => c.code === businessCountry)?.flag} {COUNTRIES.find((c) => c.code === businessCountry)?.name}</span>
                        </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reviews</span>
                          <span className="font-medium text-slate-200">{finalQty} × {"★".repeat(reviewRating)} ({reviewRating} {reviewConfig?.starsLabel ?? "Stars"})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reviewers</span>
                          <span className="font-medium text-slate-200">{GENDER_OPTIONS.find((g) => g.value === requiredGender)?.emoji} {GENDER_OPTIONS.find((g) => g.value === requiredGender)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Language</span>
                          <span className="font-medium text-slate-200">{REVIEW_LANGUAGES.find((l) => l.code === reviewLanguage)?.name}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/[0.08] pt-2.5 font-bold text-base">
                          <span className="text-slate-200">Total</span>
                          <span className="text-gradient">${totalPrice}</span>
                        </div>
                      </div>

                      {(reviewConfig?.starOptions?.length ?? 0) > 1 && (
                      <div>
                        <label className={labelCls}>{reviewConfig?.starsLabel ?? "Star Rating"}</label>
                        <div className="flex gap-2">
                          {(reviewConfig?.starOptions ?? [5, 4]).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setReviewRating(r)}
                              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                reviewRating === r
                                  ? "border-amber-400 bg-amber-500/10 text-amber-300"
                                  : "border-white/[0.1] text-slate-400 hover:border-amber-400/50"
                              }`}
                            >
                              {"★".repeat(r)} {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      )}

                      <div>
                        <label className={labelCls}>
                          Special Instructions <span className="text-slate-600 font-normal">(optional)</span>
                        </label>
                        <textarea
                          placeholder="e.g. Mention our lash extensions and kind staff..."
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          rows={3}
                          className={`${inputCls} h-auto py-3 resize-none`}
                        />
                      </div>

                      <ReferenceImageUpload
                        theme="dark"
                        onChange={setReferenceImageUrl}
                        label="Reference image (optional)"
                        hint="Upload a screenshot or photo to help workers understand exactly what you need."
                      />

                      <div>
                        <label className={labelCls}>
                          Your Email <span className="text-danger-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className={inputCls}
                        />
                        <p className={hintCls}>We&apos;ll send your order tracking link here.</p>
                      </div>

                      {orderError && <p className={errorCls}>{orderError}</p>}

                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => setStep(2)} className="flex-1 h-12 rounded-full border border-white/[0.1] text-slate-300 text-base font-semibold hover:bg-white/[0.06] transition-colors">
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={orderLoading}
                          className="flex-[2] h-12 rounded-full bg-primary-600 text-white text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50"
                        >
                          {orderLoading ? "Placing order..." : `Order ${finalQty} Reviews — $${totalPrice}`}
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 text-center">
                        No account required · Secure payment via Stripe
                      </p>
                    </>
                  )}

                </div>
              </form>

            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[rgba(15,23,42,0.6)] backdrop-blur-xl p-6 shadow-2xl">
                <h2 className="font-bold text-slate-100 text-lg mb-1">Choose a package</h2>
                <p className="text-sm text-slate-500 mb-5">Delivery: {service.deliveryTime}</p>

                <div className="space-y-2.5 mb-6">
                  {service.packages.map((pkg) => (
                    <button
                      key={pkg.qty}
                      onClick={() => setSelected(pkg)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-base transition-all ${
                        selected?.qty === pkg.qty
                          ? "border-primary-500 bg-primary-600 text-white"
                          : "border-white/[0.1] hover:border-white/[0.2] text-slate-200 bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected?.qty === pkg.qty ? "border-white" : "border-slate-600"}`}>
                          {selected?.qty === pkg.qty && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div className="text-left">
                          <span className="font-semibold">{pkg.qty.toLocaleString()} {service.category}</span>
                          <span className={`ml-2 text-xs ${selected?.qty === pkg.qty ? "text-white/60" : "text-slate-500"}`}>{pkg.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pkg.popular && selected?.qty !== pkg.qty && (
                          <span className="text-xs px-2 py-0.5 bg-primary-500/15 text-primary-300 rounded-md font-bold">Popular</span>
                        )}
                        <span className="font-bold">${pkg.price}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selected && (
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 mb-5">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{selected.qty.toLocaleString()} {service.category}</span>
                      <span className="font-semibold text-slate-200">${selected.price}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Delivery</span>
                      <span>{service.deliveryTime.split(",")[0]}</span>
                    </div>
                  </div>
                )}

                <Link
                  href={checkoutUrl}
                  className="w-full inline-flex items-center justify-center h-12 rounded-full bg-primary-600 text-white text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 active:scale-[0.98]"
                >
                  Order {selected ? `${selected.qty.toLocaleString()} ${service.name}` : service.name} — ${selected?.price ?? ""}
                  <span aria-hidden className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">→</span>
                </Link>
                <p className="text-xs text-slate-500 text-center mt-3">No account required · Secure payment via Stripe</p>
              </div>
            )}

          </div>
        </div>

        </div>

      </div>
    </div>
  );
}
