import Stat from "../../shared/ui/Stat";
import { Reveal } from "../../shared/ui/Motion";

/**
 * The admin KPI row. Five tiles, so the grid has to grow to five columns
 * before it wraps — the old four-column grid dropped a tile onto a second
 * row and left the row ragged.
 */
export default function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi, i) => (
        <Reveal key={kpi.label} index={i}>
          <Stat {...kpi} />
        </Reveal>
      ))}
    </div>
  );
}
