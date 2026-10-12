const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function timeAgo(iso) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

// Cards model (stats, risk watch). Returns {} without live data so the local fallback stays.
export function toRiskModel(api) {
  if (!api?.stats) return {};

  const { stats, topRisk: t, harvests = [] } = api;
  const crop = t ? harvests.find((h) => h.id === t.cropId) : null;
  const hoursToWindow = crop?.expectedHarvest
    ? Math.max(
        0,
        Math.round((new Date(`${crop.expectedHarvest}T00:00:00`) - Date.now()) / 36e5)
      )
    : null;

  return {
    count: Number(stats.farms ?? 0),
    tons: Number(stats.expectedKg ?? 0) / 1000,
    atRiskKg: Number(stats.atRiskKg ?? 0),
    exposedKg: Number(t?.exposedKg ?? 0),
    topFarm: t ? { id: t.farmId, name: t.farm, crop: t.crop } : null,
    hoursToWindow,
  };
}

// Rows for FarmsTable: one per crop, keyed by farm id so onOpen(f.id) opens the farm
export function toFarmRows(api) {
  if (!api?.harvests) return null;
  return api.harvests.map((h) => ({
    id: h.farmId,
    name: h.farm,
    crop: h.name,
    kg: h.expectedKg,
    risk: cap(h.risk),
    harvest: h.expectedHarvest
      ? new Date(`${h.expectedHarvest}T00:00:00`).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
        })
      : "TBD",
  }));
}

// Items for GridActivity
export function toActivity(api) {
  if (!api?.activity) return null;
  return api.activity.map((n) => ({
    key: n.id,
    icon: n.icon,
    title: n.title,
    sub: n.body,
    danger: n.kind === "alert",
    ago: timeAgo(n.createdAt),
  }));
}