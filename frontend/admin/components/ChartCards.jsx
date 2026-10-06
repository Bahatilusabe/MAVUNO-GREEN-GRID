import { MapPinned, Recycle, UsersRound } from "lucide-react";
import { BarsChart, HBars, Donut } from "../../shared/charts";
import { COLORS } from "../../shared/chartColors";
import { WASTE, COUNTY_RISK } from "../data";

export function WasteCard() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-2xs">
          <Recycle aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Waste avoided (tonnes / month)</h3>
      </div>
      <div className="pt-2">
        <BarsChart data={WASTE} xKey="m" yKey="t" format={(v) => `${v} t`} />
      </div>
    </section>
  );
}

export function CountyRiskCard() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shadow-2xs">
          <MapPinned aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Surplus risk by county</h3>
      </div>
      <div className="pt-2">
        <HBars data={COUNTY_RISK} nameKey="county" valueKey="risk" />
      </div>
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
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shadow-2xs">
          <UsersRound aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Farmers by status</h3>
      </div>
      <div className="pt-2">
        <Donut data={data} />
      </div>
    </section>
  );
}