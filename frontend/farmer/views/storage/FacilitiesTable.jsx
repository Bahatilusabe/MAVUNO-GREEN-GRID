import { Snowflake, Warehouse, MapPin, Banknote, ShieldCheck } from "lucide-react";
import { fmt } from "../../../shared/utils";

const TYPE_ICON = { "Cold Store": Snowflake, Refrigerated: Snowflake, Warehouse };

export default function FacilitiesTable({ facilities, requested, tons, onReserve }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" id="storage-facilities">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Warehouse className="text-green-600" aria-hidden="true" size={20} /> 
          Storage Facilities
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          {facilities.length} Locations
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Facility</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Available</th>
              <th className="py-3 px-4">Distance</th>
              <th className="py-3 px-4">Cost / Day</th>
              <th className="py-3 px-4">Compatible Crops</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {facilities.map((f) => {
              const Icon = TYPE_ICON[f.type] || Warehouse;
              const done = requested.includes(f.id);
              const full = f.available < tons;

              return (
                <tr key={f.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Facility Name & Icon */}
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                        <Icon size={16} aria-hidden="true" />
                      </div>
                      <span>{f.name}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 text-gray-600 text-xs font-medium">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{f.type}</span>
                  </td>

                  {/* Available Capacity */}
                  <td className="py-3.5 px-4 font-bold text-gray-900">{f.available.toFixed(1)} t</td>

                  {/* Distance */}
                  <td className="py-3.5 px-4 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-gray-400" /> {f.km} km
                    </div>
                  </td>

                  {/* Cost per day */}
                  <td className="py-3.5 px-4 text-gray-800 text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <Banknote size={12} className="text-green-600" /> KES {fmt(f.cost)}
                    </div>
                  </td>

                  {/* Compatible Crops */}
                  <td className="py-3.5 px-4 text-xs text-gray-500 max-w-[180px] truncate">
                    {f.crops}
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                        done
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : full
                            ? "bg-red-50 text-red-600 border border-red-200 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800 text-white"
                      }`}
                      disabled={done || full} 
                      title={full ? "Not enough free capacity" : undefined} 
                      onClick={() => onReserve(f)}
                    >
                      {done ? "Requested" : full ? "Full" : "Reserve"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {facilities.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No storage facilities found.
        </div>
      )}
    </section>
  );
}