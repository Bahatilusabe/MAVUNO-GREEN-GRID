import { createContext, useContext } from "react";
import { PALETTE_LIST, DEFAULT_PALETTE } from "./palettes";

export const ThemeContext = createContext(null);

const FALLBACK = {
  mode: "system",
  resolved: "light",
  palette: DEFAULT_PALETTE,
  setMode: () => {},
  setPalette: () => {},
  toggle: () => {},
  tokens: {},
  chart: {},
};

/**
 * The theme, from any component.
 *
 * `mode` is the user's choice (light / dark / system), `resolved` is the
 * mode actually in effect, and `palette` is the colour family.
 */
export function useTheme() {
  return useContext(ThemeContext) ?? FALLBACK;
}

/** The palette catalogue, for pickers and swatch legends. */
export { PALETTE_LIST };
