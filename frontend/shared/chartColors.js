export const COLORS = {
  green: "var(--g500)",
  greenDeep: "var(--g700)",
  blue: "var(--color-blue)",
  blueDark: "var(--color-blue-dark)",
  red: "var(--color-red)",
  amber: "var(--gold)",
  purple: "var(--color-purple)",
  teal: "var(--color-green-mid)",
  orange: "var(--color-orange)",
  indigo: "var(--color-indigo)",
};

export const PALETTE = [
  COLORS.green,
  COLORS.blue,
  COLORS.amber,
  COLORS.purple,
  COLORS.red,
  COLORS.teal,
  COLORS.orange,
  COLORS.indigo,
];

/**
 * Series order used by every multi-series chart. Keeping one order means a
 * farmer's supply/demand chart and an admin's county chart read the same way.
 */
export const SERIES_COLORS = {
  supply: COLORS.green,
  demand: COLORS.blue,
  expected: COLORS.green,
  actual: COLORS.blue,
  waste: COLORS.amber,
  income: COLORS.green,
  risk: COLORS.red,
  volume: COLORS.purple,
  price: COLORS.amber,
  capacity: COLORS.blue,
  used: COLORS.green,
  available: COLORS.blue,
};

export const GRID = "var(--border)";
export const AXIS = {
  tick: { fontSize: 11, fill: "var(--muted-foreground)" },
  tickLine: false,
  axisLine: false,
};
export const TIP = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-sm)",
    fontSize: 12,
    padding: "8px 10px",
  },
  labelStyle: { color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 2 },
};

/** Risk thresholds shared by the capacity and risk charts. */
export const riskColor = (v) =>
  v >= 60 ? COLORS.red : v >= 35 ? COLORS.amber : COLORS.green;
