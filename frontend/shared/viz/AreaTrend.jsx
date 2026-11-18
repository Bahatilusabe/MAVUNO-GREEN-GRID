import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useChartTheme } from "./useChartTheme";

export default function AreaTrend({
  data = [],
  xKey = "label",
  series = [],
  height = 240,
  format,
  axisFormat,
  stacked = false,
}) {
  const t = useChartTheme();
  const uid = useId().replace(/:/g, "");
  const colorOf = (s, i) => s.color ?? t.series[i % t.series.length];

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorOf(s, i)} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colorOf(s, i)} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke={t.grid} strokeDasharray="3 4" />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: t.text, fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: t.text, fontSize: 12 }}
            tickFormatter={axisFormat ?? format}
          />
          <Tooltip content={<ChartTooltip format={format} />} cursor={{ stroke: t.grid, strokeWidth: 1 }} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={colorOf(s, i)}
              strokeWidth={2.5}
              fill={`url(#${uid}-${s.key})`}
              stackId={stacked ? "1" : undefined}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: t.tooltipBg }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}