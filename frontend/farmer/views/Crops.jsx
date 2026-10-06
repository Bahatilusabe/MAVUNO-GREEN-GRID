import { useState } from "react";
import { Sprout, Calendar, Package, ChevronRight, AlertCircle } from "lucide-react";
import { fmt } from "../../shared/utils";
import { riskClass } from "../constants";
import { CropIcon, Tabs, Thumb } from "../components/ui";

const time = (f) => Date.parse(f.harvest) || Infinity;

export default function Crops({ farms, onOpen }) {
  const [tab, setTab] = useState("My Crops");
  const sorted = [...farms].sort((a, b) => time(a) - time(b));

  return (
    <div className="space-y-6 pb-12">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8">
        {["My Crops", "Harvest Calendar"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === t 
                ? "border-green-700 text-green-800" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "My Crops" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((f) => (
            <button
              key={f.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex items-center gap-4 text-left hover:border-green-400 hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onOpen(f.id)}
            >
              <div className="flex-shrink-0">
                <Thumb crop={f.crop} size={64} />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                  {f.crop}
                </strong>
                <small className="text-xs text-gray-500 block mt-0.5">
                  {(f.kg / 1000).toFixed(1)} t expected
                </small>
                <div className="mt-2">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${riskClass(f.risk)}`}>
                    {f.risk} Risk
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm flex flex-col items-center justify-center space-y-2">
          <Calendar className="text-green-600" size={28} />
          <span className="font-semibold text-gray-800 text-lg">Calendar view coming soon.</span>
          <p className="text-xs text-gray-400">We are building interactive scheduling tools for your harvests.</p>
        </div>
      )}

      {/* Upcoming Harvests Table Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
            <Sprout className="text-green-600" aria-hidden="true" size={20} /> 
            Upcoming Harvests
          </h3>
          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
            {sorted.length} Scheduled
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Crop</th>
                <th className="py-3 px-4">Farm</th>
                <th className="py-3 px-4">Expected Date</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {sorted.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => onOpen(f.id)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                        <CropIcon crop={f.crop} size={16} />
                      </div>
                      <span className="group-hover:text-green-700 transition-colors">{f.crop}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">
                    {f.name.replace(" Farm", "")}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" /> {f.harvest}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-gray-400" /> {fmt(f.kg)} kg
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${riskClass(f.risk)}`}>
                      {f.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No upcoming harvests recorded.
          </div>
        )}
      </section>
    </div>
  );
}