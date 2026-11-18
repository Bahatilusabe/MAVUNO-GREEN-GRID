/**
 * The theme catalogue.
 *
 * MAVUNO ships a two-axis theme system:
 *
 *   mode     light | dark | system  — the neutrals (surfaces, text, borders)
 *   palette  mavuno | sunset | ocean | plum | cacao — the hues (brand, charts)
 *
 * Neutrals live in NEUTRALS and are shared by every palette, so switching
 * palette never changes how readable the app is. Hues live in HUES and are
 * defined per palette *and* per mode, because a hue that reads well on a
 * white card glows on a near-black one.
 *
 * This file is the single source of truth. The provider writes every token
 * onto <html> as a CSS custom property, so stylesheets and JavaScript charts
 * read exactly the same values and can never drift apart.
 */

/* -------------------------------------------------------------------------- */
/*  Neutrals — shared by every palette, split by mode                         */
/* -------------------------------------------------------------------------- */

const NEUTRALS = {
  light: {
    background: "#f2f7f2",
    foreground: "#0d1f16",
    card: "#ffffff",
    "card-foreground": "#0d1f16",
    popover: "#ffffff",
    "popover-foreground": "#0d1f16",
    secondary: "#e9f0ea",
    "secondary-foreground": "#1b3326",
    muted: "#edf3ee",
    "muted-foreground": "#5a6b61",
    border: "#dbe5dd",
    input: "#dbe5dd",
    destructive: "#dc2626",
    "destructive-foreground": "#ffffff",

    "sidebar-bg": "#eaf1ea",
    "sidebar-fg": "#1b3326",
    "sidebar-accent": "#dbe5db",
    "sidebar-accent-fg": "#0d1f16",
    "sidebar-border": "#dbe5dd",

    /* Semantic status tones. Kept identical across palettes so "red" always
       means the same thing, whatever the brand hue is. */
    "tone-green-bg": "#dcfce7", "tone-green-fg": "#15803d",
    "tone-blue-bg": "#dbeafe", "tone-blue-fg": "#1d4ed8",
    "tone-amber-bg": "#fef3c7", "tone-amber-fg": "#b45309",
    "tone-red-bg": "#fee2e2", "tone-red-fg": "#b91c1c",
    "tone-purple-bg": "#f3e8ff", "tone-purple-fg": "#7e22ce",
    "tone-gray-bg": "#e8eee9", "tone-gray-fg": "#46564d",

    "elev-xs": "0 1px 2px rgb(13 31 22 / 6%)",
    "elev-sm": "0 1px 3px rgb(13 31 22 / 8%), 0 1px 2px -1px rgb(13 31 22 / 6%)",
    "elev-card": "0 1px 3px rgb(13 31 22 / 7%), 0 10px 26px -14px rgb(13 31 22 / 16%)",
    "elev-card-hover": "0 2px 6px rgb(13 31 22 / 8%), 0 20px 42px -18px rgb(13 31 22 / 24%)",
    "elev-pop": "0 14px 42px -10px rgb(13 31 22 / 30%)",
  },
  dark: {
    background: "#070f0b",
    foreground: "#e6f2ea",
    card: "#0f1b14",
    "card-foreground": "#e6f2ea",
    popover: "#13211a",
    "popover-foreground": "#e6f2ea",
    secondary: "#16261d",
    "secondary-foreground": "#cbe7d7",
    muted: "#14211a",
    "muted-foreground": "#8fa396",
    border: "#20322a",
    input: "#20322a",
    destructive: "#f87171",
    "destructive-foreground": "#2a0a0a",

    "sidebar-bg": "#060c09",
    "sidebar-fg": "#e6f2ea",
    "sidebar-accent": "#111d17",
    "sidebar-accent-fg": "#a7f3c4",
    "sidebar-border": "#1a2b22",

    "tone-green-bg": "rgb(34 197 94 / 0.16)", "tone-green-fg": "#86efac",
    "tone-blue-bg": "rgb(59 130 246 / 0.18)", "tone-blue-fg": "#93c5fd",
    "tone-amber-bg": "rgb(245 158 11 / 0.18)", "tone-amber-fg": "#fcd34d",
    "tone-red-bg": "rgb(239 68 68 / 0.18)", "tone-red-fg": "#fca5a5",
    "tone-purple-bg": "rgb(168 85 247 / 0.18)", "tone-purple-fg": "#d8b4fe",
    "tone-gray-bg": "rgb(148 163 184 / 0.14)", "tone-gray-fg": "#b8c7bd",

    "elev-xs": "0 1px 2px rgb(0 0 0 / 0.5)",
    "elev-sm": "0 1px 3px rgb(0 0 0 / 0.55), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
    "elev-card": "0 1px 3px rgb(0 0 0 / 0.45), 0 12px 30px -16px rgb(0 0 0 / 0.6)",
    "elev-card-hover": "0 2px 8px rgb(0 0 0 / 0.5), 0 22px 46px -18px rgb(0 0 0 / 0.7)",
    "elev-pop": "0 18px 48px -12px rgb(0 0 0 / 0.75)",
  },
};

