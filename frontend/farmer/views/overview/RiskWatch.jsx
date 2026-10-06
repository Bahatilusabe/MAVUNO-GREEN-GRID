import { Brain, CircleCheck, Hourglass, Scale } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { CropIcon, FakeMap } from "../../components/ui";
import { FACTORS, CONFIDENCE, HOURS_TO_WINDOW } from "./data";

function Ring({ pct }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" width="52" height="52" role="img" aria-label={`${pct}% confidence`}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="#e6f4ec" strokeWidth="4" />
      <circle cx="22" cy="22" r={r} fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 22 22)" />
      <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14532d">{pct}%</text>
    </svg>
  );
}

export default function RiskWatch({ m, go }) {
  const top = m.topFarm;
  return (
    <section className={`bg-white rounded-xl border shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-6 ${
      top ? "border-red-200" : "border-gray-200"
    }`}>
      
      {/* 1. Map Column */}
      <div className="lg:col-span-4 relative min-h-[220px] bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200">
        <FakeMap risk={!!top} height="100%" pins={top ? [{ x: 45, y: 50, color: "#dc2626", label: top.name }] : []} />
        {top && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            High Risk Area
          </span>
        )}
      </div>

      {/* 2. Main Body Column */}
      <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-green-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Brain size={16} className="text-green-600" />
            <span>MAVUNO AI</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 font-medium">Harvest Risk Watch</span>
          </div>

          {top ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5 leading-snug">
                <CropIcon crop={top.crop} size={24} />
                <span>{top.crop} entering a <span className="text-red-600 underline decoration-red-300">HIGH</span> surplus-risk window</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-700 rounded-md"><Scale size={18} /></div>
                  <div>
                    <strong className="block text-gray-900 text-base">{fmt(m.exposedKg)} kg</strong>
                    <small className="text-gray-500 text-xs">potentially exposed</small>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-md"><Hourglass size={18} /></div>
                  <div>
                    <strong className="block text-gray-900 text-base">{HOURS_TO_WINDOW} hrs</strong>
                    <small className="text-gray-500 text-xs">to harvest window</small>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 text-green-700">
              <CircleCheck size={22} className="text-green-600" />
              <span>No farms are currently in a surplus-risk window</span>
            </h2>
          )}
        </div>

        {top && (
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              className="px-4 py-2.5 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors shadow-sm" 
              onClick={() => go("opportunities")}
            >
              View Green Grid Plan →
            </button>
            <button 
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
              onClick={() => go("recs")}
            >
              Review Factors
            </button>
          </div>
        )}
      </div>

      {/* 3. Factors / Analytics Sidebar Column */}
      <aside className="lg:col-span-3 bg-gray-50 p-5 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col justify-between">
        <div>
          {/* Confidence Score Widget */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs mb-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Confidence</span>
              <div className="w-24 bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-600 h-full rounded-full" style={{ width: `${CONFIDENCE}%` }} />
              </div>
            </div>
            <Ring pct={CONFIDENCE} />
          </div>

          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Factors</h4>
          <div className="space-y-2.5">
            {FACTORS.map(([Icon, label, value, mark]) => (
              <div key={label} className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-600"><Icon size={16} /></span>
                  <span className="font-medium">{label}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900 text-xs block">{value}</span>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{mark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

    </section>
  );
}