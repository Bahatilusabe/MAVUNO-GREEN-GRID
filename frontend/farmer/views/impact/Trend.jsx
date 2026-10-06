import { useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { LineChart as ChartIcon } from "lucide-react";
import { COLORS, GRID, AXIS, TIP } from "../../../shared/chartColors";
import { SERIES } from "./data";

const RANGES = { "6M": 6, "12M": 12, All: SERIES.length };

export default function Trend() {
  const [range, setRange] = useState("6M");
  const data = SERIES.slice(-RANGES[range]);

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header with Range Tabs */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <ChartIcon className="text-green-600" aria-hidden="true" size={20} /> 
          Monthly Impact Trend
        </h3>

        {/* Range Selection Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          {Object.keys(RANGES).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                range === r 
                  ? "bg-white text-green-800 shadow-xs" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      <div className="p-4 sm:p-6 flex-grow">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="month" {...AXIS} />
            <YAxis {...AXIS} />
            <Tooltip {...TIP} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
            <Bar dataKey="produce" name="Produce Saved (t)" fill="#86d3a3" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="value" name="Value Protected (KES 100k)" stroke={COLORS.blue} strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="co2" name="CO₂e Avoided (t)" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}