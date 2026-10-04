import { MapPinned, Recycle, UsersRound } from "lucide-react";
import { BarsChart, HBars, Donut } from "../../shared/charts";
import { COLORS } from "../../shared/chartColors";
import { WASTE, COUNTY_RISK } from "../data";

export function WasteCard() {
  return (
    <section className="ad-card">
      <h3><Recycle aria-hidden="true" size={18} /> Waste avoided (tonnes / month)</h3>
      <BarsChart data={WASTE} xKey="m" yKey="t" format={(v) => `${v} t`} />
    </section>
  );
}

export function CountyRiskCard() {
  return (
    <section className="ad-card">
      <h3><MapPinned aria-hidden="true" size={18} /> Surplus risk by county</h3>
      <HBars data={COUNTY_RISK} nameKey="county" valueKey="risk" />
    </section>
  );
}

export function StatusCard({ users }) {
  const data = [
    { name: "Active", color: COLORS.green },
    { name: "Pending", color: COLORS.amber },
    { name: "Suspended", color: COLORS.red },
  ]
    .map((s) => ({ ...s, value: users.filter((u) => u.status === s.name).length }))
    .filter((s) => s.value > 0);
  return (
    <section className="ad-card">
      <h3><UsersRound aria-hidden="true" size={18} /> Farmers by status</h3>
      <Donut data={data} />
    </section>
  );
}