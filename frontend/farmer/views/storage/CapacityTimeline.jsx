import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { COLORS, GRID, AXIS, TIP } from "../../../shared/chartColors";

export default function CapacityTimeline({ facilities }) {
  const data = facilities.map((f) => ({ name: f.name, available: f.available, reserved: f.reserved }));
  return (
    <section className="card">
      <h3>Storage Capacity</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis type="number" unit="t" {...AXIS} />
          <YAxis type="category" dataKey="name" width={130} {...AXIS} />
          <Tooltip {...TIP} formatter={(v) => `${v} t`} cursor={{ fill: "#f3faf6" }} />
          <Legend iconType="circle" />
          <Bar dataKey="available" name="Available" stackId="s" fill={COLORS.green} />
          <Bar dataKey="reserved" name="Reserved" stackId="s" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}