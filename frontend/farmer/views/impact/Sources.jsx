import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { TIP } from "../../../shared/chartColors";
import { SOURCES, TOTAL_IMPACT } from "./data";

export default function Sources() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <PieChartIcon className="text-green-600" aria-hidden="true" size={20} /> 
          Where Your Impact Comes From
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Breakdown
        </span>
      </div>

      {/* Content Body Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-grow">
        
        {/* Donut Chart Container (7 columns on medium screens) */}
        <div className="md:col-span-7 relative h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={SOURCES} 
                dataKey="value" 
                nameKey="name" 
                innerRadius="65%" 
                outerRadius="90%" 
                paddingAngle={3} 
                stroke="none"
              >
                {SOURCES.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip {...TIP} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered Total Impact Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Impact</span>
            <strong className="text-lg font-bold text-gray-900 mt-0.5">{TOTAL_IMPACT}</strong>
          </div>
        </div>

        {/* Legend List (5 columns on medium screens) */}
        <div className="md:col-span-5 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Impact Sources</h4>
          <div className="space-y-2.5">
            {SOURCES.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs" style={{ background: s.color }} />
                  <span className="font-medium text-gray-700 truncate">{s.name}</span>
                </div>
                <span className="font-bold text-gray-900 ml-2">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}