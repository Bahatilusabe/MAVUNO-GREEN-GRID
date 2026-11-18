import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useChartTheme } from "./useChartTheme";

const defaultFormat = (v) => Number(v).toLocaleString("en-KE");

export default function DonutBreakdown({
  data = [],
  height = 220,
  format = defaultFormat,
  centerLabel = "Total",
}) {
  const t = useChartTheme();
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const items = data.map((d, i) => ({ ...d, color: d.color ?? t.series[i % t.series.length] }));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full min-w-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip format={format} />} />
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="92%"
              paddingAngle={total > 0 ? 3 : 0}
              cornerRadius={6}
              stroke="none"
            >
              {items.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-extrabold tabular-nums">{format(total)}</span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {items.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="truncate text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-semibold tabular-nums">{format(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}