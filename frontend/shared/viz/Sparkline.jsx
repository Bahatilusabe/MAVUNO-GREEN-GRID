import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useChartTheme } from "./useChartTheme";

export default function Sparkline({ values = [], color, height = 36 }) {
  const t = useChartTheme();
  const uid = useId().replace(/:/g, "");
  const stroke = color ?? t.series[0];
  const data = values.map((v, i) => ({ i, v: Number(v) || 0 }));
  if (data.length < 2) return null;

  return (
    <div className="w-full min-w-0" style={{ height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${uid})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}