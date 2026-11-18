import { cn } from "../../src/lib/utils";
import Button from "./Button";

/**
 * The one empty state. It replaced three different patterns across the
 * portals; the action is optional and a button is only rendered when there is
 * something to click.
 */
export default function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  onAction,
  actionIcon,
  className,
  compact = false,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-center",
        compact ? "gap-2 px-6 py-8" : "gap-3 px-8 py-14",
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            "grid place-items-center rounded-2xl bg-brand-50 text-brand-700",
            compact ? "h-10 w-10" : "h-12 w-12",
          )}
          aria-hidden="true"
        >
          <Icon size={compact ? 18 : 22} />
        </span>
      )}

      <strong className="text-sm font-bold text-foreground">{title}</strong>
      {text && <p className="max-w-sm text-xs font-medium leading-relaxed text-muted-foreground">{text}</p>}

      {action && onAction && (
        <Button size="sm" icon={actionIcon} onClick={onAction} className="mt-1">
          {action}
        </Button>
      )}
    </div>
  );
}
