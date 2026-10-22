import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

const FALLBACK = { theme: "system", resolved: "light", setTheme: () => {}, toggle: () => {} };

// Safe outside a provider (tests, Storybook): it just reports light mode
export function useTheme() {
  return useContext(ThemeContext) ?? FALLBACK;
}