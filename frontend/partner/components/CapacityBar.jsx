import { fmt } from "../../shared/utils";
import Progress from "../../shared/ui/Progress";

export default function CapacityBar({ stats, capacity }) {
  return (
    <section className="surface space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">Capacity today</h3>
        <span className="text-xs font-semibold text-muted-foreground tabular">
          {fmt(stats.load)} / {fmt(capacity)} kg
        </span>
      </div>

      <Progress value={stats.util} label="Capacity used" />

      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>{stats.util}% committed</span>
        <span className="tabular">{fmt(stats.remaining)} kg free</span>
      </div>
    </section>
  );
}
