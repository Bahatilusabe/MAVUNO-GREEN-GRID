import { ShieldCheck, Activity } from "lucide-react";
import { StatusPill } from "../../components/page-parts";
import { INTERVENTIONS } from "./data";

export default function Interventions() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Activity className="text-green-600" aria-hidden="true" size={20} /> 
          Recent Interventions
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Green Grid Log
        </span>
      </div>

      {/* Timeline List */}
      <div className="divide-y divide-gray-100 flex-grow">
        {INTERVENTIONS.map((i) => (
          <div key={i.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 mt-0.5">
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-green-700 block mb-0.5">{i.date}</span>
                <strong className="text-sm font-bold text-gray-900 block">{i.title}</strong>
                <small className="text-xs text-gray-500 block mt-0.5 leading-relaxed">{i.sub}</small>
              </div>
            </div>

            <div className="flex-shrink-0 self-start sm:self-center">
              <StatusPill status={i.status} />
            </div>
          </div>
        ))}

        {INTERVENTIONS.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No recent interventions recorded.
          </div>
        )}
      </div>
    </section>
  );
}