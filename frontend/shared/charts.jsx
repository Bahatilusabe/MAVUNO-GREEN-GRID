import { useId } from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, ComposedChart,
} from "recharts";
import { COLORS, PALETTE, SERIES_COLORS, GRID, AXIS, CURSOR, riskColor } from "./chartColors";
import { cn } from "../src/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shared chart chrome                                                       */
/* -------------------------------------------------------------------------- */

const MARGIN = { top: 12, right: 12, left: -12, bottom: 0 };

const ANIM = { isAnimationActive: true, animationDuration: 900, animationEasing: "ease-out" };

const id = (v) => v;

const axisProps = { ...AXIS, minTickGap: 12 };

/** Recharts needs a CSS-safe id for gradient references. */
const safeId = (raw) => `mgg-${String(raw).replace(/[^a-zA-Z0-9-_]/g, "")}`;

/**
 * The single tooltip used by every chart. Recharts' built-in tooltip cannot
 * be styled to match the cards, so each chart passes this instead.
 */
export function ChartTooltip({ active, payload, label, unit = "", valueFormatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="pointer-events-none min-w-[9rem] rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-pop backdrop-blur-sm">
      {label != null && (
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      <ul className="space-y-1">
        {payload.map((entry, i) => {
          const color = entry.color || entry.payload?.color || COLORS.green;
          const raw = entry.value;
          const text =
            valueFormatter != null
              ? valueFormatter(raw, entry)
              : `${Number(raw).toLocaleString()}${entry.unit ?? unit}`;
          return (
            <li key={`${entry.dataKey ?? i}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  className="h-2 w-2 flex-none rounded-full"
                  style={{ background: color }}
                  aria-hidden="true"
                />
                {entry.name ?? entry.dataKey}
              </span>
              <span className="text-xs font-bold tabular text-foreground">{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const legendProps = {
  iconType: "circle",
  iconSize: 8,
  wrapperStyle: { paddingTop: "14px", fontSize: "12px", fontWeight: 600 },
};

/**
 * A gradient-filled area, used for every area series so charts have depth
 * instead of flat translucent blocks.
 */
function GradientArea({ dataKey, color, idPrefix, name }) {
  const gid = safeId(`${idPrefix}-${dataKey}`);
  return (
    <>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.32} />
          <stop offset="55%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <Area
        dataKey={dataKey}
        name={name ?? dataKey}
        type="monotone"
        stroke={color}
        strokeWidth={2.5}
        fill={`url(#${gid})`}
        activeDot={{ r: 4, strokeWidth: 0 }}
        {...ANIM}
      />
    </>
  );
}

/**
 * Card wrapper for a chart: title, subtitle, actions and a consistent
 * height, so every analytics panel on the platform lines up.
 */
export function ChartFrame({
  title,
  subtitle,
  icon: Icon,
  actions,
  badge,
  height = 260,
  className,
  children,
}) {
  return (
    <section className={cn("surface flex flex-col overflow-hidden", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <span
              className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
              aria-hidden="true"
            >
              <Icon size={18} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs font-medium text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {badge}
          {actions}
        </div>
      </header>
      <div className="flex-1 px-2 py-4 sm:px-3" style={{ minHeight: height }}>
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Charts                                                                    */
/* -------------------------------------------------------------------------- */

export function HarvestChart({ labels, supply, demand, height = 240 }) {
  const uid = useId();
  const data = labels.map((day, i) => ({ day, supply: supply[i], demand: demand[i] }));
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <AreaChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis unit="t" {...axisProps} />
        <Tooltip content={<ChartTooltip unit=" t" />} cursor={{ stroke: GRID }} />
        <Legend {...legendProps} />
        <GradientArea idPrefix={uid} dataKey="supply" name="Expected production" color={SERIES_COLORS.supply} />
        <GradientArea idPrefix={uid} dataKey="demand" name="Market demand" color={SERIES_COLORS.demand} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * Compact trend line used inside KPI tiles. It animates in and colours by
 * direction, so a row of sparklines reads as a set.
 */
export function Sparkline({ data, up = true, height = 28, width = 88, color }) {
  const rows = data.map((v, i) => ({ i, v }));
  const stroke = color ?? (up ? COLORS.green : COLORS.red);
  return (
    <div style={{ width, height }} className="flex-none" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={rows} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({
  data,
  xKey,
  yKey,
  color = COLORS.green,
  format = id,
  height = 200,
  label,
  unit = "",
  showLegend = false,
}) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <BarChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis tickFormatter={format} {...axisProps} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${format(v)}${unit}`} />}
          cursor={{ fill: CURSOR }}
        />
        {showLegend && <Legend {...legendProps} />}
        <Bar
          dataKey={yKey}
          name={label}
          fill={color}
          radius={[6, 6, 0, 0]}
          maxBarSize={44}
          {...ANIM}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Stacked columns — used for the value chain (farm -> market -> customer). */
export function StackedBars({
  data,
  xKey,
  series,
  height = 240,
  format = id,
  unit = "",
}) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <BarChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis tickFormatter={format} {...axisProps} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${format(v)}${unit}`} />}
          cursor={{ fill: CURSOR }}
        />
        <Legend {...legendProps} />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stackId="stack"
            fill={s.color}
            radius={s.last ? [6, 6, 0, 0] : undefined}
            maxBarSize={52}
            {...ANIM}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HBars({ data, nameKey, valueKey, height = 220, unit = "%", max = 100 }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" domain={[0, max]} unit={unit} {...axisProps} />
        <YAxis type="category" dataKey={nameKey} width={82} {...axisProps} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${v}${unit}`} />}
          cursor={{ fill: CURSOR }}
        />
        <Bar dataKey={valueKey} radius={[0, 6, 6, 0]} barSize={14} {...ANIM}>
          {data.map((d) => (
            <Cell key={d[nameKey]} fill={riskColor(d[valueKey])} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, unit = "", height = 220, colors }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={3}
          stroke="none"
          {...ANIM}
        >
          {data.map((d, i) => (
            <Cell key={d.name} fill={d.color ?? colors?.[i] ?? PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${Number(v).toLocaleString()}${unit}`} />}
        />
        <Legend {...legendProps} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, xKey, series, format = id, height = 240, unit = "" }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <LineChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis tickFormatter={format} {...axisProps} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${format(v)}${unit}`} />}
          cursor={{ stroke: GRID }}
        />
        <Legend {...legendProps} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: s.color }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            {...ANIM}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Combination chart: bars for volume, a line for price. Used where the two
 * units differ, e.g. tonnes harvested against KES/kg price.
 */
export function ComboChart({
  data,
  xKey,
  barKey,
  lineKey,
  barColor = COLORS.green,
  lineColor = COLORS.amber,
  height = 260,
}) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <ComposedChart data={data} margin={MARGIN}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis yAxisId="left" {...axisProps} />
        <YAxis yAxisId="right" orientation="right" {...axisProps} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: CURSOR }} />
        <Legend {...legendProps} />
        <Bar yAxisId="left" dataKey={barKey} name="Volume (t)" fill={barColor} radius={[6, 6, 0, 0]} maxBarSize={46} {...ANIM} />
        <Line yAxisId="right" type="monotone" dataKey={lineKey} name="Price (KES/kg)" stroke={lineColor} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} {...ANIM} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/**
 * Radial gauge for a single percentage — capacity used, risk score,
 * fulfilment rate. The value sits in the middle of the arc.
 */
export function Gauge({ value = 0, label, caption, height = 200, color }) {
  const data = [{ name: label ?? "value", value }];
  const tone = color ?? riskColor(value);
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <RadialBarChart
          data={data}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={220}
          endAngle={-40}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={12}
            fill={tone}
            background={{ fill: GRID }}
            {...ANIM}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tracking-tight tabular text-foreground">
          {Math.round(value)}%
        </span>
        {label && <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>}
        {caption && <span className="mt-0.5 text-xs font-medium text-muted-foreground">{caption}</span>}
      </div>
    </div>
  );
}
