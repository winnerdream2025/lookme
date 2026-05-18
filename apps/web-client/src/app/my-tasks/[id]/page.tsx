"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost, apiUpload } from "@/lib/api";
import { session } from "@/lib/auth";
import type { TaskItem } from "@/lib/types";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { SecureMediaPlayer } from "@/components/worker/SecureMediaPlayer";

/* ─── Countdown hook ─────────────────────────────────────────── */
function useCountdown(target: string | undefined) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const ms = new Date(target).getTime() - Date.now();
      setLeft(Math.max(0, ms));
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { left, text: `${m}m ${s.toString().padStart(2, "0")}s`, expired: left <= 0 };
}

/* ─── Copy-to-clipboard helper ───────────────────────────────── */
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text visually
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <rect x="6" y="6" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {label ?? "Copy link"}
        </>
      )}
    </button>
  );
}

/* ─── Platform-specific how-to guides ──────────────────────────── */
function getPlatformGuide(task: TaskItem): { title: string; steps: string[]; tips: string[] } {
  const p = (task.platformName || "").toLowerCase();

  if (task.isReview) {
    if (p.includes("google")) {
      return {
        title: "How to leave a Google Business review",
        steps: [
          "Click the Copy link button above and open it in your browser (Chrome works best).",
          "Sign in with your Google account. Use a real, aged account for best results.",
          "Find the 'Write a review' button on the business page.",
          "Select the required star rating and write an honest, detailed review.",
          "Add a photo if possible — reviews with photos look more authentic.",
          "Submit the review and wait for it to appear publicly.",
          "Take a screenshot of your published review as proof.",
        ],
        tips: [
          "Do NOT copy-paste the suggested text exactly. Rewrite it in your own words.",
          "Use an account that already has review history. Brand-new accounts are often filtered.",
          "Write at least 2–3 sentences. One-word reviews get removed by Google.",
        ],
      };
    }
    if (p.includes("yelp")) {
      return {
        title: "How to leave a Yelp review",
        steps: [
          "Copy the business link and open it in your browser.",
          "Sign in to your Yelp account (or create one if needed).",
          "Click 'Write a Review' on the business page.",
          "Select the star rating and write your review.",
          "Add photos if you have them — they increase credibility.",
          "Submit and wait for the review to go live.",
          "Screenshot the published review page.",
        ],
        tips: [
          "Yelp filters new accounts aggressively. Use an account with at least 5+ existing reviews.",
          "Avoid copy-pasting exact text — rewrite naturally.",
          "Check-in to the business first if possible, then review.",
        ],
      };
    }
    if (p.includes("facebook")) {
      return {
        title: "How to leave a Facebook recommendation",
        steps: [
          "Open the business page link in your browser.",
          "Sign in to Facebook with a real, active account.",
          "Go to the Reviews / Recommendations tab.",
          "Select the star rating and write your recommendation.",
          "Submit and take a screenshot of the published recommendation.",
        ],
        tips: [
          "Use an account with real friends and activity.",
          "Recommendations with photos and check-ins look more natural.",
        ],
      };
    }
    if (p.includes("trustpilot")) {
      return {
        title: "How to leave a Trustpilot review",
        steps: [
          "Copy and open the company review page link.",
          "Sign in to Trustpilot (or create an account with a real email).",
          "Click 'Write a review' and select the star rating.",
          "Write a detailed, natural-sounding review.",
          "Submit and wait for it to appear.",
          "Screenshot your published review.",
        ],
        tips: [
          "Trustpilot verifies emails. Use a real email you can confirm.",
          "Longer reviews (100+ words) with specific details rank higher.",
        ],
      };
    }
    if (p.includes("styleseat") || p.includes("booksy")) {
      return {
        title: `How to leave a ${task.platformName} review`,
        steps: [
          `Download the ${task.platformName} app from the App Store or Google Play if you don't have it.`,
          "Create an account with a real email and phone number.",
          "Search for the business/profile using the link provided.",
          "Book a mock appointment or go straight to the Reviews section.",
          "Leave the required star rating and write your review.",
          "Submit and screenshot the published review.",
        ],
        tips: [
          "These platforms detect fake accounts. Use a real phone number for verification.",
          "Fill out a simple profile (name, photo) before reviewing.",
        ],
      };
    }
    // Generic review guide
    return {
      title: `How to leave a review on ${task.platformName}`,
      steps: [
        "Copy the business link and open it in your browser or app.",
        "Sign in with a real, active account.",
        "Find the review section and select the required star rating.",
        "Write a natural, detailed review in your own words.",
        "Submit the review and wait for it to appear publicly.",
        "Take a screenshot of the published review as proof.",
      ],
      tips: [
        "Never copy-paste the suggested text exactly. Rewrite it naturally.",
        "Use aged accounts with existing activity. New accounts get filtered.",
        "Add a photo to your review when possible — it increases credibility.",
      ],
    };
  }

  // Non-review tasks
  if (task.categoryName === "followers" || task.categoryName === "subscribers") {
    return {
      title: `How to follow / subscribe on ${task.platformName}`,
      steps: [
        `Open the profile link in your browser or the ${task.platformName} app.`,
        "Sign in with your real account.",
        "Click the Follow / Subscribe button.",
        "Wait a few seconds to ensure the action is saved.",
        "Take a screenshot showing you are now following/subscribed.",
      ],
      tips: [
        "Do NOT unfollow immediately after. The account owner checks retention.",
        "Use an account with a real profile photo and some activity.",
      ],
    };
  }
  if (task.categoryName === "likes") {
    return {
      title: `How to like on ${task.platformName}`,
      steps: [
        `Open the post/video link in your browser or the ${task.platformName} app.`,
        "Sign in with your real account.",
        "Click the Like / Heart / Thumbs Up button.",
        "Wait a few seconds to ensure the action is saved.",
        "Take a screenshot showing your like is active.",
      ],
      tips: [
        "Do NOT unlike immediately after. The account owner checks retention.",
        "Some platforms hide likes from private accounts. Make sure yours is public.",
      ],
    };
  }
  if (task.categoryName === "views") {
    return {
      title: `How to watch / view on ${task.platformName}`,
      steps: [
        `The secure player will load inside this page \u2014 press \u201cStart Watching\u201d below.`,
        "Watch for the required time. Do NOT pause, mute, or switch tabs \u2014 the timer pauses.",
        "Once the timer completes, your task is submitted automatically.",
      ],
      tips: [
        "Platforms detect fake views by watch time. Stay active and engaged.",
        "Do NOT refresh the page \u2014 your session will be lost.",
      ],
    };
  }
  if (task.categoryName === "streams") {
    return {
      title: `How to stream on ${task.platformName}`,
      steps: [
        "Press \u201cStart Watching\u201d to load the secure player inside this page.",
        "Let the track play for the required duration. Do NOT skip or mute.",
        "Once the timer completes, your task is submitted automatically.",
      ],
      tips: [
        "Spotify counts streams after 30 seconds of play. Do NOT skip early.",
        "Streaming from multiple accounts on the same device is detected.",
      ],
    };
  }
  if (task.categoryName === "traffic") {
    return {
      title: "How to visit a website",
      steps: [
        "Press \u201cStart Watching\u201d to open the website in the secure player.",
        "Let the page fully load and stay active for the required duration.",
        "Once the timer completes, your task is submitted automatically.",
      ],
      tips: [
        "Use a real browser (Chrome, Safari, Firefox). Incognito mode is fine.",
        "Do NOT use VPNs or proxies \u2014 the site owner may filter those.",
      ],
    };
  }

  // Generic fallback
  return {
    title: `How to complete this task on ${task.platformName}`,
    steps: [
      "Copy the target link and open it in your browser or app.",
      "Sign in with your real, active account.",
      "Follow the instructions carefully and complete the required action.",
      "Take a screenshot or copy the proof link showing you completed the task.",
    ],
    tips: [
      "Always use real accounts with activity history.",
      "Never undo the action immediately after completing it.",
    ],
  };
}

