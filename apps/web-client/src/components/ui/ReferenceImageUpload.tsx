"use client";

import { useRef, useState, useCallback } from "react";
import { apiGuestUpload } from "@/lib/api";

interface Props {
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  theme?: "light" | "dark";
  className?: string;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function ReferenceImageUpload({
  onChange,
  label = "Reference image (optional)",
  hint = "Upload a screenshot, mockup, or photo to help workers understand exactly what you need.",
  theme = "dark",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const isDark = theme === "dark";

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ACCEPTED.includes(file.type)) {
        setError("Only JPEG, PNG, WebP or GIF images are accepted.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image must be under 5 MB.");
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setUploading(true);

      try {
        const { url } = await apiGuestUpload<{ url: string }>(
          "/orders/upload-reference",
          file,
          "reference"
        );
        onChange(url);
      } catch (err) {
        setPreview(null);
        onChange(null);
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    onChange(null);
  };

  const border = isDark
    ? dragging ? "border-primary-500" : "border-white/[0.12] hover:border-white/25"
    : dragging ? "border-primary-500" : "border-neutral-200 hover:border-neutral-400";

  const bg = isDark
    ? dragging ? "bg-primary-600/10" : "bg-white/[0.03]"
    : dragging ? "bg-primary-50" : "bg-neutral-50";

  const labelClass = isDark ? "text-slate-300" : "text-neutral-700";
  const hintClass  = isDark ? "text-slate-500" : "text-neutral-500";
  const textClass  = isDark ? "text-slate-400" : "text-neutral-500";
  const iconColor  = isDark ? "text-slate-500" : "text-neutral-400";
  const errClass   = isDark ? "text-red-400" : "text-red-600";

  return (
    <div className={className}>
      {label && (
        <p className={`text-sm font-semibold mb-1 ${labelClass}`}>{label}</p>
      )}
      {hint && (
        <p className={`text-xs mb-3 ${hintClass}`}>{hint}</p>
      )}

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Reference preview"
            className="max-h-48 max-w-full rounded-xl object-contain border border-white/10"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
              <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${border} ${bg}`}
        >
          <svg className={`w-8 h-8 ${iconColor}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-3-3m3 3l3-3" />
          </svg>
          <span className={`text-sm font-medium ${textClass}`}>
            Click to upload or drag & drop
          </span>
          <span className={`text-xs ${hintClass}`}>
            JPEG, PNG, WebP, GIF — max 5 MB
          </span>
        </button>
      )}

      {error && (
        <p className={`mt-2 text-xs ${errClass}`}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
