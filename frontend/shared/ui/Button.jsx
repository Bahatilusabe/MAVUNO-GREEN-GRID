import { Loader2 } from "lucide-react";
import { cn } from "../../src/lib/utils";

const VARIANTS = {
  primary:
    "bg-brand-700 text-white shadow-xs hover:bg-brand-800 active:bg-brand-900 disabled:bg-brand-700/50",
  secondary:
    "bg-brand-50 text-brand-800 border border-brand-200 hover:bg-brand-100 hover:border-brand-300",
  outline:
    "bg-card text-foreground border border-border hover:bg-muted hover:border-brand-300",
  ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  danger:
    "bg-destructive/10 text-destructive border border-destructive/25 hover:bg-destructive/15",
  gold: "bg-gold-soft text-amber-800 border border-amber-200 hover:bg-amber-100",
};

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-xs rounded-lg",
  md: "h-9.5 gap-2 px-3.5 text-sm rounded-xl",
  lg: "h-11 gap-2 px-5 text-sm rounded-xl",
};

const BASE =
  "inline-flex shrink-0 items-center justify-center font-semibold tracking-tight " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-55";

/**
 * The one button in the app. Every portal renders actions through it so radius,
 * height, focus ring and press feedback stay identical.
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={size === "sm" ? 14 : 16} aria-hidden="true" />
      )}
      {children}
      {IconRight && !loading && <IconRight size={size === "sm" ? 14 : 16} aria-hidden="true" />}
    </button>
  );
}
