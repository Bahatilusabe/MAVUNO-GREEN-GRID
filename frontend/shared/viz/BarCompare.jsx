import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useChartTheme } from "./useChartTheme";

export default function BarCompare({
  data = [],
  xKey = "label",
  series = [],
  height = 240,
  format,
  axisFormat,
}) {
  const t = useChartTheme();

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={4}>
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
          <Tooltip content={<ChartTooltip format={format} />} cursor={{ fill: t.cursor }} />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={s.color ?? t.series[i % t.series.length]}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}