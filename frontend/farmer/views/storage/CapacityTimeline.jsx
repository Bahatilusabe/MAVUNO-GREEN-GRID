import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Warehouse } from "lucide-react";
import { COLORS, GRID, AXIS, TIP } from "../../../shared/chartColors";

export default function CapacityTimeline({ facilities }) {
  const data = facilities.map((f) => ({ name: f.name, available: f.available, reserved: f.reserved }));

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Warehouse className="text-green-600" aria-hidden="true" size={20} /> 
          Storage Capacity
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Facility Load
        </span>
      </div>

      {/* Chart Body */}
      <div className="p-4 sm:p-6 flex-grow">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={GRID} horizontal={false} />
            <XAxis type="number" unit="t" {...AXIS} />
            <YAxis type="category" dataKey="name" width={130} {...AXIS} />
            <Tooltip {...TIP} formatter={(v) => `${v} t`} cursor={{ fill: "#f3faf6" }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
            <Bar dataKey="available" name="Available" stackId="s" fill={COLORS.green} />
            <Bar dataKey="reserved" name="Reserved" stackId="s" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}