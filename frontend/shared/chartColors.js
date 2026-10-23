/**
 * Chart colours, resolved from the active theme.
 *
 * Recharts writes `fill` and `stroke` as SVG *presentation attributes*, and
 * an attribute cannot resolve `var()` — so the palette has to reach the
 * charts as concrete values. This module keeps a live copy of the current
 * theme's chart hues; the provider refreshes it on every theme change, and
 * the exports below read through to it.
 *
 * Because ES module imports are live bindings, `COLORS.green` re-reads the
 * active palette on every render. Components pick up a theme switch without
 * needing to know that themes exist.
 */

/** The chart hues, in the order every multi-series chart draws them. */
const CHART_ORDER = ["green", "blue", "amber", "purple", "red", "teal", "orange", "indigo"];

const FALLBACK_CHART = {
  green: "#15803d",
  blue: "#2563eb",
  amber: "#d97706",
  purple: "#7c3aed",
  red: "#dc2626",
  teal: "#0d9488",
  orange: "#ea580c",
  indigo: "#4f46e5",
};

const FALLBACK = {
  chart: FALLBACK_CHART,
  palette: CHART_ORDER.map((n) => FALLBACK_CHART[n]),
  grid: "#dbe5dd",
  text: "#5a6b61",
  cursor: "rgba(21, 128, 61, 0.08)",
  card: "#ffffff",
  popover: "#ffffff",
};

/**
 * Semantic series names, mapped onto the active palette.
 *
 * Kept as one map so a farmer's supply/demand chart and an admin's county
 * chart read the same way: green is always production, blue is always
 * demand, red is always risk.
 */
function buildSeries(chart) {
  return {
    supply: chart.green,
    demand: chart.blue,
    expected: chart.green,
    actual: chart.blue,
    waste: chart.amber,
    income: chart.green,
    risk: chart.red,
    volume: chart.purple,
    price: chart.amber,
    capacity: chart.blue,
    used: chart.green,
    available: chart.blue,
    temperature: chart.orange,
    rainfall: chart.blue,
  };
}

let live = FALLBACK;

/* -------------------------------------------------------------------------- */
/*  Live exports                                                              */
/* -------------------------------------------------------------------------- */

/** The eight chart hues, in draw order. */
export let PALETTE = live.palette;

/** The gridline colour, matched to the active theme's border. */
export let GRID = live.grid;

/** Axis text and lines. */
export let AXIS = { tick: { fontSize: 11, fill: live.text }, tickLine: false, axisLine: false };

/** The wash drawn behind a hovered column. */
export let CURSOR = live.cursor;

/** The series colours for named meanings. */
export let SERIES_COLORS = buildSeries(live.chart);

/** Named chart hues, read through to the active palette. */
export const COLORS = {
  get green() { return live.chart.green; },
  get blue() { return live.chart.blue; },
  get blueDark() { return live.chart.indigo; },
  get red() { return live.chart.red; },
  get amber() { return live.chart.amber; },
  get purple() { return live.chart.purple; },
  get teal() { return live.chart.teal; },
  get orange() { return live.chart.orange; },
  get indigo() { return live.chart.indigo; },
  /** The unfilled track behind a progress ring. */
  get track() { return live.track; },
  /** The foreground ink, for labels drawn inside an SVG. */
  get ink() { return live.ink; },
};

/**
 * Publishes the active theme's chart colours.
 *
 * Called by the theme provider while it renders, so a chart that renders in
 * the same pass already sees the new palette.
 */
export function syncChartTheme(chart, tokens = {}) {
  const merged = { ...FALLBACK_CHART, ...(chart ?? {}) };
  live = {
    chart: merged,
    palette: CHART_ORDER.map((n) => merged[n]),
    grid: tokens.border || FALLBACK.grid,
    text: tokens["muted-foreground"] || FALLBACK.text,
    cursor: tokens["chart-cursor"] || FALLBACK.cursor,
    card: tokens.card || FALLBACK.card,
    popover: tokens.popover || FALLBACK.popover,
    track: tokens.muted || FALLBACK.grid,
    ink: tokens.foreground || "#0d1f16",
  };
  PALETTE = live.palette;
  SERIES_COLORS = buildSeries(merged);
  GRID = live.grid;
  CURSOR = live.cursor;
  AXIS = { tick: { fontSize: 11, fill: live.text }, tickLine: false, axisLine: false };
}

/**
 * The single tooltip used by every chart.
 *
 * These are inline styles rather than SVG attributes, so `var()` is safe
 * here and the tooltip keeps following the theme on its own.
 */
export const TIP = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    boxShadow: "var(--elev-pop)",
    fontSize: 12,
    padding: "8px 10px",
  },
  labelStyle: { color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 2 },
};

/** Risk thresholds shared by the capacity and risk charts. */
export const riskColor = (v) =>
  v >= 60 ? COLORS.red : v >= 35 ? COLORS.amber : COLORS.green;
