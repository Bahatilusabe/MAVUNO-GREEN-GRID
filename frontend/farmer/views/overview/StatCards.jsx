import { AlertTriangle, Banknote, Sprout, Tractor, TrendingDown, TrendingUp } from "lucide-react";
import { fmt } from "../../../shared/utils";
import IconBadge from "../../../shared/kit/IconBadge";
import Badge from "../../../shared/kit/Badge";
import { STAT_TRENDS, VALUE_PROTECTED } from "./data";

export default function StatCards({ m }) {
  const atRiskKg = m.atRiskKg ?? m.exposedKg;

  const cards = [
    { icon: Tractor, label: "My Farms", value: m.count, trend: STAT_TRENDS.farms, tone: "green", warn: false },
    { icon: Sprout, label: "Expected Harvest", value: `${m.tons.toFixed(1)} t`, trend: STAT_TRENDS.harvest, tone: "blue", warn: false },
    { icon: AlertTriangle, label: "At-Risk Produce", value: `${(atRiskKg / 1000).toFixed(1)} t`, trend: STAT_TRENDS.risk, tone: "amber", warn: atRiskKg > 0 },
    { icon: Banknote, label: "Value Protected", value: `KES ${fmt(VALUE_PROTECTED)}`, trend: STAT_TRENDS.value, tone: "purple", warn: false },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ icon, label, value, trend, tone, warn }) => (
        <div
          key={label}
          className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          style={{
            boxShadow: "var(--shadow-card)",
            borderColor: warn
              ? "color-mix(in srgb, var(--tone-red-fg) 35%, transparent)"
              : undefined,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <IconBadge icon={icon} tone={warn ? "red" : tone} />
            <Badge tone={warn ? "red" : "green"} icon={warn ? TrendingDown : TrendingUp}>
              {trend}
            </Badge>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-extrabold tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  );
}