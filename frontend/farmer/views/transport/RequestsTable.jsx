import { Sprout, Eye, Calendar, MapPin, Package } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { StatusPill } from "../../components/page-parts";

export default function RequestsTable({ requests, onView }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Package className="text-green-600" aria-hidden="true" size={20} /> 
          Transport Requests
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          {requests.length} Total
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Crop</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Origin</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Required By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                      <Sprout size={16} aria-hidden="true" />
                    </div>
                    <span>{r.crop}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{fmt(r.kg)} kg</td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" /> {r.from}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" /> {r.to}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" /> {r.by}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <StatusPill status={r.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={() => onView(r)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No transport requests found.
        </div>
      )}
    </section>
  );
}