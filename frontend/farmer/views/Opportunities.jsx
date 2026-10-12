import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Target, MapPin, Route as RouteIcon, X } from "lucide-react";
import { toast } from "sonner";
import { OPPS, OPP_COLOR } from "../../shared/data";
import MapView from "../../shared/MapView";
import { api, getToken } from "../../src/lib/api";

const TYPE_LABELS = {
  buyer: "Buyers",
  processor: "Processors",
  cold_store: "Storage",
  transport: "Transport",
  recovery: "Recovery",
};

const colorForType = (type) => OPP_COLOR[
  { Buyers: "Buyer", Processors: "Processor" }[type] || type
] || OPP_COLOR.Buyer;

const DEFAULT_FARM = { lat: -0.5186, lng: 37.3675, name: "Kiambaina Farm" };

// APPROXIMATE coordinates, used only for the signed-out sample list.
const KNOWN_SITES = {
  "Nairobi Fresh Markets": { lat: -1.2817, lng: 36.8313 },
  "Kagio Juice Processors": { lat: -0.668, lng: 37.317 },
  "Kirinyaga Cold Storage": { lat: -0.4994, lng: 37.2808 },
};

const ACTIVE = new Set(["pending", "scheduled", "in_transit"]);
const UNAVAILABLE_CROP = new Set(["SOLD", "LOST"]);

const newKey = () =>
  globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const matchTargetId = (m) => (m.partnerId ? `partner:${m.partnerId}` : `place:${m.placeId}`);

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

// API opportunity -> the card shape used below
function toOpp(o) {
  return {
    id: `${o.kind}:${o.id}`,
    kind: o.kind,
    refId: o.id,
    name: o.name,
    type: TYPE_LABELS[o.type] || "Buyers",
    km: o.distanceKm,
    capacityKg: o.capacityKg,
    cap: o.capacityKg != null
      ? `${Number((o.capacityKg / 1000).toFixed(1)).toLocaleString("en-KE")} t capacity`
      : "Capacity not listed",
    price: o.pricePerKg != null
      ? `KES ${Number(o.pricePerKg).toLocaleString("en-KE")}/kg`
      : "Price on request",
    note: o.kind === "partner" ? "Registered MAVUNO partner" : "Public site, not yet on MAVUNO",
    lat: Number(o.lat),
    lng: Number(o.lng),
  };
}

