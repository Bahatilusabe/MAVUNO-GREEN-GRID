import { useMemo } from "react";
import { ChartPie, MapPinned, Recycle, ShieldCheck, UsersRound } from "lucide-react";
import { BarsChart, ChartFrame, Donut, Gauge, HBars } from "../../shared/charts";
import { COLORS, SERIES_COLORS } from "../../shared/chartColors";
import Badge from "../../shared/ui/Badge";

/** Live vs sample is never implied by colour alone — it is always labelled. */
function StateBadge({ live }) {
  return (
    <Badge tone={live ? "success" : "warning"} dot>
      {live ? "Live" : "Sample data"}
    </Badge>
  );
}

export function WasteChart({ data }) {
  return (
    <ChartFrame
      title="Waste avoided"
      subtitle="Tonnes diverted from loss, last six months"
      icon={Recycle}
      height={240}
      badge={<Badge tone="warning">Sample data</Badge>}
    >
      <BarsChart
        data={data}
        xKey="m"
        yKey="t"
        color={SERIES_COLORS.waste}
        height={220}
        unit=" t"
        label="Waste avoided"
      />
    </ChartFrame>
  );
}

export function CountyRiskChart({ counties, live }) {
  return (
    <ChartFrame
      title="Surplus risk by county"
      subtitle="Crops flagged medium or high risk, 0-100"
      icon={MapPinned}
      height={240}
      badge={<StateBadge live={live} />}
    >
      <HBars data={counties} nameKey="county" valueKey="risk" height={220} />
    </ChartFrame>
  );
}

export function StatusDonut({ users, live }) {
  const data = useMemo(() => {
    const count = (status) => users.filter((u) => u.status === status).length;
    return [
      { name: "Active", value: count("Active"), color: COLORS.green },
      { name: "Pending", value: count("Pending"), color: COLORS.amber },
      { name: "Suspended", value: count("Suspended"), color: COLORS.red },
    ].filter((d) => d.value > 0);
  }, [users]);

  return (
    <ChartFrame
      title="Farmers by status"
      subtitle="Distribution of farmer accounts"
      icon={UsersRound}
      height={240}
      badge={<StateBadge live={live} />}
    >
      {data.length ? (
        <Donut data={data} height={220} />
      ) : (
        <p className="grid h-[220px] place-items-center text-xs font-medium text-muted-foreground">
          No farmer accounts to chart yet.
        </p>
      )}
    </ChartFrame>
  );
}

export function PartnerMixChart({ partners, live }) {
  const byType = useMemo(() => {
    const counts = new Map();
    for (const p of partners) counts.set(p.type, (counts.get(p.type) || 0) + 1);
    return [...counts.entries()].map(([type, count]) => ({ type, count }));
  }, [partners]);

  return (
    <ChartFrame
      title="Partner mix"
      subtitle="Partners on the platform by service type"
      icon={ChartPie}
      height={240}
      badge={<StateBadge live={live} />}
    >
      {byType.length ? (
        <BarsChart
          data={byType}
          xKey="type"
          yKey="count"
          color={COLORS.blue}
          height={220}
          label="Partners"
        />
      ) : (
        <p className="grid h-[220px] place-items-center text-xs font-medium text-muted-foreground">
          No partner accounts to chart yet.
        </p>
      )}
    </ChartFrame>
  );
}

/** One figure in the platform summary grid. */
function Figure({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-bold tabular text-foreground">{value}</dd>
    </div>
  );
}

export function PlatformSummaryChart({ totals, live }) {
  const activeRate = totals.farmers ? Math.round((totals.active / totals.farmers) * 100) : 0;

  return (
    <ChartFrame
      title="Platform summary"
      subtitle="Account health across the whole grid"
      icon={ShieldCheck}
      height={240}
      badge={<StateBadge live={live} />}
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,190px)_1fr] sm:items-center">
        <Gauge
          value={activeRate}
          label="Active farmers"
          caption={`${totals.active} of ${totals.farmers}`}
          color={COLORS.green}
          height={190}
        />
        <dl className="grid grid-cols-2 gap-3">
          <Figure label="Farms" value={totals.farms} />
          <Figure label="Area" value={`${totals.areaHa} ha`} />
          <Figure label="Expected harvest" value={`${totals.tons.toFixed(1)} t`} />
          <Figure label="Match requests" value={totals.matchRequests} />
          <Figure label="Pending requests" value={totals.pendingMatches} />
          <Figure label="Partners with an account" value={`${totals.linkedPartners} / ${totals.partners ?? "—"}`} />
        </dl>
      </div>
    </ChartFrame>
  );
}
