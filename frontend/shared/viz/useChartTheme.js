import { useMemo } from "react";
import { useTheme } from "../../src/theme/useTheme";

/**
 * The chart chrome for the current theme.
 *
 * Every value is a concrete colour, because recharts writes them into SVG
 * presentation attributes and an attribute cannot resolve `var()`. The hues
 * follow the active palette, so a chart is as colourful as the theme it is
 * drawn in.
 */
export function useChartTheme() {
  const { chart, tokens } = useTheme();

  return useMemo(
    () => ({
      text: tokens["muted-foreground"] ?? "#5a6b61",
      grid: tokens.border ?? "#dbe5dd",
      cursor: tokens["chart-cursor"] ?? "rgba(21, 128, 61, 0.08)",
      tooltipBg: tokens.popover ?? "#ffffff",
      tooltipBorder: tokens.border ?? "#dbe5dd",
      tooltipText: tokens.foreground ?? "#0d1f16",
      series: [
        chart.green,
        chart.blue,
        chart.amber,
        chart.purple,
        chart.red,
        chart.teal,
        chart.orange,
        chart.indigo,
      ],
    }),
    [chart, tokens],
  );
}
