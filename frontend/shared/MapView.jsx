import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, Tooltip, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const AREA = { north: -0.35, south: -0.75, west: 37.1, east: 37.6 }; // Kirinyaga, used for legacy {x, y} pins
const DANGER = "#dc2626";

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
  const safe = /^#[0-9a-f]{3,8}$/i.test(color) ? color : "#1e7a46";
  return L.divIcon({ 
    className: "bg-transparent", 
    html: `<span style="background:${safe}; width:20px; height:20px; display:inline-block; border-radius:50%; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></span>`, 
    iconSize: [20, 20], 
    iconAnchor: [10, 20] 
  });
};

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

function RoutingControl({ farmPosition, target, onRouteSummary }) {
  const map = useMap();

  useEffect(() => {
    if (!farmPosition || !target?.position || !L.Routing) return undefined;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(farmPosition[0], farmPosition[1]),
        L.latLng(target.position[0], target.position[1]),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      routeWhileDragging: false,
      addWaypoints: false,
      showAlternatives: false,
      collapsible: true,
      lineOptions: {
        styles: [{ color: "#1e7a46", opacity: 0.85, weight: 5 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null,
    }).addTo(map);

    const handleRoutesFound = (event) => {
      const summary = event.routes?.[0]?.summary;
      if (!summary || !onRouteSummary) return;
      onRouteSummary({
        targetId: target.id,
        distanceKm: Number((summary.totalDistance / 1000).toFixed(1)),
        durationMinutes: Math.round(summary.totalTime / 60),
      });
    };
    const handleRoutingError = (event) => {
      onRouteSummary?.({ targetId: target.id, error: event.error?.message || "Route unavailable" });
    };

    control.on("routesfound", handleRoutesFound);
    control.on("routingerror", handleRoutingError);

    return () => {
      control.off("routesfound", handleRoutesFound);
      control.off("routingerror", handleRoutingError);
      map.removeControl(control);
    };
  }, [map, farmPosition, onRouteSummary, target]);

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

export default function MapView({
  pins = [],
  height = 260,
  risk = false,
  farm,
  targets = [],
  selectedTargetId,
  onTargetSelect,
  onRouteSummary,
}) {
  const points = pins.map(toLatLng);
  const k = points.map((p) => p.join(",")).join("|");
  const farmPosition = asLatLng(farm);
  const normalizedTargets = useMemo(() => targets
    .map((target) => ({ ...target, position: asLatLng(target) }))
    .filter((target) => target.position), [targets]);
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

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-xs relative z-0" style={{ height }}>
      {normalizedTargets.length > 0 && (
        <div className="absolute left-3 top-3 z-[1000] max-w-[calc(100%-5rem)] rounded-lg bg-white/95 p-2 shadow-md">
          <label className="sr-only" htmlFor="map-route-target">Route to</label>
          <select
            id="map-route-target"
            value={activeTargetId || ""}
            onChange={(event) => selectTarget(event.target.value || null)}
            className="max-w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-green-600"
          >
            <option value="">Select market or storage</option>
            {normalizedTargets.map((target) => <option key={target.id} value={target.id}>{target.name}</option>)}
          </select>
        </div>
      )}
      <MapContainer center={farmPosition || [-0.5, 37.35]} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <LayerControl />
        <Fit k={fitKey || k} />
        {farmPosition && (
          <Marker position={farmPosition} icon={pinIcon("#1e7a46")}>
            <Popup>
              <strong>{farm.name || farm.locationName || "Your farm"}</strong>
              <br />
              Current Temp: {farm.temperature ?? "—"}°C
              <br />
              Forecast: {farm.forecast || "Weather forecast available"}
            </Popup>
          </Marker>
        )}
        {risk && pins.map((p, i) => p.color === DANGER && (
          <Circle key={`r${i}`} center={points[i]} radius={900} pathOptions={{ color: DANGER, fillColor: DANGER, fillOpacity: 0.25, weight: 1 }} />
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
            icon={pinIcon(target.type === "market" ? "#7f1d1d" : "#2563eb")}
            eventHandlers={{ click: () => selectTarget(target.id) }}
          >
            <Popup>
              <strong>{target.name}</strong>
              <br />
              <button type="button" onClick={() => selectTarget(target.id)} className="mt-2 text-xs font-semibold text-green-700">
                Route from farm
              </button>
            </Popup>
          </Marker>
        ))}
        {farmPosition && activeTarget && (
          <RoutingControl
            farmPosition={farmPosition}
            target={activeTarget}
            onRouteSummary={onRouteSummary}
          />
        )}
      </MapContainer>
    </div>
  );
}