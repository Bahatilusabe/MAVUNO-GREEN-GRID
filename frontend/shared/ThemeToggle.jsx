import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../src/theme/useTheme";

const OPTIONS = [
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
  { id: "dark", label: "Dark", icon: Moon },
];

export default function ThemeToggle({ variant = "segmented", className = "" }) {
  const { theme, resolved, setTheme, toggle } = useTheme();

  if (variant === "icon") {
    const Icon = resolved === "dark" ? Sun : Moon;
    const label = resolved === "dark" ? "Switch to light mode" : "Switch to dark mode";
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`}
      >
        <Icon size={17} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`inline-flex items-center rounded-xl border border-border bg-muted p-0.5 ${className}`}
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(id)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={15} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}