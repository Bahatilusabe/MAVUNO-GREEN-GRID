import { cn } from "../../src/lib/utils";

/**
 * The one progress bar. Colour is derived from the value so a full bar and a
 * risky bar cannot drift apart between portals.
 */
export default function Progress({ value = 0, max = 100, tone, size = "md", className, label }) {
  const pct = Math.max(0, Math.min(100, (Number(value) / (max || 1)) * 100));
  const auto = pct >= 85 ? "bg-red-600" : pct >= 60 ? "bg-amber-500" : "bg-brand-600";
  const fill = tone ?? auto;

  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-muted", size === "sm" ? "h-1.5" : "h-2.5", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-soft)]", fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
