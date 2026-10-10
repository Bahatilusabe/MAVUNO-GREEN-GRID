export const COLORS = {
  green: "var(--g500)",
  blue: "var(--color-blue)",
  red: "var(--color-red)",
  amber: "var(--gold)",
  purple: "var(--color-purple)",
};
export const PALETTE = [COLORS.green, COLORS.blue, COLORS.amber, COLORS.red, COLORS.purple];


export const GRID = "var(--border)";
export const AXIS = { tick: { fontSize: 11, fill: "var(--muted-foreground)" }, tickLine: false, axisLine: false };
export const TIP = {
  contentStyle: { borderRadius: 10, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", fontSize: 12, padding: "8px 10px" },
  labelStyle: { color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 2 },
};