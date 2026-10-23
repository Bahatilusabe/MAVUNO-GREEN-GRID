import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import ThemePicker from "../../src/theme/ThemePicker";

const LINKS = [
  { href: "#problem", label: "The problem" },
  { href: "#why", label: "Why it exists" },
  { href: "#how", label: "How the grid runs" },
  { href: "#different", label: "What's different" },
];

/**
 * The landing nav.
 *
 * Sticky and translucent, so the artwork scrolls behind it rather than
 * being cut off by a solid bar.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ease-[var(--ease-out-soft)] ${
        scrolled
          ? "border-border bg-background/85 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="MAVUNO Green Grid, back to top">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-sm">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path d="M12 21c0-6 3.5-9.5 9-11-1 6-4 9.5-9 11Z" fill="currentColor" opacity=".95" />
              <path
                d="M12 21C8 21 4 17 4 11c4 0 7 2 8 6 .8-3 2-4.5 4-5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="leading-tight">
            <strong className="block text-sm font-extrabold tracking-tight text-foreground">MAVUNO</strong>
            <small className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Green Grid
            </small>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Sections">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemePicker />
          <a
            href="#/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 text-xs font-bold text-white shadow-sm transition-colors duration-200 hover:bg-brand-800"
          >
            Open app
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
