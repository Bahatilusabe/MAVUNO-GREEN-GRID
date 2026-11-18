import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { VIEWS, activeView, navigate } from "./nav";
import { cn } from "../src/lib/utils";

/**
 * The one place a user changes platform. It replaced a dead "Switch view"
 * link in the sidebar and a separate floating widget, so navigation is now
 * discoverable from the topbar in every portal.
 */
export default function ViewSwitcher({ path = "/", className, compact = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = VIEWS.find((v) => v.path === activeView(path)) ?? VIEWS[0];

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5 text-left",
          "text-sidebar-foreground transition-colors duration-200 hover:bg-sidebar-accent focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring/60",
        )}
      >
        <span
          className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          aria-hidden="true"
        >
          <current.icon size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold">{current.label}</span>
          {!compact && (
            <span className="block truncate text-[11px] font-medium text-sidebar-foreground/60">
              {current.description}
            </span>
          )}
        </span>
        <ChevronsUpDown size={14} className="flex-none text-sidebar-foreground/50" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-50 mt-2 w-full min-w-[15rem] overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-pop reveal"
        >
          <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Switch platform
          </p>
          {VIEWS.map((view) => {
            const isActive = view.path === current.path;
            return (
              <button
                key={view.path}
                role="menuitem"
                type="button"
                onClick={() => go(view.path)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150",
                  isActive ? "bg-brand-50 text-brand-800" : "text-foreground hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 flex-none place-items-center rounded-md",
                    isActive ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  <view.icon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">{view.label}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{view.description}</span>
                </span>
                {isActive && <Check size={14} className="flex-none text-brand-700" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
