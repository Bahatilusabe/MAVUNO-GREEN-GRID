import { useEffect, useState } from "react";
import { Bell, Bot, ChevronRight, CircleHelp, Menu, X } from "lucide-react";
import { cn } from "../src/lib/utils";
import ViewSwitcher from "./ViewSwitcher";

/**
 * The application shell shared by all four portals.
 *
 * It owns the sidebar, the topbar and the AI assistant drawer, so page
 * furniture is identical everywhere: one header height, one sidebar width,
 * one button rhythm, one mobile drawer behaviour.
 */
export default function Shell({
  nav,
  active,
  onNavigate,
  title,
  subtitle,
  user,
  alerts = 0,
  actions,
  onBell,
  onHelp,
  aside,
  breadcrumbs,
  path,
  contentClassName,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);

  const pick = (key) => {
    setOpen(false);
    onNavigate(key);
  };

  useEffect(() => {
    if (!chat) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setChat(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chat]);

  const crumbs = Array.isArray(breadcrumbs) ? breadcrumbs : [];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative text-foreground font-sans">

      {/* Mobile backdrop for the sidebar drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/45 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Sidebar                                                            */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 shrink-0",
          "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          "transition-transform duration-300 ease-[var(--ease-out-soft)]",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Main"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path
                d="M12 21c0-6 3.5-9.5 9-11-1 6-4 9.5-9 11Z"
                fill="currentColor"
                opacity=".95"
              />
              <path d="M12 21C8 21 4 17 4 11c4 0 7 2 8 6 .8-3 2-4.5 4-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <strong className="block text-sm font-extrabold tracking-tight leading-tight">MAVUNO</strong>
            <small className="block text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/60">
              Green Grid
            </small>
          </div>

          <button
            type="button"
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin" aria-label="Sections">
          <ul className="space-y-1">
            {nav.map(([key, label, Icon, badge]) => {
              const isActive = active === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => pick(key)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5",
                      "text-[13px] font-semibold transition-colors duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon
                        size={17}
                        aria-hidden="true"
                        className={cn(
                          "flex-none transition-transform duration-200",
                          isActive
                            ? "text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/60 group-hover:scale-110",
                        )}
                      />
                      <span className="truncate">{label}</span>
                    </span>

                    {badge === true && (
                      <span
                        className={cn(
                          "h-2 w-2 flex-none rounded-full",
                          isActive ? "bg-sidebar-primary-foreground" : "bg-sidebar-primary",
                        )}
                      />
                    )}
                    {typeof badge === "number" && badge > 0 && (
                      <span
                        className={cn(
                          "flex-none rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular",
                          isActive
                            ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                            : "bg-sidebar-accent text-sidebar-accent-foreground",
                        )}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Platform switcher + user */}
        <div className="space-y-3 border-t border-sidebar-border p-3">
          <ViewSwitcher path={path} />

          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/40 px-3 py-2.5">
              <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
                {user.initials}
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs font-bold">{user.name}</strong>
                <small className="block truncate text-[11px] font-medium text-sidebar-foreground/60">
                  {user.sub}
                </small>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Main column                                                        */}
      {/* ---------------------------------------------------------------- */}
      <main className="flex min-w-0 flex-1 flex-col">

        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="grid h-9 w-9 flex-none place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              {crumbs.length > 0 && (
                <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-[11px] font-semibold text-muted-foreground sm:flex">
                  {crumbs.map((crumb, i) => (
                    <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight size={12} aria-hidden="true" className="opacity-50" />}
                      {crumb.onClick ? (
                        <button
                          type="button"
                          onClick={crumb.onClick}
                          className="rounded transition-colors hover:text-foreground"
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span className="text-foreground/80">{crumb.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}

              <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="hidden truncate text-xs font-medium text-muted-foreground sm:block">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-none items-center gap-1.5 sm:gap-2">
              {actions}

              {aside && (
                <button
                  type="button"
                  className="hidden h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:grid"
                  aria-label="Help"
                  onClick={onHelp ?? (() => setChat(true))}
                >
                  <CircleHelp size={18} aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                className="relative grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={alerts > 0 ? `Notifications, ${alerts} unread` : "Notifications"}
                onClick={onBell}
                disabled={!onBell}
              >
                <Bell size={18} aria-hidden="true" />
                {alerts > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground shadow-sm">
                    {alerts > 9 ? "9+" : alerts}
                  </span>
                )}
              </button>

              {user && (
                <div className="ml-1 grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-700 text-[11px] font-bold text-white shadow-sm">
                  {user.initials}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={cn("mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8", contentClassName)}>
          {children}
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* AI assistant drawer                                              */}
      {/* ---------------------------------------------------------------- */}
      {aside && (
        <>
          <button
            type="button"
            onClick={() => setChat(true)}
            aria-label="Ask MAVUNO AI"
            className={cn(
              "group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full",
              "bg-brand-700 px-5 py-3 text-primary-foreground shadow-pop",
              "transition-all duration-300 ease-[var(--ease-out-soft)]",
              "hover:-translate-y-1 hover:bg-brand-800 hover:shadow-xl active:translate-y-0",
            )}
          >
            <span className="relative grid place-items-center" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <Bot size={20} className="relative z-10" />
            </span>
            <span className="pr-1 text-sm font-semibold tracking-wide">Ask MAVUNO AI</span>
          </button>

          <div
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex w-full max-w-[92vw] flex-col border-l border-border bg-card shadow-2xl",
              "transition-transform duration-300 ease-[var(--ease-out-soft)] sm:w-[30rem]",
              chat ? "translate-x-0" : "translate-x-full",
            )}
            role="dialog"
            aria-modal="false"
            aria-label="AI Assistant"
            aria-hidden={!chat}
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
              <strong className="text-sm font-bold text-foreground">AI Assistant</strong>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close assistant"
                onClick={() => setChat(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">{aside}</div>
          </div>

          {chat && (
            <div
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
              aria-label="Close AI assistant"
              onClick={() => setChat(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