/* ... */

/* ─── Requirements checklist per task type ─────────────────────── */
function getRequirements(task: TaskItem): string[] {
  const reqs: string[] = [];
  if (task.isReview) {
    reqs.push("Use a real, aged account with existing activity");
    reqs.push("Write the review in your own words — do NOT copy-paste");
    if (task.reviewLanguage) reqs.push(`Write the review in: ${task.reviewLanguage}`);
    if (task.reviewRating) reqs.push(`Leave exactly a ${task.reviewRating}-star review`);
    if (task.reviewContent) reqs.push("Incorporate the suggested themes naturally");
    reqs.push("Take a screenshot of the published review as proof");
    reqs.push("Do NOT delete the review after submission");
  } else if (task.categoryName === "followers" || task.categoryName === "subscribers") {
    reqs.push("Follow / Subscribe using a real account");
    reqs.push("Keep the follow active — do NOT unfollow immediately");
    reqs.push("Screenshot your following list showing the account");
  } else if (task.categoryName === "likes") {
    reqs.push("Like the post/video using a real account");
    reqs.push("Do NOT unlike after submitting proof");
    reqs.push("Screenshot showing your like is active");
  } else if (task.categoryName === "views") {
    reqs.push("Watch the video using the secure in-page player");
    reqs.push("Do NOT pause, mute, or switch tabs — the timer pauses");
    reqs.push("Submission is automatic when the timer completes — no screenshot needed");
  } else if (task.categoryName === "streams") {
    reqs.push("Stream the track using the secure in-page player");
    reqs.push("Do NOT skip or mute — the timer pauses");
    reqs.push("Submission is automatic when the timer completes — no screenshot needed");
  } else if (task.categoryName === "traffic") {
    reqs.push("Visit the website using the secure in-page player");
    reqs.push("Stay active for the required duration — do not close the player");
    reqs.push("Submission is automatic when the timer completes — no screenshot needed");
  } else {
    reqs.push("Complete the required action carefully");
    reqs.push("Use a real account with activity history");
    reqs.push("Provide clear proof of completion");
  }
  return reqs;
}

