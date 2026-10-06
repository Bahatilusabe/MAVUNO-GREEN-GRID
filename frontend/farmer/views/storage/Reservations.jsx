import { Warehouse, Calendar, Package } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { StatusPill } from "../../components/page-parts";

export default function Reservations({ reservations }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Warehouse className="text-green-600" aria-hidden="true" size={20} /> 
          My Reservations
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          {reservations.length} Active
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Facility</th>
              <th className="py-3 px-4">Crop</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Harvest Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                      <Warehouse size={16} aria-hidden="true" />
                    </div>
                    <span>{r.facility}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-700 font-medium">{r.crop}</td>
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  <div className="flex items-center gap-1">
                    <Package size={14} className="text-gray-400" /> {fmt(r.kg)} kg
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <StatusPill status={r.status} />
                </td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" /> {r.date}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservations.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No storage reservations found.
        </div>
      )}
    </section>
  );
}