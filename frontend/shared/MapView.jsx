import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, Tooltip, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLORS } from "./chartColors";

const AREA = { north: -0.35, south: -0.75, west: 37.1, east: 37.6 }; // Kirinyaga, used for legacy {x, y} pins
// Leaflet writes these into SVG attributes, which cannot resolve var(),
// so they are read from the active palette at render time instead.
const danger = () => COLORS.red;
const routeColor = () => COLORS.blue;
const altColor = () => COLORS.ink;

const toLatLng = (p) =>
  p.lat != null
    ? [Number(p.lat), Number(p.lng)]
    : [AREA.north - (p.y / 100) * (AREA.north - AREA.south), AREA.west + (p.x / 100) * (AREA.east - AREA.west)];

const asLatLng = (location) => {
  if (!location) return null;
  const lat = Number(location.lat ?? location.latitude);
  const lng = Number(location.lng ?? location.lon ?? location.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
};

const pinIcon = (color) => {
  const safe = color || "var(--color-map-pin)";
  return L.divIcon({
    className: "leaflet-pin-wrapper",
    html: `<span class="leaflet-pin" style="background:${safe}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
};

const toRad = (d) => (d * Math.PI) / 180;
function haversineKm([lat1, lng1], [lat2, lng2]) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const fmtTime = (m) =>
  m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`;

function LayerControl() {
  const map = useMap();

  useEffect(() => {
    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    });
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri", maxZoom: 19 },
    );
    const defaultLayer = import.meta.env.VITE_MAP_STYLE === "satellite" ? satellite : street;
    defaultLayer.addTo(map);
    const control = L.control.layers(
      { "Street View": street, "Satellite View": satellite },
      undefined,
      { position: "topright", collapsed: true },
    ).addTo(map);

    return () => {
      map.removeControl(control);
      map.removeLayer(street);
      map.removeLayer(satellite);
    };
  }, [map]);

  return null;
}

function Fit({ k }) {
  const map = useMap();
  useEffect(() => {
    const pts = k ? k.split("|").map((s) => s.split(",").map(Number)) : [];
    if (pts.length === 1) map.setView(pts[0], 13);
    else if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 13 });
  }, [map, k]);
  return null;
}

