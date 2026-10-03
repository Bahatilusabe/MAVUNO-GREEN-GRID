import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

export const COLORS = { green: "#22a05a", blue: "#2563eb", red: "#dc2626", amber: "#f59e0b" };
export const PALETTE = ["#22a05a", "#2563eb", "#f59e0b", "#dc2626", "#7c3aed"];

const GRID = "#dcebe2";
const axis = { tick: { fontSize: 11, fill: "#5d7266" }, tickLine: false, axisLine: false };
const MARGIN = { top: 8, right: 8, left: -8, bottom: 0 };
const id = (v) => v;

export function HarvestChart({ labels, supply, demand, height = 240 }) {
  const data = labels.map((day, i) => ({ day, supply: supply[i], demand: demand[i] }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" {...axis} />
        <YAxis unit="t" {...axis} />
        <Tooltip formatter={(v) => `${v} t`} />
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
      <ResponsiveContainer width="100%" height="100%">
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
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis tickFormatter={format} {...axis} />
        <Tooltip formatter={(v) => format(v)} cursor={{ fill: "#f3faf6" }} />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HBars({ data, nameKey, valueKey, height = 220 }) {
  const color = (v) => (v >= 60 ? COLORS.red : v >= 35 ? COLORS.amber : COLORS.green);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} unit="%" {...axis} />
        <YAxis type="category" dataKey={nameKey} width={74} {...axis} />
        <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: "#f3faf6" }} />
        <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} barSize={14}>
          {data.map((d) => <Cell key={d[nameKey]} fill={color(d[valueKey])} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, unit = "", height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Pie>
        <Tooltip formatter={(v) => `${v.toLocaleString()}${unit}`} />
        <Legend iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, xKey, series, format = id, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis tickFormatter={format} {...axis} />
        <Tooltip formatter={(v) => format(v)} />
        <Legend iconType="circle" />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}