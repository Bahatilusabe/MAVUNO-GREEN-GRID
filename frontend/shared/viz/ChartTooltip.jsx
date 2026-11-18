import { useChartTheme } from "./useChartTheme";

export default function ChartTooltip({ active, payload, label, format }) {
  const t = useChartTheme();
  if (!active || !payload?.length) return null;

  return (
    <div
      className="min-w-[150px] rounded-xl px-3 py-2.5 text-xs shadow-xl"
      style={{ background: t.tooltipBg, border: `1px solid ${t.tooltipBorder}`, color: t.tooltipText }}
    >
      {label != null && <div className="mb-1.5 font-semibold">{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey ?? p.name} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          <span style={{ color: t.text }}>{p.name}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums">
            {format ? format(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}