import { Truck } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { STEPS } from "./data";

export default function Deliveries({ deliveries, selectedId, onSelect }) {
  const d = deliveries.find((x) => x.id === selectedId) || deliveries[0];

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col" id="deliveries">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Truck className="text-green-600" aria-hidden="true" size={20} /> 
          My Deliveries
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Live Tracking
        </span>
      </div>

      <div className="p-4 sm:p-6 flex flex-col space-y-6">
        {!d ? (
          <p className="text-sm text-gray-500 py-6 text-center">No active deliveries.</p>
        ) : (
          <>
            {/* Shipment Selection Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist">
              {deliveries.map((x) => {
                const isSelected = x.id === d.id;
                return (
                  <button
                    key={x.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => onSelect(x.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isSelected
                        ? "bg-green-700 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {x.crop}
                  </button>
                );
              })}
            </div>

            {/* Selected Delivery Details Card */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-start gap-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl flex-shrink-0">
                <Truck size={24} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-gray-900">
                  {d.crop} – <span className="text-green-700">{fmt(d.kg)} kg</span>
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  <span className="font-medium text-gray-900">{d.from}</span> → <span className="font-medium text-gray-900">{d.to}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium bg-white px-2 py-0.5 rounded border border-gray-100 w-fit">
                  {d.truck ? `Truck: ${d.truck}` : "Truck to be assigned"}
                </p>
              </div>
            </div>

            {/* Delivery Timeline / Steps Progress */}
            <div className="space-y-4 pt-2">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shipment Progress</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {STEPS.map((s, i) => {
                  const isDone = i < d.stage;
                  const isCurrent = i === d.stage;

                  return (
                    <div
                      key={s}
                      className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        isDone
                          ? "bg-green-50/60 border-green-200 text-green-900"
                          : isCurrent
                            ? "bg-white border-green-600 ring-1 ring-green-600 shadow-sm"
                            : "bg-gray-50/50 border-gray-200 text-gray-400 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-3 h-3 rounded-full ${
                          isDone ? "bg-green-600" : isCurrent ? "bg-amber-500 animate-pulse" : "bg-gray-300"
                        }`} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          Step {i + 1}
                        </span>
                      </div>
                      
                      <div>
                        <strong className={`block text-xs font-bold ${isDone || isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                          {s}
                        </strong>
                        <small className="text-[11px] block text-gray-500 mt-0.5">
                          {d.times[i] || "–"}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}