/* ─── Proof form labels per task type ────────────────────────── */
function getProofLabels(task: TaskItem): { urlLabel: string; urlPlaceholder: string; textLabel: string; textPlaceholder: string } {
  if (task.isReview) {
    return {
      urlLabel: "Screenshot or review link",
      urlPlaceholder: "https://imgur.com/your-screenshot or direct review URL",
      textLabel: "Review details",
      textPlaceholder: "e.g., Posted 4-star review as john.doe@gmail.com on May 6. Review text: 'Great service, friendly staff...'",
    };
  }
  if (task.categoryName === "followers" || task.categoryName === "subscribers") {
    return {
      urlLabel: "Screenshot or profile link showing follow",
      urlPlaceholder: "https://imgur.com/your-screenshot or your profile URL",
      textLabel: "Account username used",
      textPlaceholder: "e.g., Followed as @johndoe2024 using Instagram account johndoe2024",
    };
  }
  if (task.categoryName === "likes") {
    return {
      urlLabel: "Screenshot showing your like",
      urlPlaceholder: "https://imgur.com/your-screenshot",
      textLabel: "Account username used",
      textPlaceholder: "e.g., Liked as @johndoe2024. Screenshot shows active like on the post.",
    };
  }
  if (task.categoryName === "views" || task.categoryName === "streams") {
    return {
      urlLabel: "Screenshot of watch history or view count",
      urlPlaceholder: "https://imgur.com/your-screenshot",
      textLabel: "Details",
      textPlaceholder: "e.g., Watched full video (2:15) as johndoe2024. Screenshot from watch history.",
    };
  }
  if (task.categoryName === "traffic") {
    return {
      urlLabel: "Screenshot showing you on the website",
      urlPlaceholder: "https://imgur.com/your-screenshot",
      textLabel: "Details",
      textPlaceholder: "e.g., Visited site for 45 seconds, browsed 2 pages. Screenshot from browser.",
    };
  }
  return {
    urlLabel: "Proof URL (screenshot, profile link, etc.)",
    urlPlaceholder: "https://imgur.com/abc123 or https://yourprofile.com",
    textLabel: "Description",
    textPlaceholder: "e.g., What you did and which account you used.",
  };
}

