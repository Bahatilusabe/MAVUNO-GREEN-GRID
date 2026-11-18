import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme, PALETTE_LIST } from "./useTheme";
import { cn } from "../lib/utils";

const MODES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

/**
 * The theme picker.
 *
 * Two controls, because the theme has two axes: a mode (light, dark or
 * follow the system) and a palette (the colour family). Switching the
 * palette recolours the charts as well as the chrome, so the whole product
 * reads as one piece.
 */
export default function ThemePicker({ className, align = "right" }) {
  const { mode, palette, setMode, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close on Escape or a click outside, so the popover behaves like the rest
  // of the platform's overlays.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const active = PALETTE_LIST.find((p) => p.id === palette) ?? PALETTE_LIST[0];

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Change theme"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-2.5",
          "text-xs font-semibold text-muted-foreground transition-colors duration-200",
          "hover:border-brand-300 hover:text-foreground",
          className,
        )}
      >
        <span
          className="h-4 w-4 flex-none rounded-full ring-1 ring-black/10"
          style={{ background: active.swatch }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{active.label}</span>
        <Palette size={14} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Theme"
          className={cn(
            "absolute z-50 mt-2 w-64 rounded-2xl border border-border bg-popover p-3",
            "text-popover-foreground shadow-pop",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Mode
          </p>
          <div
            role="radiogroup"
            aria-label="Colour mode"
            className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
          >
            {MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mode === id}
                onClick={() => setMode(id)}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5",
                  "text-[11px] font-semibold transition-colors duration-200",
                  mode === id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <p className="px-1 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Palette
          </p>
          <ul className="space-y-0.5">
            {PALETTE_LIST.map((p) => {
              const selected = p.id === palette;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPalette(p.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left",
                      "transition-colors duration-200 hover:bg-muted",
                      selected && "bg-muted",
                    )}
                  >
                    <span
                      className="h-5 w-5 flex-none rounded-full ring-1 ring-black/10"
                      style={{ background: p.swatch }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <strong className="block text-xs font-bold text-foreground">{p.label}</strong>
                      <small className="block truncate text-[10px] font-medium text-muted-foreground">
                        {p.blurb}
                      </small>
                    </span>
                    {selected && <Check size={14} className="flex-none text-foreground" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
