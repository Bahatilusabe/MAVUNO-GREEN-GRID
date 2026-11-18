import { cn } from "../../src/lib/utils";

/**
 * Section heading used above every group of cards. It replaces the four
 * different hand-rolled headers the portals had.
 */
export default function Section({
  icon: Icon,
  title,
  subtitle,
  actions,
  className,
  children,
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <span
            className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs font-medium text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      {children}
    </div>
  );
}
