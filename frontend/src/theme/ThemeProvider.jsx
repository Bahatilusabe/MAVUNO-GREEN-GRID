import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "./useTheme";

const KEY = "mavuno_theme"; // "light" | "dark" | "system"
const THEMES = ["light", "dark", "system"];
const META_COLORS = { light: "#f4f7f4", dark: "#09110c" };

const readStored = () => {
  try {
    const v = localStorage.getItem(KEY);
    return THEMES.includes(v) ? v : "system";
  } catch {
    return "system";
  }
};

const prefersDark = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-color-scheme: dark)").matches);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStored);
  const [systemDark, setSystemDark] = useState(prefersDark);
  const mounted = useRef(false);

  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // Follow the operating system while the choice is "system"
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keep several open tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setThemeState(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mounted.current) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 300);
    }
    mounted.current = true;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLORS[resolved]);
  }, [resolved]);

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: the choice just will not persist */
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(
    () => setTheme(resolved === "dark" ? "light" : "dark"),
    [resolved, setTheme],
  );

  const value = useMemo(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}