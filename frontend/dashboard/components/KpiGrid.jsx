import { CircleDollarSign, Leaf, Recycle, Ruler, Scale, Tractor, TriangleAlert } from "lucide-react";
import Stat from "../../shared/ui/Stat";
import { Reveal } from "../../shared/ui/Motion";

/**
 * The dashboard KPI row.
 *
 * Every tile is the shared `Stat`, so the numbers count up, the icons use the
 * same colour language as the rest of the platform and the grid never goes
 * ragged. The impact row only appears when the AI service reports one.
 */
export default function KpiGrid({ totals, live }) {
  const kpis = [
    {
      icon: Tractor,
      label: "Total farms",
      value: totals.farms,
      hint: "registered on your account",
      tone: "brand",
    },
    {
      icon: Ruler,
      label: "Total area",
      value: totals.area,
      unit: "ha",
      decimals: 1,
      hint: "under cultivation",
      tone: "teal",
    },
    {
      icon: Scale,
      label: "Expected harvest",
      value: totals.tons,
      unit: "t",
      decimals: 1,
      hint: "across all crops",
      tone: "gold",
    },
    {
      icon: TriangleAlert,
      label: "High risk crops",
      value: totals.high,
      hint: totals.atRiskKg
        ? `${Number(totals.atRiskKg).toLocaleString("en-KE")} kg exposed`
        : "needs review",
      tone: totals.high ? "red" : "brand",
    },
  ];

  const impact = totals.impact
    ? [
        {
          icon: Scale,
          label: "Food saved",
          value: Number(totals.impact.tonnes_saved ?? 0),
          unit: "t",
          decimals: 1,
          hint: "diverted from loss",
          tone: "brand",
        },
        {
          icon: Recycle,
          label: "Food at risk",
          value: Number(totals.impact.tonnes_wasted ?? 0),
          unit: "t",
          decimals: 1,
          hint: "still in the chain",
          tone: "red",
        },
        {
          icon: CircleDollarSign,
          label: "Net value",
          value: Number(totals.impact.net_value_kes ?? totals.impact.revenue_kes ?? 0) / 1e6,
          unit: "M KES",
          decimals: 1,
          hint: "retained on the grid",
          tone: "gold",
        },
        {
          icon: Leaf,
          label: "CO₂e avoided",
          value: Number(totals.impact.co2e_avoided_t ?? 0),
          unit: "t",
          decimals: 1,
          hint: "emissions prevented",
          tone: "teal",
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Reveal key={kpi.label} index={i}>
            <Stat {...kpi} />
          </Reveal>
        ))}
      </div>

      {impact.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Network impact
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {impact.map((kpi, i) => (
              <Reveal key={kpi.label} index={i}>
                <Stat {...kpi} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {!live && (
        <p className="text-[11px] font-medium text-muted-foreground">
          Figures come from the sample grid. Sign in to see your own numbers.
        </p>
      )}
    </div>
  );
}