export default function Opportunities({ farm }) {
  const [filter, setFilter] = useState("All");
  const [live, setLive] = useState(null); // null means the sample list is showing
  const [loadState, setLoadState] = useState("loading"); // loading | ok | sample | no-location
  const [matches, setMatches] = useState({}); // opportunity id -> active match
  const [selectedId, setSelectedId] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [draftFor, setDraftFor] = useState(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [transporting, setTransporting] = useState({}); // match_id -> boolean
  const handleRoute = useCallback((summary) => setRouteInfo(summary), []);

  const origin = farmLocation(farm);
  const farmId = typeof farm?.id === "string" ? farm.id : undefined;
  const signedIn = Boolean(getToken());
  const sample = !live;

  const crops = useMemo(
    () => (farm?.crops ?? []).filter((c) => !UNAVAILABLE_CROP.has(c.status)),
    [farm],
  );

  useEffect(() => {
    if (!getToken()) {
      setLive(null);
      setLoadState("sample");
      return undefined;
    }
    const ctrl = new AbortController();
    setLoadState("loading");
    const qs = farmId ? `?farmId=${encodeURIComponent(farmId)}` : "";

    api.get(`/opportunities${qs}`, { signal: ctrl.signal })
      .then((body) => {
        setLive(body.opportunities.map(toOpp));
        setLoadState("ok");
        if (body.complete === false) {
          toast.info("Some nearby sites are still loading. Reopen this page in a minute for the full list.");
        }
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setLive(null);
        setLoadState(e.status === 422 ? "no-location" : "sample");
      });

    api.get("/matches", { signal: ctrl.signal })
      .then(({ matches: list }) => {
        const map = {};
        for (const m of list) {
          const id = matchTargetId(m);
          if (ACTIVE.has(m.status) && !map[id]) map[id] = m; // list is newest first
        }
        setMatches(map);
      })
      .catch(() => {});

    return () => ctrl.abort();
  }, [farmId]);

  const opportunities = useMemo(
    () => live ?? OPPS.map((o) => ({ ...o, ...(KNOWN_SITES[o.name] ?? {}) })),
    [live],
  );

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

  const startKg = (crop, o) => {
    const start = Math.min(Number(crop.expected_yield) || 0, o.capacityKg ?? Infinity);
    return start > 0 ? String(Math.round(start)) : "";
  };

  const openMatch = (o) => {
    if (sample || !signedIn) {
      toast.info("Sample data. Sign in to send real match requests.");
      return;
    }
    if (!crops.length) {
      toast.info("Add a crop to this farm before matching.");
      return;
    }
    const crop = crops[0];
    setDraftFor(o.id);
    setDraft({ cropId: crop.id, kg: startKg(crop, o), price: "", key: newKey() });
  };

  // Any edit changes the request, so it gets a new idempotency key
  const setField = (field, value) => setDraft((d) => ({ ...d, [field]: value, key: newKey() }));
  const pickCrop = (o, cropId) => {
    const crop = crops.find((c) => c.id === cropId);
    setDraft((d) => ({ ...d, cropId, kg: crop ? startKg(crop, o) : d.kg, key: newKey() }));
  };

  const submit = async (o) => {
    const kg = Math.round(Number(draft.kg));
    if (!Number.isFinite(kg) || kg <= 0) {
      toast.error("Enter the kilograms to commit.");
      return;
    }
    const price = Number(draft.price);
    if (o.kind === "place" && !(price > 0)) {
      toast.error("Enter the price per kg you agreed with this site.");
      return;
    }

    setBusy(true);
    try {
      const { match } = await api.post("/matches", {
        crop_id: draft.cropId,
        kg,
        idempotency_key: draft.key,
        ...(o.kind === "partner"
          ? { partner_id: o.refId }
          : { place_id: o.refId, price_per_kg: price }),
      });
      setMatches((m) => ({ ...m, [o.id]: match }));
      setDraftFor(null);
      setDraft(null);
      toast.success(`Match request sent to ${o.name}`, {
        description: `${match.kg} kg of ${match.crop}. Waiting for confirmation.`,
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const cancel = async (o) => {
    const m = matches[o.id];
    if (!m) return;
    try {
      await api.post(`/matches/${m.id}/cancel`);
      setMatches((cur) => {
        const next = { ...cur };
        delete next[o.id];
        return next;
      });
      toast.info(`Match with ${o.name} cancelled`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const requestTransport = async (match, siteName) => {
    setTransporting((prev) => ({ ...prev, [match.id]: true }));
    try {
      await api.post('/transport/from-match', {
        match_id: match.id,
      });
      toast.success(`Transport requested for ${siteName}!`, {
        description: `A driver will be assigned to pick up your ${match.crop}.`
      });
    } catch (e) {
      toast.error(e.message || "Failed to request transport");
    } finally {
      setTransporting((prev) => ({ ...prev, [match.id]: false }));
    }
  };

  const notice = {
    loading: "Loading live opportunities…",
    sample: "Sample data shown. Sign in and save a farm location for live results.",
    "no-location": "This farm has no saved location yet. Add one to see nearby opportunities.",
    ok: null,
  }[loadState];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Tabs */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="text-green-600" size={22} /> Nearby Opportunities
        </h3>

        {notice && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="status">
            {notice}
          </p>
        )}

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
            const match = matches[o.id];
            const isSelected = selectedId === o.id;
            const badgeColor = colorForType(o.type);
            const info = routeInfo?.targetId === o.id ? routeInfo : null;
            const panelOpen = draftFor === o.id && draft;

            return (
              <div key={o.id} className="space-y-2">
                <div
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
                        {o.type} about {o.km} km away • {o.cap}
                      </small>
                      <small className="text-xs text-green-800 font-semibold block">
                        {o.price}
                        {o.note}
                      </small>
                      {info && (
                        <small className="text-xs text-blue-700 font-semibold block">
                          By road: {info.approximate ? "≈ " : ""}{info.distanceKm} km · {fmtTime(info.durationMinutes)}
                        </small>
                      )}
                      {match && (
                        <small className="text-xs text-gray-700 block">
                          {match.kg} kg of {match.crop} · {match.status.replace("_", " ")}
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

                    {match ? (
                      <>
                        <span className="px-3 py-2 text-xs font-semibold rounded-lg bg-green-100 text-green-800 border border-green-300 flex items-center gap-1.5">
                          {match.status === "pending" ? "Pending" : match.status.replace("_", " ")}
                          <Check aria-hidden="true" size={14} />
                        </span>
                        {match.status === "pending" && (
                          <button
                            className="px-2.5 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => cancel(o)}
                            aria-label={`Cancel match with ${o.name}`}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 flex items-center gap-1"
                          onClick={() => requestTransport(match, o.name)}
                          disabled={transporting[match.id]}
                        >
                          {transporting[match.id] ? "Requesting..." : "Request Transport"}
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors bg-green-700 hover:bg-green-800 text-white shadow-xs"
                        onClick={() => (panelOpen ? setDraftFor(null) : openMatch(o))}
                      >
                        {panelOpen ? "Close" : "Match"}
                      </button>
                    )}
                  </div>
                </div>

                {panelOpen && (
                  <div className="bg-green-50/60 border border-green-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-green-900">Send a match request to {o.name}</strong>
                      <button
                        type="button"
                        onClick={() => setDraftFor(null)}
                        aria-label="Close"
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="text-xs font-medium text-gray-700">
                        Crop
                        <select
                          className="mt-1 w-full p-2 border rounded-md text-sm"
                          value={draft.cropId}
                          onChange={(e) => pickCrop(o, e.target.value)}
                        >
                          {crops.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.crop_type} · {Number(c.expected_yield || 0).toLocaleString("en-KE")} kg
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="text-xs font-medium text-gray-700">
                        Kilograms
                        <input
                          className="mt-1 w-full p-2 border rounded-md text-sm"
                          type="number"
                          min="1"
                          step="1"
                          value={draft.kg}
                          onChange={(e) => setField("kg", e.target.value)}
                        />
                      </label>

                      {o.kind === "place" ? (
                        <label className="text-xs font-medium text-gray-700">
                          Agreed price (KES/kg)
                          <input
                            className="mt-1 w-full p-2 border rounded-md text-sm"
                            type="number"
                            min="1"
                            step="0.5"
                            value={draft.price}
                            onChange={(e) => setField("price", e.target.value)}
                          />
                        </label>
                      ) : (
                        <div className="text-xs text-gray-600 self-end pb-2">
                          Partner rate applies: {o.price}
                        </div>
                      )}
                    </div>

                    {o.kind === "place" && (
                      <p className="text-[11px] text-gray-600">
                        This is a public site, not a MAVUNO partner. The request is saved as pending and nothing is
                        confirmed until you agree it with them.
                      </p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => setDraftFor(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-800 text-white disabled:opacity-50"
                        onClick={() => submit(o)}
                      >
                        {busy ? "Sending…" : "Send request"}
                      </button>
                    </div>
                  </div>
                )}
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