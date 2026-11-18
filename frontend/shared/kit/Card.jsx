import IconBadge from "./IconBadge";

export default function Card({
  title,
  icon,
  tone = "green",
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}) {
  return (
    <section
      className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h3 className="flex min-w-0 items-center gap-2.5 text-base font-bold">
            {icon && <IconBadge icon={icon} tone={tone} size="sm" />}
            <span className="truncate">{title}</span>
          </h3>
          {action}
        </header>
      )}
      <div className={`min-w-0 flex-grow ${bodyClassName}`}>{children}</div>
    </section>
  );
}