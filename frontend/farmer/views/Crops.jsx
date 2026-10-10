import { useMemo, useState } from "react";
import { Sprout, Calendar, Package, Plus } from "lucide-react";
import { fmt } from "../../shared/utils";
import { riskClass } from "../constants";
import { CropIcon, Thumb } from "../components/ui";

const time = (f) => Date.parse(f.harvest) || Infinity;

export default function Crops({ farms, crops = [], onOpen, onAdd }) {
  const [tab, setTab] = useState("My Crops");
  const records = useMemo(() => crops.length ? crops.map((crop) => ({
    ...crop,
    farm: farms.find((item) => item.id === crop.farm_id),
  })) : farms.map((farm) => ({
    id: farm.id,
    farm_id: farm.id,
    crop_type: farm.crop,
    expected_harvest_date: farm.harvest,
    expected_yield: farm.kg,
    status: farm.stage,
    farm,
  })), [crops, farms]);
  const sorted = [...records].sort((a, b) => time({ harvest: a.expected_harvest_date }) - time({ harvest: b.expected_harvest_date }));

  return (
    <div className="space-y-6 pb-12">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 gap-8">
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
        <button onClick={onAdd} className="ml-auto mb-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-700 text-white text-xs font-semibold hover:bg-green-800">
          <Plus size={15} /> Add crop
        </button>
      </div>

      {tab === "My Crops" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const farm = record.farm || farms.find((item) => item.id === record.farm_id);
            return (
            <button
              key={record.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex items-center gap-4 text-left hover:border-green-400 hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onOpen(record.farm_id)}
            >
              <div className="flex-shrink-0">
                <Thumb crop={record.crop_type} size={64} />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                  {record.crop_type}
                </strong>
                <small className="text-xs text-gray-500 block mt-0.5">
                  {((record.expected_yield || 0) / 1000).toFixed(1)} t expected • {farm?.name}
                </small>
                <div className="mt-2">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${riskClass(f.risk)}`}>
                    {farm?.risk || "Low"} Risk
                  </span>
                </div>
              </div>
            </button>
          )})}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-green-50/40">
            <h3 className="font-bold text-green-900 flex items-center gap-2"><Calendar className="text-green-600" size={19} /> Harvest calendar</h3>
            <p className="text-xs text-gray-500 mt-1">Use these dates to plan storage reservations, buyer conversations, and transport.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {sorted.map((record) => (
              <button key={record.id} onClick={() => onOpen(record.farm_id)} className="w-full p-4 text-left flex flex-wrap items-center gap-4 hover:bg-gray-50">
                <span className="w-28 text-sm font-bold text-gray-900">{record.expected_harvest_date || "Date pending"}</span>
                <span className="font-semibold text-green-800">{record.crop_type}</span>
                <span className="text-xs text-gray-500">{record.farm?.name}</span>
                <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">{record.status}</span>
              </button>
            ))}
          </div>
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
              {sorted.map((record) => {
                const farm = record.farm || farms.find((item) => item.id === record.farm_id);
                return (
                <tr
                  key={record.id}
                  onClick={() => onOpen(record.farm_id)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                        <CropIcon crop={record.crop_type} size={16} />
                      </div>
                      <span className="group-hover:text-green-700 transition-colors">{record.crop_type}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">
                    {farm?.name?.replace(" Farm", "")}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" /> {record.expected_harvest_date || "Pending"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-gray-400" /> {fmt(record.expected_yield)} {record.yield_unit}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${riskClass(f.risk)}`}>
                      {farm?.risk || "Low"}
                    </span>
                  </td>
                </tr>
              )})}
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