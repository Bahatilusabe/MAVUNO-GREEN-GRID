import { useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { COLORS, GRID, AXIS, TIP } from "../../../shared/chartColors";
import { Tabs } from "../../components/ui";
import { SERIES } from "./data";

const RANGES = { "6M": 6, "12M": 12, All: SERIES.length };

export default function Trend() {
  const [range, setRange] = useState("6M");
  const data = SERIES.slice(-RANGES[range]);
  return (
    <section className="card">
      <div className="row">
        <h3 className="grow">Monthly Impact Trend</h3>
        <Tabs tabs={Object.keys(RANGES)} active={range} onChange={setRange} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} />
          <Tooltip {...TIP} />
          <Legend iconType="circle" />
          <Bar dataKey="produce" name="Produce Saved (t)" fill="#86d3a3" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="value" name="Value Protected (KES 100k)" stroke={COLORS.blue} strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="co2" name="CO₂e Avoided (t)" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}