function FitRoute({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export default function MapView({
  pins = [],
  height = 260,
  risk = false,
  farm,
  targets = [],
  selectedTargetId,
  onTargetSelect,
  onRouteSummary,
  routeApi = "/api/route",
}) {
  const points = pins.map(toLatLng);
  const k = points.map((p) => p.join(",")).join("|");
  const farmPosition = asLatLng(farm);
  const normalizedTargets = useMemo(
    () => targets.map((target) => ({ ...target, position: asLatLng(target) })).filter((target) => target.position),
    [targets],
  );
  const fitKey = [
    ...points,
    ...(farmPosition ? [farmPosition] : []),
    ...normalizedTargets.map((target) => target.position),
  ].map((point) => point.join(",")).join("|");

  const [internalTargetId, setInternalTargetId] = useState(null);
  const activeTargetId = selectedTargetId ?? internalTargetId;
  const activeTarget = normalizedTargets.find((target) => target.id === activeTargetId);
  const selectTarget = (id) => {
    setInternalTargetId(id);
    onTargetSelect?.(id);
  };

  // ---- road route (via backend /api/route, cached and retried there) ----
  const fLat = farmPosition?.[0];
  const fLng = farmPosition?.[1];
  const tLat = activeTarget?.position[0];
  const tLng = activeTarget?.position[1];
  const routeKey = fLat != null && tLat != null ? `${fLat},${fLng},${tLat},${tLng}` : null;

  const [routeState, setRouteState] = useState({ key: null, status: "idle", routes: [] });
  const [selectedRoute, setSelectedRoute] = useState(0);
  // Ignore results that belong to a previous target
  const current =
    routeKey && routeState.key === routeKey
      ? routeState
      : { status: routeKey ? "loading" : "idle", routes: [] };

  useEffect(() => {
    if (!routeKey) return undefined;
    const ctrl = new AbortController();
    setSelectedRoute(0);
    const q = new URLSearchParams({ fromLat: fLat, fromLng: fLng, toLat: tLat, toLng: tLng });
    fetch(`${routeApi}?${q}`, { signal: ctrl.signal })
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(body.error || r.statusText);
        return body;
      })
      .then((body) =>
        setRouteState({
          key: routeKey,
          status: body.routes?.length ? "ok" : "fallback",
          routes: body.routes ?? [],
        }),
      )
      .catch((e) => {
        if (e.name === "AbortError") return;
        setRouteState({ key: routeKey, status: "fallback", routes: [] });
      });
    return () => ctrl.abort();
  }, [routeKey, fLat, fLng, tLat, tLng, routeApi]);

  const fallbackRoute = useMemo(() => {
    if (fLat == null || tLat == null) return null;
    const km = haversineKm([fLat, fLng], [tLat, tLng]);
    return {
      distanceKm: Number(km.toFixed(1)),
      durationMinutes: Math.round((km / 40) * 60),
      coordinates: [[fLat, fLng], [tLat, tLng]],
      approximate: true,
    };
  }, [fLat, fLng, tLat, tLng]);

  const active =
    current.status === "ok"
      ? current.routes[selectedRoute] ?? current.routes[0]
      : current.status === "fallback"
        ? fallbackRoute
        : null;

  // Keep the latest callback in a ref so an inline onRouteSummary never retriggers routing
  const summaryRef = useRef(onRouteSummary);
  useEffect(() => {
    summaryRef.current = onRouteSummary;
  });
  useEffect(() => {
    if (!active || !activeTargetId) return;
    summaryRef.current?.({
      targetId: activeTargetId,
      distanceKm: active.distanceKm,
      durationMinutes: active.durationMinutes,
      approximate: !!active.approximate,
    });
  }, [active, activeTargetId]);

  const gmaps =
    activeTarget && farmPosition
      ? `https://www.google.com/maps/dir/?api=1&origin=${fLat},${fLng}&destination=${tLat},${tLng}&travelmode=driving`
      : null;

  return (
    <div className="relative z-0 w-full overflow-hidden rounded-xl border border-border shadow-xs" style={{ height }}>
      {normalizedTargets.length > 0 && (
        <div className="absolute left-3 top-3 z-[1000] max-w-[calc(100%-5rem)] rounded-lg bg-card/95 p-2 shadow-pop">
          <label className="sr-only" htmlFor="map-route-target">Route to</label>
          <select
            id="map-route-target"
            value={activeTargetId || ""}
            onChange={(event) => selectTarget(event.target.value || null)}
            className="max-w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-brand-600"
          >
            <option value="">Select market or storage</option>
            {normalizedTargets.map((target) => <option key={target.id} value={target.id}>{target.name}</option>)}
          </select>
        </div>
      )}

      {activeTarget && (
        <div className="absolute left-3 bottom-3 z-[1000] max-w-[calc(100%-1.5rem)] space-y-1.5 rounded-lg bg-card/95 px-3 py-2 shadow-pop">
          <div className="text-sm font-bold text-foreground">
            {current.status === "loading"
              ? "Finding road route…"
              : active
                ? `${active.approximate ? "≈ " : ""}${active.distanceKm} km · ${fmtTime(active.durationMinutes)}`
                : ""}
          </div>
          {active?.approximate && (
            <div className="text-[11px] text-amber-700">Straight-line estimate, road route unavailable</div>
          )}
          {current.status === "ok" && current.routes.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {current.routes.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedRoute(i)}
                  className={`rounded-full border px-2 py-1 text-[11px] font-semibold transition-colors ${
                    i === selectedRoute
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i === 0 ? "Fastest" : `Option ${i + 1}`} · {fmtTime(r.durationMinutes)}
                </button>
              ))}
            </div>
          )}
          {gmaps && (
            <a href={gmaps} target="_blank" rel="noreferrer" className="block text-[11px] font-semibold text-blue-700 hover:text-blue-900">
              Open in Google Maps ↗
            </a>
          )}
        </div>
      )}

      <MapContainer center={farmPosition || [-0.5, 37.35]} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <LayerControl />
        <Fit k={fitKey || k} />
        {active && <FitRoute points={active.coordinates} />}

        {current.status === "ok" &&
          current.routes.map((r, i) =>
            i === selectedRoute ? null : (
              <Polyline
                key={`alt-${i}`}
                positions={r.coordinates}
                pathOptions={{ color: altColor(), weight: 5, opacity: 0.85 }}
                eventHandlers={{ click: () => setSelectedRoute(i) }}
              >
                <Tooltip sticky>Alternative: {fmtTime(r.durationMinutes)}, {r.distanceKm} km</Tooltip>
              </Polyline>
            ),
          )}
        {active && (
          <>
            <Polyline positions={active.coordinates} pathOptions={{ color: "#ffffff", weight: 10, opacity: 0.95 }} />
            <Polyline
              positions={active.coordinates}
              pathOptions={{
                color: active.approximate ? danger() : routeColor(),
                weight: 6,
                dashArray: active.approximate ? "8 10" : undefined,
              }}
            />
          </>
        )}

        {farmPosition && (
          <Marker position={farmPosition} icon={pinIcon("var(--color-map-pin)")}>
            <Popup>
              <strong>{farm.name || farm.locationName || "Your farm"}</strong>
              <br />
              Current Temp: {farm.temperature ?? "—"}°C
              <br />
              Forecast: {farm.forecast || "Weather forecast available"}
            </Popup>
          </Marker>
        )}
        {risk && pins.map((p, i) => p.color === danger() && (
          <Circle key={`r${i}`} center={points[i]} radius={900} pathOptions={{ color: danger(), fillColor: danger(), fillOpacity: 0.25, weight: 1 }} />
        ))}
        {pins.map((p, i) => (
          <Marker key={i} position={points[i]} icon={pinIcon(p.color)}>
            {p.label && <Tooltip direction="top" offset={[0, -18]} className="rounded-md font-semibold text-xs shadow-sm">{p.label}</Tooltip>}
          </Marker>
        ))}
        {normalizedTargets.map((target) => (
          <Marker
            key={target.id}
            position={target.position}
            icon={pinIcon(target.type === "market" ? "var(--color-map-market)" : "var(--color-map-storage)")}
            eventHandlers={{ click: () => selectTarget(target.id) }}
          >
            {target.id === activeTargetId && (
              <Tooltip permanent direction="top" offset={[0, -20]} className="rounded-md font-semibold text-xs shadow-sm">
                {target.name}
              </Tooltip>
            )}
            <Popup>
              <strong>{target.name}</strong>
              <br />
              <button type="button" onClick={() => selectTarget(target.id)} className="mt-2 text-xs font-semibold text-brand-700">
                Route from farm
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}