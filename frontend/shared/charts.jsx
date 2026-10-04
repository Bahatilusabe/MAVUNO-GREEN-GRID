import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { COLORS } from "./chartColors";

const GRID = "#dcebe2";
const axis = { tick: { fontSize: 11, fill: "#5d7266" }, tickLine: false, axisLine: false };
const MARGIN = { top: 8, right: 8, left: -8, bottom: 0 };
const id = (v) => v;
const TIP = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid #dcebe2",
    boxShadow: "0 4px 14px rgba(11,61,32,.12)",
    fontSize: 12,
    padding: "8px 10px",
  },
  labelStyle: { color: "#5d7266", fontWeight: 600, marginBottom: 2 },
};

export function HarvestChart({ labels, supply, demand, height = 240 }) {
  const data = labels.map((day, i) => ({ day, supply: supply[i], demand: demand[i] }));
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <AreaChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" {...axis} />
        <YAxis unit="t" {...axis} />
        <Tooltip {...TIP} formatter={(v) => `${v} t`} />
        <Legend iconType="circle" />
        <Area type="monotone" dataKey="supply" name="Expected production" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.15} strokeWidth={2.5} />
        <Area type="monotone" dataKey="demand" name="Market demand" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.12} strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, up }) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: 80, height: 26, flex: "none" }} aria-hidden>
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
        <Tooltip {...TIP} formatter={(v) => format(v)} cursor={{ fill: "#f3faf6" }} />
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
        <Tooltip {...TIP} formatter={(v) => `${v}%`} cursor={{ fill: "#f3faf6" }} />
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
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Pie>
        <Tooltip {...TIP} formatter={(v) => `${v.toLocaleString()}${unit}`} />
        <Legend iconType="circle" />
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
        <Tooltip {...TIP} formatter={(v) => format(v)} />
        <Legend iconType="circle" />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}