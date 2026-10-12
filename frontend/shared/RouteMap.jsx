import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";

const pin = (label, color) =>
  L.divIcon({
    className: "",
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);color:#fff;font:700 12px sans-serif">${label}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 36],
  });

const FARM_ICON = pin("F", "#16a34a");
const TARGET_ICON = pin("M", "#dc2626");

const hasPoint = (p) => p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));

const toRad = (d) => (d * Math.PI) / 180;
function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const fmtTime = (m) =>
  m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`;
const fmtDist = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [48, 48] });
  }, [map, points]);
  return null;
}

/**
 * farm / target: { lat, lng, name }
 * onRouteSummary: ({ distanceKm, durationMinutes, approximate }) => void
 */
export default function RouteMap({
  farm,
  target,
  height = 380,
  onRouteSummary,
  apiBase = "/api/route",
}) {
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | ok | fallback
  const [showSteps, setShowSteps] = useState(false);

  const summaryRef = useRef(onRouteSummary);
  useEffect(() => {
    summaryRef.current = onRouteSummary;
  });

  const ready = hasPoint(farm) && hasPoint(target);
  const fLat = Number(farm?.lat);
  const fLng = Number(farm?.lng);
  const tLat = Number(target?.lat);
  const tLng = Number(target?.lng);

  useEffect(() => {
    if (!ready) {
      setRoutes([]);
      setStatus("idle");
      return undefined;
    }
    const ctrl = new AbortController();
    setStatus("loading");
    setSelected(0);

    const q = new URLSearchParams({ fromLat: fLat, fromLng: fLng, toLat: tLat, toLng: tLng });
    fetch(`${apiBase}?${q}`, { signal: ctrl.signal })
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(body.error || r.statusText);
        return body;
      })
      .then((body) => {
        setRoutes(body.routes ?? []);
        setStatus(body.routes?.length ? "ok" : "fallback");
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setRoutes([]);
        setStatus("fallback");
      });

    return () => ctrl.abort();
  }, [ready, fLat, fLng, tLat, tLng, apiBase]);

  const fallback = useMemo(() => {
    if (!ready) return null;
    const km = haversineKm({ lat: fLat, lng: fLng }, { lat: tLat, lng: tLng });
    return {
      distanceKm: Number(km.toFixed(1)),
      durationMinutes: Math.round((km / 40) * 60),
      coordinates: [
        [fLat, fLng],
        [tLat, tLng],
      ],
      steps: [],
      approximate: true,
    };
  }, [ready, fLat, fLng, tLat, tLng]);

  const active = status === "ok" ? routes[selected] ?? routes[0] : fallback;

  useEffect(() => {
    if (!active || status === "loading") return;
    summaryRef.current?.({
      distanceKm: active.distanceKm,
      durationMinutes: active.durationMinutes,
      approximate: !!active.approximate,
    });
  }, [active, status]);

  if (!ready) {
    return (
      <div
        className="rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-500"
        style={{ height }}
      >
        Select a market or storage site to see the route.
      </div>
    );
  }

  const gmaps =
    `https://www.google.com/maps/dir/?api=1&origin=${fLat},${fLng}` +
    `&destination=${tLat},${tLng}&travelmode=driving`;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <div className="relative" style={{ height }}>
        <MapContainer
          center={[fLat, fLng]}
          zoom={10}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="Street">
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {status === "ok" &&
            routes.map((r, i) =>
              i === selected ? null : (
                <Polyline
                  key={`alt-${i}`}
                  positions={r.coordinates}
                  pathOptions={{ color: "#94a3b8", weight: 5, opacity: 0.85 }}
                  eventHandlers={{ click: () => setSelected(i) }}
                >
                  <Tooltip sticky>
                    Alternative: {fmtTime(r.durationMinutes)}, {r.distanceKm} km
                  </Tooltip>
                </Polyline>
              )
            )}

          {active && (
            <>
              <Polyline
                positions={active.coordinates}
                pathOptions={{ color: "#ffffff", weight: 10, opacity: 0.95 }}
              />
              <Polyline
                positions={active.coordinates}
                pathOptions={{
                  color: active.approximate ? "#dc2626" : "#2563eb",
                  weight: 6,
                  dashArray: active.approximate ? "8 10" : undefined,
                }}
              />
            </>
          )}

          <Marker position={[fLat, fLng]} icon={FARM_ICON}>
            <Tooltip direction="top" offset={[0, -36]} permanent>
              {farm.name || "Your farm"}
            </Tooltip>
          </Marker>
          <Marker position={[tLat, tLng]} icon={TARGET_ICON}>
            <Tooltip direction="top" offset={[0, -36]} permanent>
              {target.name || "Destination"}
            </Tooltip>
          </Marker>

          <FitBounds points={active ? active.coordinates : []} />
        </MapContainer>

        {active && (
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-md px-3 py-2 text-right">
            <div className="text-sm font-bold text-gray-900">
              {active.approximate ? "≈ " : ""}
              {active.distanceKm} km · {fmtTime(active.durationMinutes)}
            </div>
            <div className="text-[11px] text-gray-500">
              {status === "loading"
                ? "Finding road route…"
                : active.approximate
                ? "Straight-line estimate (road route unavailable)"
                : "Driving route"}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
        {status === "ok" &&
          routes.length > 1 &&
          routes.map((r, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                i === selected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i === 0 ? "Fastest" : `Option ${i + 1}`} · {fmtTime(r.durationMinutes)} · {r.distanceKm} km
            </button>
          ))}

        <div className="ml-auto flex items-center gap-3">
          {active?.steps?.length > 0 && (
            <button
              onClick={() => setShowSteps((s) => !s)}
              className="text-xs font-semibold text-green-700 hover:text-green-900"
            >
              {showSteps ? "Hide directions" : "Show directions"}
            </button>
          )}
          <a
            href={gmaps}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>

      {showSteps && active?.steps?.length > 0 && (
        <ol className="max-h-56 overflow-y-auto px-4 pb-4 space-y-1.5 text-sm text-gray-700 list-decimal list-inside">
          {active.steps.map((s, i) => (
            <li key={i}>
              {s.text}
              <span className="text-gray-400"> · {fmtDist(s.distanceM)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}