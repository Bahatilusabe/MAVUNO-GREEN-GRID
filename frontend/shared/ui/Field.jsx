import { useId } from "react";
import { cn } from "../../src/lib/utils";

const CONTROL =
  "w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground " +
  "outline-none transition-[border-color,box-shadow,background-color] duration-200 " +
  "focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Labelled form control. The farmer forms, the partner listing form and the
 * admin filters all use this so field height, label type and error styling
 * are identical.
 */
export default function Field({
  label,
  hint,
  error,
  suffix,
  className,
  inputClassName,
  id,
  children,
  ...props
}) {
  const generated = useId();
  const fieldId = id ?? generated;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        {children ?? (
          <input
            id={fieldId}
            className={cn(CONTROL, error && "border-destructive/60 focus:border-destructive focus:ring-destructive/25", inputClassName)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            {...props}
          />
        )}
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className="text-xs font-semibold text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs font-medium text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export { CONTROL };
