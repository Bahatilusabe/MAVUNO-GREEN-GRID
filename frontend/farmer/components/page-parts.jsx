import { TrendingDown, TrendingUp } from "lucide-react";
import { cls } from "../../shared/utils";

export function StatCard({ icon: Icon, tone = "green", label, value, trend, down, danger }) {
  const Arrow = down ? TrendingDown : TrendingUp;
  return (
    <div className={cls("card pg-stat", danger && "danger")}>
      <span className={`pg-ico ${tone}`}><Icon size={22} aria-hidden="true" /></span>
      <small>{label}</small>
      <strong>{value}</strong>
      {trend && <span className="pg-trend"><Arrow size={13} aria-hidden="true" /> {trend}</span>}
    </div>
  );
}

export function StatusPill({ status }) {
  return <span className={`pg-status ${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>;
}