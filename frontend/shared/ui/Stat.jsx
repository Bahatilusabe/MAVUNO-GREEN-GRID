import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "../../src/lib/utils";
import { useCountUp } from "./Motion";

const TONES = {
  brand: { chip: "bg-brand-50 text-brand-700", value: "text-foreground" },
  blue: { chip: "bg-blue-50 text-blue-700", value: "text-foreground" },
  gold: { chip: "bg-amber-50 text-amber-700", value: "text-foreground" },
  red: { chip: "bg-red-50 text-red-700", value: "text-foreground" },
  violet: { chip: "bg-violet-50 text-violet-700", value: "text-foreground" },
  teal: { chip: "bg-teal-50 text-teal-700", value: "text-foreground" },
};

const DELTA_TONE = {
  up: "text-emerald-700 bg-emerald-50",
  down: "text-red-700 bg-red-50",
  flat: "text-muted-foreground bg-muted",
};

/**
 * The one KPI tile. Farmer, partner and admin dashboards all render their
 * headline numbers through this, so the metric rhythm is identical everywhere.
 */
export default function Stat({
  label,
  value,
  hint,
  unit,
  icon: Icon,
  tone = "brand",
  delta,
  deltaLabel,
  animate = true,
  decimals = 0,
  className,
}) {
  const palette = TONES[tone] ?? TONES.brand;
  const numeric = Number(value);
  const showNumber = Number.isFinite(numeric);
  const counted = useCountUp(animate && showNumber ? numeric : value, { decimals });
  const display = showNumber
    ? counted.toLocaleString("en-KE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value;

  const direction = delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const DeltaIcon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;

  return (
    <div className={cn("surface p-4 sm:p-5 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <span
            className={cn("grid h-8 w-8 flex-none place-items-center rounded-lg", palette.chip)}
            aria-hidden="true"
          >
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={cn("text-2xl font-extrabold tracking-tight tabular", palette.value)}>
          {display}
        </span>
        {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
        {delta != null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold",
              DELTA_TONE[direction],
            )}
          >
            <DeltaIcon size={12} aria-hidden="true" />
            {Math.abs(delta)}%
          </span>
        )}
      </div>

      {(hint || deltaLabel) && (
        <p className="text-xs font-medium text-muted-foreground">{hint || deltaLabel}</p>
      )}
    </div>
  );
}
