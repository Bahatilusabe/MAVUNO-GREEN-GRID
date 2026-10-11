import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Target, MapPin, Route as RouteIcon } from "lucide-react";
import { toast } from "sonner";
import { fetchOpportunities, OPPS, OPP_COLOR } from "../../shared/data";
import MapView from "../../shared/MapView";

const TYPE_LABELS = {
  buyer: "Buyers",
  processor: "Processors",
  cold_store: "Storage",
  recovery: "Recovery",
};

const colorForType = (type) => OPP_COLOR[
  { Buyers: "Buyer", Processors: "Processor" }[type] || type
] || OPP_COLOR.Buyer;

const DEFAULT_FARM = { lat: -0.5186, lng: 37.3675, name: "Kiambaina Farm" };

// APPROXIMATE coordinates for the known sample sites.
// Replace with real coordinates (partners.lat / partners.lng) so routes end at the real gate.
const KNOWN_SITES = {
  "Nairobi Fresh Markets": { lat: -1.2817, lng: 36.8313 },
  "Kagio Juice Processors": { lat: -0.668, lng: 37.317 },
  "Kirinyaga Cold Storage": { lat: -0.4994, lng: 37.2808 },
};

function farmLocation(farm) {
  if (!farm) return DEFAULT_FARM;
  if (farm.lat != null && farm.lng != null) {
    const lat = Number(farm.lat);
    const lng = Number(farm.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng, name: farm.name };
  }
  if (typeof farm.coords === "string") {
    const [lat, lng] = farm.coords.split(",").map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng, name: farm.name };
  }
  return DEFAULT_FARM;
}

const fmtTime = (m) =>
  m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`;

const hasCoords = (o) => Number.isFinite(o.lat) && Number.isFinite(o.lng);

export default function Opportunities({ farm }) {
  const [filter, setFilter] = useState("All");
  const [matched, setMatched] = useState({});
  const [backendOpportunities, setBackendOpportunities] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const handleRoute = useCallback((summary) => setRouteInfo(summary), []);
  const origin = farmLocation(farm);

  useEffect(() => {
    let active = true;
    fetchOpportunities().then((data) => {
      if (active) setBackendOpportunities(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const opportunities = useMemo(() => {
    if (backendOpportunities === null) return OPPS;
    return backendOpportunities.map((item, index) => {
      const site = KNOWN_SITES[item.name] || {};
      return {
        // Use item.name || item.id || `item-${index}` to guarantee uniqueness
        id: `backend-${item.name || item.id || index}`,
        name: item.name || `Opportunity ${index + 1}`,
        type: TYPE_LABELS[item.type] || item.type || "Buyer",
        km: Number(item.distance_km || 10),
        cap: `${Number(item.capacity_t || 100).toLocaleString("en-KE")} t/week`,
        price: `KES ${Number(item.price_kes_kg || 50).toLocaleString("en-KE")}/kg`,
        note: `${item.lead_days || 1} day lead time`,
        lat: Number(item.lat ?? site.lat),
        lng: Number(item.lng ?? site.lng),
        x: 12 + (index % 4) * 24,
        y: 18 + Math.floor(index / 4) * 28,
      };
    });
  }, [backendOpportunities]);

  const list = useMemo(
    () => opportunities.filter((o) => filter === "All" || o.type === filter),
    [opportunities, filter],
  );

  // Sites with real coordinates get routes; the rest stay as legacy x/y pins
  const targets = useMemo(
    () => list.filter(hasCoords).map((o) => ({
      id: o.id,
      name: o.name,
      type: o.type === "Storage" ? "storage" : "market",
      lat: o.lat,
      lng: o.lng,
    })),
    [list],
  );
  const pins = useMemo(
    () => list.filter((o) => !hasCoords(o)).map((o) => ({
      x: o.x,
      y: o.y,
      color: colorForType(o.type),
      label: o.name,
    })),
    [list],
  );

  const selected = list.find((o) => o.id === selectedId);
  const tabs = ["All", "Buyers", "Processors", "Storage", "Recovery", "Transport"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Tabs */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="text-green-600" size={22} /> Nearby Opportunities for Tomatoes
        </h3>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Opportunities List */}
        <div className="lg:col-span-7 space-y-4">
          {list.map((o) => {
            const isMatched = matched[o.id];
            const isSelected = selectedId === o.id;
            const badgeColor = colorForType(o.type);
            const info = routeInfo?.targetId === o.id ? routeInfo : null;

            return (
              <div
                key={o.id}
                className={`bg-white rounded-xl border shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all ${
                  isSelected ? "border-blue-400 ring-1 ring-blue-300" : "border-gray-200 hover:border-green-300"
                }`}
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
                    {info && (
                      <small className="text-xs text-blue-700 font-semibold block">
                        By road: {info.approximate ? "≈ " : ""}{info.distanceKm} km · {fmtTime(info.durationMinutes)}
                      </small>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                  <button
                    disabled={!hasCoords(o)}
                    title={hasCoords(o) ? "Show the road route from your farm" : "No location available"}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                      !hasCoords(o)
                        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                        : isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                    }`}
                    onClick={() => setSelectedId(isSelected ? null : o.id)}
                  >
                    <RouteIcon aria-hidden="true" size={14} /> Route
                  </button>

                  <button
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
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
              </div>
            );
          })}

          {!list.length && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm text-sm">
              Nothing in this category yet.
            </div>
          )}
        </div>

        {/* Right Column: Map & Legend */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={16} className="text-green-600" /> Geographic Opportunities
            </h4>

            <MapView
              height={360}
              farm={origin}
              targets={targets}
              pins={pins}
              selectedTargetId={selectedId}
              onTargetSelect={setSelectedId}
              onRouteSummary={handleRoute}
            />

            <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-xs text-gray-700">
              {selected
                ? routeInfo?.targetId === selected.id
                  ? `${selected.name}: ${routeInfo.approximate ? "≈ " : ""}${routeInfo.distanceKm} km by road · ${fmtTime(routeInfo.durationMinutes)}`
                  : `Finding route to ${selected.name}…`
                : "Select a buyer or storage site to draw the road route from your farm."}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              {Object.entries(OPP_COLOR).map(([key, c]) => (
                <div key={key} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <span className="w-3 h-3 rounded-full shadow-xs flex-shrink-0" style={{ background: c }} />
                  <span className="truncate">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}