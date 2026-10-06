import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Globe,
  PartyPopper,
  Sprout,
  Store,
  Warehouse,
  X,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { fetchSurplusAlerts, RECS } from "../../shared/data";
import { Tabs } from "../components/ui";

const RECOMMENDATION_ICONS = {
  Harvest: Sprout,
  Market: Store,
  Storage: Warehouse,
};

export default function Recommendations() {
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);
  const [sel, setSel] = useState(1);
  const [backendRecs, setBackendRecs] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSurplusAlerts().then((response) => {
      if (!active || response?.status !== "success") return;
      setBackendRecs(Array.isArray(response.data) ? response.data : []);
    });
    return () => {
      active = false;
    };
  }, []);

  const recommendations = backendRecs === null
    ? RECS
    : backendRecs.map((rec) => ({
        id: `backend-week-${rec.week}`,
        kind: "Harvest",
        tone: Number(rec.risk) >= 0.6 ? "danger" : "info",
        title: `Week ${rec.week} · ${Number(rec.surplus_t).toFixed(0)} t surplus`,
        text: rec.ai_explanation || rec.ai_reasoning || "Surplus alert from the MAVUNO backend.",
        cta: "Review alert",
        risk: Number(rec.risk),
        why: [
          ["ok", `Backend risk score: ${Number(rec.risk).toFixed(2)} / 1`],
          ["ok", `${Number(rec.surplus_t).toFixed(1)} t projected surplus`],
        ],
        impact: [
          `Saved: ${Number(rec.tonnes_saved ?? 0).toFixed(1)} t`,
          `Unplaced: ${Number(rec.tonnes_wasted ?? 0).toFixed(1)} t`,
          `Revenue: KES ${Number(rec.revenue_kes ?? 0).toLocaleString("en-KE")}`,
          `CO2e avoided: ${Number(rec.co2e_avoided_t ?? 0).toFixed(1)} t`,
        ],
      }));

  const list = recommendations.filter(
    (r) => !dismissed.includes(r.id) && (filter === "All" || r.kind === filter),
  );
  const active = list.find((r) => r.id === sel) || list[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Category Tabs */}
      <Tabs
        tabs={["All", "Harvest", "Market", "Storage", "Transport"]}
        active={filter}
        onChange={setFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Recommendations */}
        <div className="lg:col-span-7 space-y-3">
          {list.map((r) => {
            const Icon = RECOMMENDATION_ICONS[r.kind] || Sprout;
            const isSelected = active?.id === r.id;
            const isDanger = r.tone === "danger";

            return (
              <div
                key={r.id}
                onClick={() => setSel(r.id)}
                className={`relative bg-white rounded-xl border p-4 sm:p-5 transition-all cursor-pointer flex items-start gap-4 shadow-sm hover:shadow-md ${
                  isSelected 
                    ? "border-green-600 ring-1 ring-green-600 bg-green-50/20" 
                    : isDanger 
                      ? "border-red-200 bg-red-50/10" 
                      : "border-gray-200"
                }`}
              >
                {/* Icon Badge */}
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  isDanger ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                }`}>
                  <Icon aria-hidden="true" size={20} />
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-gray-900 truncate">{r.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{r.text}</p>

                  {/* Chips & Action */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button className="px-3.5 py-1.5 text-xs font-semibold bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                      {r.cta}
                    </button>
                    {r.conf != null && (
                      <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                        {r.conf}% confidence
                      </span>
                    )}
                    {r.risk != null && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.risk >= 0.6 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                      }`}>
                        Risk {r.risk.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Dismiss"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissed((current) => [...current, r.id]);
                    toast("Recommendation dismissed", {
                      action: {
                        label: "Undo",
                        onClick: () =>
                          setDismissed((current) =>
                            current.filter((id) => id !== r.id),
                          ),
                      },
                    });
                  }}
                >
                  <X aria-hidden="true" size={16} />
                </button>
              </div>
            );
          })}

          {!list.length && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm flex flex-col items-center justify-center space-y-2">
              <PartyPopper className="text-green-600" aria-hidden="true" size={28} />
              <span className="font-semibold text-gray-800 text-lg">You're all caught up</span>
              <p className="text-xs text-gray-400">No active recommendations matching this filter.</p>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Breakdown (Why & Impact) */}
        {active && (
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
            
            {/* Why Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-3">Why this recommendation?</h3>
              
              <div className="space-y-2.5">
                {active.why.map(([t, s], i) => (
                  <div key={i} className={`flex items-start gap-2.5 text-sm p-3 rounded-lg ${
                    t === "ok" ? "bg-green-50/50 text-green-900 border border-green-100" : "bg-red-50/50 text-red-900 border border-red-100"
                  }`}>
                    {t === "ok" ? (
                      <CircleCheck className="text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" size={16} />
                    ) : (
                      <CircleX className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" size={16} />
                    )}
                    <span className="font-medium">{s}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-bold text-gray-900 pt-2">Estimated Impact</h4>
              <div className="space-y-2">
                {active.impact.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-gray-700">
                    <BadgeCheck className="text-green-600 flex-shrink-0" aria-hidden="true" size={16} />
                    <span className="font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 text-green-700 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-semibold">Model Metric</span>
                  <strong className="text-sm font-bold text-gray-900">
                    {active.risk != null ? `Risk score ${active.risk.toFixed(2)} / 1` : `Confidence ${active.conf}%`}
                  </strong>
                </div>
              </div>
              <Globe className="text-gray-400" aria-hidden="true" size={20} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}