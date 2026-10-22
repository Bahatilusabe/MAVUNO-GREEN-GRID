import { cn } from "../../src/lib/utils";

const TONES = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
  brand: "bg-brand-50 text-brand-800 border-brand-200",
  purple: "bg-violet-50 text-violet-800 border-violet-200",
};

/**
 * Status pill. `tone` maps to the platform-wide meaning of a colour so a
 * "High risk" badge looks the same in the farmer, partner and admin portals.
 */
export default function Badge({ tone = "neutral", dot = false, className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Risk labels are used in every portal; one mapping keeps the colour honest. */
export const RISK_TONE = { High: "danger", Medium: "warning", Low: "success" };