/* ─── Checklist component ────────────────────────────────────── */
function Checklist({ items, onAllChecked }: { items: string[]; onAllChecked?: (done: boolean) => void }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const allChecked = items.every((_, i) => checked[i]);
  useEffect(() => { onAllChecked?.(allChecked); }, [allChecked, onAllChecked]);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <label key={i} className="flex items-start gap-3 cursor-pointer group">
          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
            checked[i] ? "bg-blue-600 border-blue-600" : "border-[#D1D5DB] group-hover:border-blue-400"
          }`}>
            {checked[i] && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={!!checked[i]}
            onChange={(e) => setChecked((prev) => ({ ...prev, [i]: e.target.checked }))}
          />
          <span className={`text-sm transition-colors ${checked[i] ? "text-[#9CA3AF] line-through" : "text-[#374151]"}`}>
            {item}
          </span>
        </label>
      ))}
      {allChecked && (
        <p className="text-sm text-emerald-700 font-semibold pt-1">All requirements checked — you are ready to submit proof.</p>
      )}
    </div>
  );
}

/* ... */

/* ─── Step indicator ─────────────────────────────────────────── */
function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
              i < current ? "bg-emerald-500 text-white"
              : i === current ? "bg-blue-600 text-white"
              : "bg-white text-[#9CA3AF] border border-[#E5E7EB]"
            }`}>
              {i < current ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`hidden sm:block text-xs font-semibold ${
              i === current ? "text-[#111827]" : i < current ? "text-emerald-600" : "text-[#9CA3AF]"
            }`}>
              {label}
            </span>
            {/* Mobile: only show current label */}
            {i === current && (
              <span className="sm:hidden text-xs font-semibold text-[#111827]">{label}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 min-w-[16px] sm:min-w-[24px] ${
              i < current ? "bg-emerald-400" : "bg-[#E5E7EB]"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function TaskWorkPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  // UI step: 0=instructions, 1=training/acknowledgment, 2=submit proof
  const [step, setStep] = useState(0);
  // Accept flow
  const [accepting, setAccepting] = useState(false);
  const [acceptEmail, setAcceptEmail] = useState("");
  const [acceptError, setAcceptError] = useState("");
  // Media session (for view/traffic tasks with requiresTimer)
  const [mediaSessionToken, setMediaSessionToken] = useState<string | null>(null);
  const [mediaWatchedSeconds, setMediaWatchedSeconds] = useState(0);
  const [mediaSessionLoading, setMediaSessionLoading] = useState(false);

  const timer = useCountdown(task?.expiresAt);

  useEffect(() => {
    if (!session.isAuthenticated) { router.push("/login"); return; }
    apiGet<TaskItem>(`/tasks/${id}`)
      .then((d) => setTask(d))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const buildDeviceFingerprint = () => {
    try {
      const raw = [
        navigator.userAgent,
        `${screen.width}x${screen.height}`,
        navigator.language,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        String(navigator.hardwareConcurrency ?? ""),
      ].join("|");
      return btoa(raw);
    } catch {
      return "unknown";
    }
  };

  const handleAccept = async () => {
    if (!task) return;
    if (task.isReview && !acceptEmail.trim()) {
      setAcceptError("Please enter the Gmail address you will use to post this review.");
      return;
    }
    setAccepting(true);
    setAcceptError("");
    try {
      await apiPost("/tasks/accept", {
        taskId: id,
        deviceFingerprint: buildDeviceFingerprint(),
        ...(task.isReview && acceptEmail.trim() ? { workerEmail: acceptEmail.trim() } : {}),
      });
      const updated = await apiGet<TaskItem>(`/tasks/${id}`);
      setTask(updated);
    } catch (err: unknown) {
      setAcceptError(err instanceof Error ? err.message : "Failed to accept task. It may have been taken.");
    } finally {
      setAccepting(false);
    }
  };

  const handleStartMediaSession = async () => {
    if (!task) return;
    setMediaSessionLoading(true);
    try {
      const result = await apiPost<{ sessionToken: string; requiredSeconds: number; mediaType: string }>(
        "/tasks/media-session",
        { taskId: id }
      );
      setMediaSessionToken(result.sessionToken);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start media session");
    } finally {
      setMediaSessionLoading(false);
    }
  };

  const handleMediaComplete = async (watchedSeconds: number) => {
    setMediaWatchedSeconds(watchedSeconds);
    // Timer tasks: HMAC session IS the proof — auto-submit now, no screenshot needed
    if (task?.requiresTimer && mediaSessionToken) {
      setSubmitting(true);
      setError("");
      try {
        await apiPost("/tasks/submit", {
          taskId: id,
          mediaSessionToken,
          duration: watchedSeconds,
        });
        const updated = await apiGet<TaskItem>(`/tasks/${id}`);
        setTask(updated);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Submit failed");
        setStep(1);
      } finally {
        setSubmitting(false);
      }
    } else {
      setStep(2);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }
    setError("");
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotFile) {
      setError("Please upload a screenshot image.");
      return;
    }
    setSubmitting(true);
    setUploading(true);
    setError("");
    try {
      const { url } = await apiUpload<{ url: string }>("/tasks/upload-screenshot", screenshotFile);
      await apiPost("/tasks/submit", { taskId: id, screenshotUrl: url });
      const updated = await apiGet<TaskItem>(`/tasks/${id}`);
      setTask(updated);
      setStep(0);
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (loading) return <FullPageSpinner label="Loading task…" />;
  if (!task) return <ErrorBanner message="Task not found." />;

  const isAvailable = task.status === "AVAILABLE";
  const isActive = task.status === "ASSIGNED";
  const isSubmitted = task.status === "SUBMITTED";
  const isPaid = task.status === "PAID";
  const isRejected = task.status === "REJECTED";

  const guide = getPlatformGuide(task);
  const requirements = getRequirements(task);
  const proofLabels = getProofLabels(task);

  // For submitted/paid/rejected, show a read-only summary
  const isReadOnly = isSubmitted || isPaid || isRejected;

  return (
    <div className="min-h-full bg-[#F6F5F3] px-4 sm:px-6 py-6 sm:py-8">
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/my-tasks"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          My Tasks
        </Link>
      </div>

      {/* ─── Task Header Card ─────────────────────────────────── */}
      <div className="border border-[#E5E7EB] rounded-2xl bg-white shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
            {task.categoryName}
          </span>
          <span className="text-xs text-neutral-400">{task.platformName}</span>
          {task.isReview && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Review
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            isActive ? "bg-blue-50 text-blue-700 border-blue-200"
            : isSubmitted ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : isPaid ? "bg-green-50 text-green-700 border-green-200"
            : isAvailable ? "bg-[#F6F5F3] text-[#374151] border-[#E5E7EB]"
            : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {isAvailable ? "Available" : isActive ? "In Progress" : isSubmitted ? "Awaiting Review" : isPaid ? "Completed & Paid" : "Rejected"}
          </span>
        </div>

        <h1 className="text-xl font-bold text-neutral-900 mb-1">{task.serviceName}</h1>

        {/* Target URL with copy button */}
        {task.targetUrl && (
          <div className="flex items-start gap-3 mt-3 p-3 bg-neutral-50 border border-neutral-100 rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Target Link</p>
              <p className="text-sm text-neutral-700 truncate font-mono">{task.targetUrl}</p>
            </div>
            <CopyButton text={task.targetUrl} />
          </div>
        )}

        {/* Timer & Reward row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
          <div>
            {isActive && (
              <div className={`text-sm font-semibold ${timer.expired ? "text-red-600" : "text-blue-700"}`}>
                {timer.expired ? "⏰ Expired — task will be reassigned soon" : `⏳ Time remaining: ${timer.text}`}
              </div>
            )}
            {isSubmitted && (
              <p className="text-sm font-medium text-yellow-700">
                ⏳ Awaiting admin review — usually within 24 hours
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600 tabular-nums">${Number(task.rewardAmount || 0).toFixed(2)}</div>
            <div className="text-xs text-neutral-400">reward on approval</div>
          </div>
        </div>
      </div>

      {/* ─── Accept Task UI (AVAILABLE tasks) ──────────────────── */}
      {isAvailable && (
        <div className="border border-[#E5E7EB] rounded-2xl bg-white shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">Ready to accept this task?</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">
                Once you accept, you have <span className="font-semibold text-[#374151]">30 minutes</span> to complete and submit proof.
              </p>
            </div>
          </div>

          {/* Instructions preview */}
          {task.instructions && (
            <div className="mb-4 p-3 bg-[#F6F5F3] border border-[#E5E7EB] rounded-xl">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Task Instructions</p>
              <p className="text-sm text-[#374151] leading-relaxed line-clamp-3">{task.instructions}</p>
            </div>
          )}

          {/* Client reference image */}
          {task.referenceImageUrl && (
            <div className="mb-4 p-3 bg-[#F6F5F3] border border-[#E5E7EB] rounded-xl">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Client Reference Image</p>
              <img
                src={task.referenceImageUrl}
                alt="Client reference"
                className="max-h-48 rounded-lg object-contain border border-neutral-200"
              />
              <p className="text-xs text-[#6B7280] mt-1.5">Uploaded by the client to clarify the request.</p>
            </div>
          )}

          {/* Review-specific: require Gmail before accepting */}
          {task.isReview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                Gmail account you will use for this review <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={acceptEmail}
                onChange={(e) => { setAcceptEmail(e.target.value); setAcceptError(""); }}
                placeholder="yourname@gmail.com"
                className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] bg-[#F6F5F3] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-[#6B7280] mt-1.5">
                Must be a real, aged Google account. Do NOT use an email already used to review this business.
              </p>
            </div>
          )}

          {/* Error */}
          {acceptError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{acceptError}</p>
            </div>
          )}

          {/* Warnings */}
          <div className="mb-5 space-y-2">
            <div className="flex items-start gap-2 text-xs text-[#6B7280]">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>You can have a maximum of <strong>3 active tasks</strong> at once. Complete existing tasks before accepting more.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#6B7280]">
              <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>After accepting, the <strong>30-minute countdown</strong> starts immediately. If it expires the task is returned to the feed.</span>
            </div>
          </div>

          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full h-12 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {accepting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Accepting…
              </>
            ) : (
              <>
                Accept & Start Task
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── Step Indicator (active tasks only) ─────────────────── */}
      {isActive && !timer.expired && (
        <StepIndicator
          current={step}
          steps={["Read Instructions", "Training", "Submit Proof"]}
        />
      )}

      {/* ─── Step 0: Instructions ─────────────────────────────── */}
      {(isActive && !timer.expired && step === 0) || isReadOnly ? (
        <div className="border border-[#E5E7EB] rounded-2xl bg-white shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
            {isReadOnly ? "Task Instructions" : "Step 1: Read & Understand"}
          </h2>

          {/* Client instructions */}
          {task.instructions && (
            <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1.5">What the client wants</p>
              <p className="text-sm text-blue-900 leading-relaxed">{task.instructions}</p>
            </div>
          )}

          {/* Client reference image */}
          {task.referenceImageUrl && (
            <div className="mb-5 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">Client Reference Image</p>
              <img
                src={task.referenceImageUrl}
                alt="Client reference"
                className="max-h-56 rounded-xl object-contain border border-neutral-200"
              />
              <p className="text-xs text-neutral-500 mt-2">Use this image to understand exactly what the client is looking for.</p>
            </div>
          )}

          {/* Review-specific requirements box */}
          {task.isReview && (
            <div className="mb-5 space-y-3">
              {task.reviewRating && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Required Rating</p>
                  <p className="text-sm text-amber-700">
                    {"★".repeat(task.reviewRating)}{"☆".repeat(5 - task.reviewRating)} {task.reviewRating}-star review
                  </p>
                </div>
              )}
              {task.reviewLanguage && (
                <div className="p-3 bg-[#DBEAFE] border border-[#2563EB]/20 rounded-lg">
                  <p className="text-xs font-semibold text-[#2563EB] mb-1">Required Language</p>
                  <p className="text-sm text-[#2563EB] font-medium">{task.reviewLanguage}</p>
                </div>
              )}
              {task.reviewContent && (
                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Content Guidance</p>
                  <p className="text-sm text-amber-700 italic">&quot;{task.reviewContent}&quot;</p>
                  <p className="text-xs text-amber-600 mt-1.5">Use these ideas as inspiration — write your own natural review. Do NOT copy-paste this text.</p>
                </div>
              )}
              {task.businessName && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg font-medium">
                    🏪 {task.businessName}
                  </span>
                  {task.businessCountry && (
                    <span className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg font-medium">
                      📍 {task.businessCountry}
                    </span>
                  )}
                  {task.requiredGender && task.requiredGender !== "ANY" && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      task.requiredGender === "FEMALE" ? "bg-pink-50 text-pink-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {task.requiredGender === "FEMALE" ? "♀ Female reviewer preferred" : "♂ Male reviewer preferred"}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Platform how-to guide */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">How to complete this task</p>
            <div className="border border-neutral-100 rounded-xl overflow-hidden">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-800">{guide.title}</p>
              </div>
              <div className="p-4">
                <ol className="space-y-3">
                  {guide.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-neutral-700 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
                {guide.tips.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-xs font-semibold text-green-800 mb-1.5">💡 Pro Tips</p>
                    <ul className="space-y-1">
                      {guide.tips.map((t, i) => (
                        <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                          <span className="mt-0.5">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requirements checklist */}
          {!isReadOnly && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Requirements Checklist</p>
              <Checklist items={requirements} />
            </div>
          )}

          {/* CTA to next step */}
          {!isReadOnly && (
            <button
              onClick={() => setStep(1)}
              className="w-full h-11 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span className="hidden sm:inline">I have read the instructions — </span>Continue to Training →
            </button>
          )}
        </div>
      ) : null}

      {/* ─── Step 1: Watch (media tasks) or Training (other tasks) ─ */}
      {isActive && !timer.expired && step === 1 && (
        <div className="border border-[#E5E7EB] rounded-2xl bg-white shadow-sm p-4 sm:p-6 mb-6">
          {task.requiresTimer ? (
            <>
              <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                Step 2: Watch the Content
              </h2>
              <p className="text-xs text-[#6B7280] mb-4">
                You must watch for at least <strong>{task.minViewDuration}s</strong> of active playback. Pausing, muting, or switching tabs pauses the timer.
              </p>

              {submitting ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <svg className="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm font-semibold text-[#374151]">Submitting your task…</p>
                  <p className="text-xs text-[#6B7280]">Watch time verified — recording your completion.</p>
                </div>
              ) : !mediaSessionToken ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[#374151] mb-4">Press the button below to load the secure player and start your session.</p>
                  <button
                    type="button"
                    onClick={handleStartMediaSession}
                    disabled={mediaSessionLoading}
                    className="h-11 px-6 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 shadow-sm"
                  >
                    {mediaSessionLoading ? "Starting session…" : "▶ Start Watching"}
                  </button>
                </div>
              ) : (
                <SecureMediaPlayer
                  taskId={task.id}
                  videoId={(() => {
                    const url = task.targetUrl ?? "";
                    const m = url.match(/[?&]v=([^&#]+)/) ?? url.match(/youtu\.be\/([^?&#]+)/) ?? url.match(/youtube\.com\/shorts\/([^?&#]+)/);
                    return m?.[1] ?? "";
                  })()}
                  requiredSeconds={task.minViewDuration ?? 30}
                  sessionToken={mediaSessionToken}
                  onComplete={handleMediaComplete}
                />
              )}

              {!submitting && (
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="mt-4 w-full h-10 border border-[#E5E7EB] bg-[#F6F5F3] text-[#374151] text-sm font-semibold rounded-xl hover:bg-[#EDECE9] transition-colors"
                >
                  ← Back to Instructions
                </button>
              )}
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
                Step 2: Training & Acknowledgment
              </h2>

              <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-800 mb-2">Before you submit proof, confirm the following:</p>
                <Checklist
                  items={getRequirements(task)}
                  onAllChecked={(done) => setTrainingComplete(done)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 h-11 border border-[#E5E7EB] bg-[#F6F5F3] text-[#374151] text-sm font-semibold rounded-xl hover:bg-[#EDECE9] transition-colors"
                >
                  ← Back to Instructions
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!trainingComplete}
                  className="flex-[2] h-11 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <span className="hidden sm:inline">Training Complete — </span>Submit Proof →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Step 2: Submit Proof ───────────────────────────────── */}
      {isActive && !timer.expired && step === 2 && (
        <form onSubmit={handleSubmit} className="border border-[#E5E7EB] rounded-2xl bg-white shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Step 3: Submit Proof</h2>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline"
            >
              ← Back to Training
            </button>
          </div>

          {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

          {/* Reminder box */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-semibold text-blue-800 mb-1">Reminder</p>
            <p className="text-sm text-blue-900">
              Make sure your proof clearly shows the completed action. Blurry or incomplete screenshots will be rejected.
            </p>
            {task.targetUrl && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-blue-700">Target:</span>
                <span className="text-xs text-blue-700 font-mono truncate max-w-[200px]">{task.targetUrl}</span>
                <CopyButton text={task.targetUrl} label="Copy" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Upload Screenshot <span className="text-neutral-400 font-normal">(required)</span>
              </label>
              {!screenshotPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#D1D5DB] rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                  <svg className="w-8 h-8 text-neutral-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-neutral-500">Click to select or drag an image here</span>
                  <span className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP — max 10MB</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-neutral-200">
                  <img src={screenshotPreview} alt="Screenshot preview" className="w-full max-h-64 object-contain bg-neutral-100" />
                  <button
                    type="button"
                    onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur text-neutral-700 text-xs font-medium px-2 py-1 rounded-lg border border-neutral-200 hover:bg-white transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 h-11 border border-[#E5E7EB] bg-[#F6F5F3] text-[#374151] text-sm font-semibold rounded-xl hover:bg-[#EDECE9] transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting || !screenshotFile}
                className="flex-[2] h-11 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {submitting ? (uploading ? "Uploading…" : "Submitting…") : "Submit Proof for Review"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── Expired active task ──────────────────────────────── */}
      {isActive && timer.expired && (
        <div className="border border-red-200 rounded-2xl bg-red-50 p-6 mb-6">
          <h2 className="text-sm font-semibold text-red-800 mb-2">⏰ Task Expired</h2>
          <p className="text-sm text-red-700">
            You did not submit proof in time. This task has been released back to the feed and will be reassigned to another worker.
          </p>
          <Link href="/tasks/feed" className="inline-block mt-3 text-sm font-medium text-red-800 underline">
            Find new tasks →
          </Link>
        </div>
      )}

      {/* ─── Submitted state ──────────────────────────────────── */}
      {isSubmitted && task.proof && (
        <div className="border border-yellow-200 rounded-2xl bg-yellow-50 p-6 mb-6">
          <h2 className="text-sm font-semibold text-yellow-800 mb-2">⏳ Proof Submitted — Awaiting Review</h2>
          <p className="text-sm text-yellow-700 mb-3">
            Your proof is being reviewed by our team. You will be credited automatically once approved. This usually takes a few hours.
          </p>
          {task.proof.screenshotUrl && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-yellow-700 mb-1.5">Screenshot</p>
              <a href={task.proof.screenshotUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg overflow-hidden border border-yellow-200">
                <img src={task.proof.screenshotUrl} alt="Proof screenshot" className="max-h-48 object-contain bg-neutral-100" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* ─── Paid state ───────────────────────────────────────── */}
      {isPaid && (
        <div className="border border-green-200 rounded-2xl bg-green-50 p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-sm font-semibold text-green-800">Verified & Paid</h2>
          </div>
          <p className="text-sm text-green-700">
            <span className="font-bold">${Number(task.rewardAmount || 0).toFixed(2)}</span> has been credited to your wallet. Great work!
          </p>
          {task.proof?.screenshotUrl && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-green-700 mb-1.5">Your proof</p>
              <a href={task.proof.screenshotUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg overflow-hidden border border-green-200">
                <img src={task.proof.screenshotUrl} alt="Proof screenshot" className="max-h-48 object-contain bg-neutral-100" />
              </a>
            </div>
          )}
          <Link href="/dashboard/earnings" className="inline-block mt-3 text-sm font-medium text-green-800 underline">
            View earnings →
          </Link>
        </div>
      )}

      {/* ─── Rejected state ───────────────────────────────────── */}
      {isRejected && (
        <div className="border border-red-200 rounded-2xl bg-red-50 p-6 mb-6">
          <h2 className="text-sm font-semibold text-red-800 mb-2">✗ Proof Rejected</h2>
          {task.proof?.screenshotUrl && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-red-700 mb-1.5">Your submitted proof</p>
              <a href={task.proof.screenshotUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg overflow-hidden border border-red-200">
                <img src={task.proof.screenshotUrl} alt="Proof screenshot" className="max-h-48 object-contain bg-neutral-100" />
              </a>
            </div>
          )}
          {task.proof?.rejectionReason && (
            <div className="p-3 bg-white border border-red-100 rounded-lg mb-3">
              <p className="text-xs font-semibold text-red-700 mb-1">Reason:</p>
              <p className="text-sm text-red-700">{task.proof.rejectionReason}</p>
            </div>
          )}
          <p className="text-sm text-red-700">
            This task has been returned to the available feed. Unfortunately you cannot resubmit for this specific task.
          </p>
          <Link href="/tasks/feed" className="inline-block mt-3 text-sm font-medium text-red-800 underline">
            Find new tasks →
          </Link>
        </div>
      )}
    </div>
    </div>
  );
}
