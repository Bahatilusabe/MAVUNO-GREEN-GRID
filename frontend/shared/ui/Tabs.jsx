import { cn } from "../../src/lib/utils";

/**
 * Tab strip. `variant="underline"` is the default and matches the market and
 * partner views; `variant="pill"` is the compact switcher used on cards.
 */
export default function Tabs({
  tabs,
  value,
  onChange,
  variant = "underline",
  className,
  ariaLabel = "Sections",
}) {
  if (variant === "pill") {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn("inline-flex items-center gap-1 rounded-xl bg-muted p-1", className)}
      >
        {tabs.map((tab) => {
          const key = typeof tab === "string" ? tab : tab.key;
          const label = typeof tab === "string" ? tab : tab.label;
          const badge = typeof tab === "string" ? undefined : tab.badge;
          const isActive = key === value;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              {badge != null && badge > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-bold",
                    isActive ? "bg-brand-100 text-brand-800" : "bg-border text-muted-foreground",
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex items-center gap-1 overflow-x-auto border-b border-border scrollbar-thin", className)}
    >
      {tabs.map((tab) => {
        const key = typeof tab === "string" ? tab : tab.key;
        const label = typeof tab === "string" ? tab : tab.label;
        const badge = typeof tab === "string" ? undefined : tab.badge;
        const isActive = key === value;
        return (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={cn(
              "relative -mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors duration-200",
              isActive
                ? "border-brand-600 text-brand-800"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {label}
            {badge != null && badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive ? "bg-brand-100 text-brand-800" : "bg-muted text-muted-foreground",
                )}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
