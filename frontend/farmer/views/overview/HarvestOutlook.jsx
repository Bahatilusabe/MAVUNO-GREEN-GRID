import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { HarvestChart } from "../../../shared/charts";
import Card from "../../../shared/kit/Card";
import Badge from "../../../shared/kit/Badge";
import AreaTrend from "../../../shared/viz/AreaTrend";
import BarCompare from "../../../shared/viz/BarCompare";
import { OUTLOOK } from "./data";

const pad = (n) => String(n).padStart(2, "0");

// Group expected kilograms by the Monday of each harvest week (local dates, no UTC shift)
function byWeek(harvests) {
  const buckets = new Map();
  for (const h of harvests) {
    if (!h.expectedHarvest) continue;
    const d = new Date(`${h.expectedHarvest}T00:00:00`);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const label = d.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
    const bucket = buckets.get(key) ?? { key, label, kg: 0 };
    bucket.kg += Number(h.expectedKg) || 0;
    buckets.set(key, bucket);
  }
  return [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

const kg = (v) => `${Number(v).toLocaleString("en-KE")} kg`;
const axis = (v) => (v >= 1000 ? `${+(v / 1000).toFixed(1)}t` : v);

export default function HarvestOutlook({ harvests }) {
  const weeks = useMemo(() => (Array.isArray(harvests) ? byWeek(harvests) : []), [harvests]);
  const live = weeks.length > 0;
  const series = [{ key: "kg", label: "Expected harvest" }];

  return (
    <Card
      title="Harvest Outlook"
      icon={TrendingUp}
      action={<Badge tone="green">{live ? "By week" : "Seasonal trend"}</Badge>}
    >
      {live && weeks.length >= 3 && (
        <AreaTrend data={weeks} series={series} height={220} format={kg} axisFormat={axis} />
      )}
      {live && weeks.length < 3 && (
        <BarCompare data={weeks} series={series} height={220} format={kg} axisFormat={axis} />
      )}
      {!live && (
        <div className="w-full min-w-0" style={{ height: 210 }}>
          <HarvestChart {...OUTLOOK} height={210} />
        </div>
      )}
    </Card>
  );
}