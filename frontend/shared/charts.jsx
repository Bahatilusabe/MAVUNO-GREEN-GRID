import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { COLORS } from "./chartColors";

const GRID = "#f1f5f9"; // Soft neutral gray for cleaner Tailwind contrast
const axis = { 
  tick: { fontSize: 11, fill: "#64748b" }, // slate-500
  tickLine: false, 
  axisLine: false 
};
const MARGIN = { top: 8, right: 8, left: -8, bottom: 0 };
const id = (v) => v;

const TIP = {
  contentStyle: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0", // slate-200
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    fontSize: "12px",
    padding: "10px 14px",
  },
  labelStyle: { color: "#0f172a", fontWeight: 700, marginBottom: "4px" },
  itemStyle: { padding: "2px 0", color: "#334155" },
};

export function HarvestChart({ labels, supply, demand, height = 240 }) {
  const data = labels.map((day, i) => ({ day, supply: supply[i], demand: demand[i] }));
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <AreaChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" {...axis} />
        <YAxis unit="t" {...axis} />
        <Tooltip {...TIP} formatter={(v) => [`${v} t`, undefined]} />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
        <Area type="monotone" dataKey="supply" name="Expected production" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.15} strokeWidth={2.5} />
        <Area type="monotone" dataKey="demand" name="Market demand" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.12} strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, up }) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <div className="w-20 h-[26px] flex-shrink-0" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={rows}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line type="monotone" dataKey="v" stroke={up ? COLORS.green : COLORS.red} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({ data, xKey, yKey, color = COLORS.green, format = id, height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <BarChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis tickFormatter={format} {...axis} />
        <Tooltip {...TIP} formatter={(v) => [format(v), undefined]} cursor={{ fill: "#f0fdf4" }} />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HBars({ data, nameKey, valueKey, height = 220 }) {
  const color = (v) => (v >= 60 ? COLORS.red : v >= 35 ? COLORS.amber : COLORS.green);
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} unit="%" {...axis} />
        <YAxis type="category" dataKey={nameKey} width={74} {...axis} />
        <Tooltip {...TIP} formatter={(v) => [`${v}%`, undefined]} cursor={{ fill: "#f0fdf4" }} />
        <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} barSize={14}>
          {data.map((d) => <Cell key={d[nameKey]} fill={color(d[valueKey])} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, unit = "", height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} stroke="none">
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Pie>
        <Tooltip {...TIP} formatter={(v) => [`${v.toLocaleString()}${unit}`, undefined]} />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, xKey, series, format = id, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <LineChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis tickFormatter={format} {...axis} />
        <Tooltip {...TIP} formatter={(v) => [format(v), undefined]} />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}