/* -------------------------------------------------------------------------- */
/*  Hues — one block per palette, one variant per mode                        */
/* -------------------------------------------------------------------------- */

const HUES = {
  mavuno: {
    label: "Mavuno",
    blurb: "Forest green — the house colour",
    swatch: "#15803d",
    light: {
      background: "#f1f7f1",
      primary: "#15803d", "primary-foreground": "#ffffff",
      accent: "#e3f4e8", "accent-foreground": "#14532d",
      ring: "#22c55e",
      "brand-50": "#f0fdf4", "brand-100": "#dcfce7", "brand-200": "#bbf7d0",
      "brand-300": "#86efac", "brand-400": "#4ade80", "brand-500": "#22c55e",
      "brand-600": "#16a34a", "brand-700": "#15803d", "brand-800": "#166534",
      "brand-900": "#14532d",
      chart: {
        green: "#15803d", blue: "#2563eb", amber: "#d97706", purple: "#7c3aed",
        red: "#dc2626", teal: "#0d9488", orange: "#ea580c", indigo: "#4f46e5",
      },
    },
    dark: {
      background: "#07110b",
      primary: "#3fcf7a", "primary-foreground": "#04210f",
      accent: "#10301f", "accent-foreground": "#a7f3c4",
      ring: "#3fcf7a",
      "brand-50": "#0c2015", "brand-100": "#123020", "brand-200": "#1a4a2f",
      "brand-300": "#22653f", "brand-400": "#2f8a55", "brand-500": "#3fa868",
      "brand-600": "#55c47d", "brand-700": "#77da9b", "brand-800": "#a1e8bb",
      "brand-900": "#cdf5dc",
      chart: {
        green: "#4ade80", blue: "#38bdf8", amber: "#fbbf24", purple: "#a78bfa",
        red: "#f87171", teal: "#2dd4bf", orange: "#fb923c", indigo: "#818cf8",
      },
    },
  },

  sunset: {
    label: "Sunset",
    blurb: "Amber and terracotta — harvest warmth",
    swatch: "#c2410c",
    light: {
      background: "#fdf6ef",
      primary: "#c2410c", "primary-foreground": "#ffffff",
      accent: "#ffedd5", "accent-foreground": "#7c2d12",
      ring: "#f97316",
      "brand-50": "#fff7ed", "brand-100": "#ffedd5", "brand-200": "#fed7aa",
      "brand-300": "#fdba74", "brand-400": "#fb923c", "brand-500": "#f97316",
      "brand-600": "#ea580c", "brand-700": "#c2410c", "brand-800": "#9a3412",
      "brand-900": "#7c2d12",
      chart: {
        green: "#c2410c", blue: "#0e7490", amber: "#ca8a04", purple: "#be123c",
        red: "#dc2626", teal: "#15803d", orange: "#b45309", indigo: "#1d4ed8",
      },
    },
    dark: {
      background: "#140d08",
      primary: "#fb923c", "primary-foreground": "#2a1206",
      accent: "#2e1c0f", "accent-foreground": "#fed7aa",
      ring: "#fb923c",
      "brand-50": "#1c110a", "brand-100": "#2a190e", "brand-200": "#3d2413",
      "brand-300": "#5a3317", "brand-400": "#8a4a1c", "brand-500": "#b35c1c",
      "brand-600": "#d97706", "brand-700": "#f59e0b", "brand-800": "#fbbf24",
      "brand-900": "#fde68a",
      chart: {
        green: "#fb923c", blue: "#22d3ee", amber: "#facc15", purple: "#fb7185",
        red: "#f87171", teal: "#4ade80", orange: "#fcd34d", indigo: "#60a5fa",
      },
    },
  },

  ocean: {
    label: "Ocean",
    blurb: "Deep sky and teal — water and rain",
    swatch: "#1d4ed8",
    light: {
      background: "#eff5fb",
      primary: "#1d4ed8", "primary-foreground": "#ffffff",
      accent: "#dbeafe", "accent-foreground": "#1e3a8a",
      ring: "#3b82f6",
      "brand-50": "#eff6ff", "brand-100": "#dbeafe", "brand-200": "#bfdbfe",
      "brand-300": "#93c5fd", "brand-400": "#60a5fa", "brand-500": "#3b82f6",
      "brand-600": "#2563eb", "brand-700": "#1d4ed8", "brand-800": "#1e40af",
      "brand-900": "#1e3a8a",
      chart: {
        green: "#1d4ed8", blue: "#0891b2", amber: "#0d9488", purple: "#7c3aed",
        red: "#dc2626", teal: "#c2410c", orange: "#65a30d", indigo: "#4f46e5",
      },
    },
    dark: {
      background: "#060f1a",
      primary: "#60a5fa", "primary-foreground": "#041424",
      accent: "#0d2038", "accent-foreground": "#bfdbfe",
      ring: "#60a5fa",
      "brand-50": "#08182c", "brand-100": "#0c2138", "brand-200": "#123049",
      "brand-300": "#1a4266", "brand-400": "#255a88", "brand-500": "#2f6fab",
      "brand-600": "#3b82f6", "brand-700": "#60a5fa", "brand-800": "#93c5fd",
      "brand-900": "#bfdbfe",
      chart: {
        green: "#60a5fa", blue: "#22d3ee", amber: "#2dd4bf", purple: "#a78bfa",
        red: "#f87171", teal: "#fb923c", orange: "#a3e635", indigo: "#818cf8",
      },
    },
  },

  plum: {
    label: "Plum",
    blurb: "Violet and orchid — AI and analytics",
    swatch: "#7e22ce",
    light: {
      background: "#f8f4fc",
      primary: "#7e22ce", "primary-foreground": "#ffffff",
      accent: "#f3e8ff", "accent-foreground": "#581c87",
      ring: "#a855f7",
      "brand-50": "#faf5ff", "brand-100": "#f3e8ff", "brand-200": "#e9d5ff",
      "brand-300": "#d8b4fe", "brand-400": "#c084fc", "brand-500": "#a855f7",
      "brand-600": "#9333ea", "brand-700": "#7e22ce", "brand-800": "#6b21a8",
      "brand-900": "#581c87",
      chart: {
        green: "#7e22ce", blue: "#db2777", amber: "#0891b2", purple: "#2563eb",
        red: "#dc2626", teal: "#65a30d", orange: "#c2410c", indigo: "#4f46e5",
      },
    },
    dark: {
      background: "#0d0818",
      primary: "#c084fc", "primary-foreground": "#1e0a3f",
      accent: "#241546", "accent-foreground": "#e9d5ff",
      ring: "#c084fc",
      "brand-50": "#120b24", "brand-100": "#1b1036", "brand-200": "#27184c",
      "brand-300": "#38236b", "brand-400": "#4c2d8f", "brand-500": "#6237b3",
      "brand-600": "#7e22ce", "brand-700": "#a855f7", "brand-800": "#c4a1f5",
      "brand-900": "#e4d3fb",
      chart: {
        green: "#c084fc", blue: "#f472b6", amber: "#22d3ee", purple: "#60a5fa",
        red: "#f87171", teal: "#a3e635", orange: "#fb923c", indigo: "#818cf8",
      },
    },
  },

  cacao: {
    label: "Cacao",
    blurb: "Earth and clay — soil and storage",
    swatch: "#92400e",
    light: {
      background: "#faf6f1",
      primary: "#92400e", "primary-foreground": "#ffffff",
      accent: "#f5e6d3", "accent-foreground": "#78350f",
      ring: "#b45309",
      "brand-50": "#fdf8f3", "brand-100": "#f5e6d3", "brand-200": "#e8cfae",
      "brand-300": "#d9b183", "brand-400": "#c68e4f", "brand-500": "#b45309",
      "brand-600": "#92400e", "brand-700": "#78350f", "brand-800": "#5c3a0c",
      "brand-900": "#3f2708",
      chart: {
        green: "#92400e", blue: "#15803d", amber: "#0891b2", purple: "#b45309",
        red: "#dc2626", teal: "#4f46e5", orange: "#a16207", indigo: "#be123c",
      },
    },
    dark: {
      background: "#120c07",
      primary: "#d9a066", "primary-foreground": "#241505",
      accent: "#2a1e13", "accent-foreground": "#f0dcc0",
      ring: "#d9a066",
      "brand-50": "#1a120b", "brand-100": "#261a10", "brand-200": "#372516",
      "brand-300": "#4d3420", "brand-400": "#6b492a", "brand-500": "#8a5f35",
      "brand-600": "#b45309", "brand-700": "#d9a066", "brand-800": "#ecc79c",
      "brand-900": "#f7e6cd",
      chart: {
        green: "#d9a066", blue: "#4ade80", amber: "#22d3ee", purple: "#f59e0b",
        red: "#f87171", teal: "#818cf8", orange: "#facc15", indigo: "#fb7185",
      },
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Public catalogue                                                          */
/* -------------------------------------------------------------------------- */

/** Palette metadata, in the order the picker shows them. */
export const PALETTE_LIST = Object.entries(HUES).map(([id, p]) => ({
  id,
  label: p.label,
  blurb: p.blurb,
  swatch: p.swatch,
}));

export const PALETTE_IDS = PALETTE_LIST.map((p) => p.id);
export const DEFAULT_PALETTE = "mavuno";

/** The chart hues, in the order every multi-series chart draws them. */
const CHART_ORDER = ["green", "blue", "amber", "purple", "red", "teal", "orange", "indigo"];

/**
 * Adds an alpha channel to a #rrggbb colour.
 *
 * Charts need translucent fills (the cursor band behind a hovered column, the
 * wash under a sparkline) and those have to be concrete values — an SVG
 * presentation attribute cannot resolve `var()`, and `color-mix()` is a CSS
 * function that presentation attributes do not accept either.
 */
export function withAlpha(hex, alpha) {
  const m = /^#?([\da-f]{6})$/i.exec(String(hex).trim());
  if (!m) return hex;
  const int = parseInt(m[1], 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

/** Legacy aliases the older components still reach for. */
const LEGACY = {
  g50: "brand-50",
  g100: "brand-100",
  g500: "brand-500",
  g700: "brand-700",
  g900: "brand-900",
  gold: "brand-400",
  "color-blue": "chart-blue",
  "color-blue-dark": "chart-indigo",
  "color-red": "chart-red",
  "color-purple": "chart-purple",
  "color-green-mid": "chart-teal",
  "color-green-soft": "brand-300",
  "color-orange": "chart-orange",
  "color-indigo": "chart-indigo",
  "color-map-pin": "chart-green",
  "color-map-market": "chart-red",
  "color-map-storage": "chart-blue",
};

/**
 * Builds the complete token set for a palette in a mode.
 *
 * The result is a flat map of CSS custom property names to values, plus a
 * `chart` object of concrete hex strings that JavaScript charts can use
 * directly — SVG presentation attributes cannot resolve `var()`.
 */
export function buildTokens(paletteId = DEFAULT_PALETTE, mode = "light") {
  const neutral = NEUTRALS[mode] ?? NEUTRALS.light;
  const hue = (HUES[paletteId] ?? HUES[DEFAULT_PALETTE])[mode] ??
    (HUES[paletteId] ?? HUES[DEFAULT_PALETTE]).light;

  const tokens = { ...neutral, ...hue };

  // Flatten the chart hues into --chart-1..8 for CSS consumers.
  CHART_ORDER.forEach((name, i) => {
    tokens[`chart-${i + 1}`] = hue.chart[name];
  });

  // Legacy aliases resolve to the current palette's equivalents. A target of
  // "brand-300" reads a brand token; a target of "chart-teal" reads a chart hue.
  for (const [legacy, target] of Object.entries(LEGACY)) {
    tokens[legacy] = target.startsWith("brand-")
      ? tokens[target]
      : hue.chart[target.slice("chart-".length)];
  }

  // The sidebar picks up the brand so every theme feels coherent.
  tokens["sidebar-primary"] = tokens.primary;
  tokens["sidebar-primary-fg"] = tokens["primary-foreground"];

  // Translucent accents derived from the brand, for chart cursors and washes.
  tokens["chart-cursor"] = withAlpha(tokens.primary, mode === "dark" ? 0.12 : 0.08);
  tokens["chart-grid"] = tokens.border;

  return { tokens, chart: hue.chart };
}
