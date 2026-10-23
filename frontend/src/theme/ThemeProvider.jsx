import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "./useTheme";
import { DEFAULT_PALETTE, PALETTE_IDS, buildTokens } from "./palettes";
import { syncChartTheme } from "../../shared/chartColors";

const MODE_KEY = "mavuno_theme"; // "light" | "dark" | "system"
const PALETTE_KEY = "mavuno_palette"; // "mavuno" | "sunset" | "ocean" | "plum" | "cacao"
const MODES = ["light", "dark", "system"];

const META_COLORS = { light: "#f1f7f1", dark: "#07110b" };

const readMode = () => {
  try {
    const v = localStorage.getItem(MODE_KEY);
    return MODES.includes(v) ? v : "system";
  } catch {
    return "system";
  }
};

const readPalette = () => {
  try {
    const v = localStorage.getItem(PALETTE_KEY);
    return PALETTE_IDS.includes(v) ? v : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
};

const prefersDark = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-color-scheme: dark)").matches);

/**
 * Writes the active token set onto <html> as inline custom properties.
 *
 * Inline styles outrank the `:root` and `.dark` rules in index.css, so this
 * is what actually colours the app. index.css keeps a matching static set
 * for the first paint, before React has mounted.
 */
function applyTokens(tokens) {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(`--${name}`, value);
  }
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(readMode);
  const [palette, setPaletteState] = useState(readPalette);
  const [systemDark, setSystemDark] = useState(prefersDark);
  const mounted = useRef(false);

  const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  const { tokens, chart } = useMemo(
    () => buildTokens(palette, resolved),
    [palette, resolved],
  );

  // Publish the chart palette while rendering, not in an effect. Charts read
  // concrete colour values (an SVG attribute cannot resolve `var()`), so they
  // need the new palette available in the very same render pass — an effect
  // would leave them one frame behind.
  syncChartTheme(chart, tokens);

  // Follow the operating system while the choice is "system".
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === MODE_KEY) setModeState(readMode());
      if (e.key === PALETTE_KEY) setPaletteState(readPalette());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // A layout effect runs before paint, so a theme switch never shows a frame
  // of the old palette.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (mounted.current) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 320);
    }
    mounted.current = true;

    root.classList.toggle("dark", resolved === "dark");
    root.dataset.theme = palette;
    root.dataset.mode = resolved;
    root.style.colorScheme = resolved;
    applyTokens(tokens);

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", META_COLORS[resolved]);
  }, [tokens, resolved, palette]);

  const setMode = useCallback((next) => {
    if (!MODES.includes(next)) return;
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* private mode: the choice just will not persist */
    }
    setModeState(next);
  }, []);

  const setPalette = useCallback((next) => {
    if (!PALETTE_IDS.includes(next)) return;
    try {
      localStorage.setItem(PALETTE_KEY, next);
    } catch {
      /* private mode: the choice just will not persist */
    }
    setPaletteState(next);
  }, []);

  const toggle = useCallback(
    () => setMode(resolved === "dark" ? "light" : "dark"),
    [resolved, setMode],
  );

  const value = useMemo(
    () => ({ mode, resolved, palette, setMode, setPalette, toggle, tokens, chart }),
    [mode, resolved, palette, setMode, setPalette, toggle, tokens, chart],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
