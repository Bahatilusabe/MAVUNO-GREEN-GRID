import { CalendarDays, Tractor, ChevronRight } from "lucide-react";
import { riskClass } from "../../constants";
import { Thumb } from "../../components/ui";

export default function FarmsTable({ farms, onOpen, go }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Tractor className="text-green-600" aria-hidden="true" size={20} /> 
          My Farms
        </h3>
        <button 
          className="text-xs font-semibold text-green-700 hover:text-green-900 flex items-center gap-1 transition-colors"
          onClick={() => go("farms")}
        >
          View all farms <ChevronRight size={14} />
        </button>
      </div>

      {/* Table Headers (Desktop view) */}
      <div className="hidden sm:grid grid-cols-12 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
        <div className="col-span-6">Farm / Crop</div>
        <div className="col-span-4">Harvest Date</div>
        <div className="col-span-2 text-right">Risk Level</div>
      </div>

      {/* Farm List */}
      <div className="divide-y divide-gray-100">
        {farms.map((f) => (
          <button
            key={f.id}
            onClick={() => onOpen(f.id)}
            className="w-full text-left grid grid-cols-1 sm:grid-cols-12 items-center p-4 sm:px-5 sm:py-3.5 hover:bg-gray-50 transition-colors group"
          >
            {/* Farm Thumb & Name (6 columns on desktop) */}
            <div className="col-span-6 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Thumb crop={f.crop} size={40} />
              </div>
              <div className="min-w-0">
                <strong className="block text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                  {f.name}
                </strong>
                <small className="text-xs text-gray-500 block">{f.crop}</small>
              </div>
            </div>

            {/* Harvest Date (4 columns on desktop) */}
            <div className="col-span-4 mt-2 sm:mt-0 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <CalendarDays aria-hidden="true" size={15} className="text-gray-400" />
              <span>{f.harvest}</span>
            </div>

            {/* Risk Level Badge (2 columns on desktop) */}
            <div className="col-span-2 mt-2 sm:mt-0 text-left sm:text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${riskClass(f.risk)}`}>
                {f.risk} Risk
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}