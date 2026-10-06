import { useEffect, useState } from "react";
import { Check, Target, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { fetchOpportunities, OPPS, OPP_COLOR } from "../../shared/data";
import { FakeMap } from "../components/ui";

const TYPE_LABELS = {
  buyer: "Buyers",
  processor: "Processors",
  cold_store: "Storage",
  recovery: "Recovery",
};

const colorForType = (type) => OPP_COLOR[
  { Buyers: "Buyer", Processors: "Processor" }[type] || type
] || "#278451";

export default function Opportunities() {
  const [filter, setFilter] = useState("All");
  const [matched, setMatched] = useState({});
  const [backendOpportunities, setBackendOpportunities] = useState(null);

  useEffect(() => {
    let active = true;
    fetchOpportunities().then((data) => {
      if (active) setBackendOpportunities(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const opportunities = backendOpportunities === null
    ? OPPS
    : backendOpportunities.map((item, index) => ({
        id: `backend-${item.name}`,
        name: item.name,
        type: TYPE_LABELS[item.type] || item.type,
        km: Number(item.distance_km),
        cap: `${Number(item.capacity_t).toLocaleString("en-KE")} t/week`,
        price: `KES ${Number(item.price_kes_kg).toLocaleString("en-KE")}/kg`,
        note: `${item.lead_days} day lead time`,
        x: 12 + (index % 4) * 24,
        y: 18 + Math.floor(index / 4) * 28,
      }));

  const list = opportunities.filter(
    (opportunity) => filter === "All" || opportunity.type === filter,
  );

  const pins = list.map((o) => ({
    x: o.x,
    y: o.y,
    color: colorForType(o.type),
    label: o.name,
  }));

  const tabs = ["All", "Buyers", "Processors", "Storage", "Recovery", "Transport"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Tabs */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="text-green-600" size={22} /> Nearby Opportunities for Tomatoes
        </h3>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === t
                  ? "bg-green-700 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Opportunities List (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          {list.map((o) => {
            const isMatched = matched[o.id];
            const badgeColor = colorForType(o.type);

            return (
              <div 
                key={o.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span 
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1.5 shadow-xs" 
                    style={{ background: badgeColor }} 
                  />
                  <div className="min-w-0 space-y-1">
                    <strong className="block text-base font-bold text-gray-900 truncate">{o.name}</strong>
                    <small className="text-xs text-gray-600 block truncate font-medium">
                      {o.type} • {o.km} km away • {o.cap}
                    </small>
                    <small className="text-xs text-green-800 font-semibold block">
                      {o.price} • {o.note}
                    </small>
                  </div>
                </div>

                <button
                  className={`self-start sm:self-center px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 ${
                    isMatched
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-green-700 hover:bg-green-800 text-white shadow-xs"
                  }`}
                  onClick={() => {
                    const was = matched[o.id];
                    setMatched((current) => ({ ...current, [o.id]: !was }));
                    toast[was ? "info" : "success"](
                      was
                        ? `Match with ${o.name} removed`
                        : `Match request sent to ${o.name}`,
                    );
                  }}
                >
                  {isMatched ? (
                    <>
                      Matched <Check aria-hidden="true" size={14} />
                    </>
                  ) : (
                    "Match"
                  )}
                </button>
              </div>
            );
          })}

          {!list.length && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm text-sm">
              Nothing in this category yet.
            </div>
          )}
        </div>

        {/* Right Column: Map & Legend (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={16} className="text-green-600" /> Geographic Opportunities
            </h4>

            <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100" style={{ height: "320px" }}>
              <FakeMap pins={pins} height="100%" />
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              {Object.entries(OPP_COLOR).map(([k, c]) => (
                <div key={k} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <span className="w-3 h-3 rounded-full shadow-xs flex-shrink-0" style={{ background: c }} />
                  <span className="truncate">{k}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
              View Route <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}