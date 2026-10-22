import { useTheme } from "../../src/theme/useTheme";

const LIGHT = {
  text: "#5b6b62",
  grid: "#e3ebe5",
  cursor: "rgba(21,128,61,0.08)",
  tooltipBg: "#ffffff",
  tooltipBorder: "#dde6df",
  tooltipText: "#0f1f17",
  series: [
    "#15803d", // Forest Green
    "#0284c7", // Deep Sky Blue
    "#d97706", // Amber/Orange
    "#7c3aed", // Violet
    "#dc2626", // Crimson Red
    "#0d9488", // Teal
    "#ea580c", // Burnt Orange
    "#4f46e5", // Indigo
  ],
};

const DARK = {
  text: "#93a79a",
  grid: "#1f2f26",
  cursor: "rgba(63,207,122,0.10)",
  tooltipBg: "#131f18",
  tooltipBorder: "#2a3d32",
  tooltipText: "#e8f1ea",
  series: [
    "#4ade80", // Neon Green
    "#38bdf8", // Sky Blue
    "#fbbf24", // Golden Yellow
    "#a78bfa", // Soft Purple
    "#f87171", // Pastel Red
    "#2dd4bf", // Aqua
    "#fb923c", // Soft Orange
    "#818cf8", // Periwinkle
  ],
};

export function useChartTheme() {
  return useTheme().resolved === "dark" ? DARK : LIGHT;
}