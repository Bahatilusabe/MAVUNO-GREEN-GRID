import { cn } from "../../src/lib/utils";

/**
 * The canonical card. Every panel in every portal is built from this so the
 * radius, border, elevation and padding never drift between views.
 */
export function Card({ as: Tag = "div", interactive = false, flat = false, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        interactive ? "surface-interactive" : flat ? "surface-flat" : "surface",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-base font-bold tracking-tight text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardSubtitle({ className, children, ...props }) {
  return (
    <p className={cn("mt-0.5 text-xs font-medium text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3 border-t border-border px-5 py-3.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
