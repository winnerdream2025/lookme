interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${SIZE[size]} border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin ${className}`}
    />
  );
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      {label && <p className="text-sm text-neutral-500">{label}</p>}
    </div>
  );
}
