import { CircleDollarSign, Recycle } from "lucide-react";
import { IMPACT } from "../../shared/data";
import { BarsChart, COLORS } from "../../shared/charts";
import { fmt } from "../../shared/utils";

const k = (v) => (v >= 1000 ? `${v / 1000}k` : v);

export default function Impact() {
  const kg = IMPACT.waste.reduce((s, d) => s + d.kg, 0);
  const kes = IMPACT.income.reduce((s, d) => s + d.kes, 0);
  return (
    <>
      <div className="stat-row">
        <div className="card kpi">
          <strong className="impact-value">
            <Recycle aria-hidden="true" size={20} /> {fmt(kg)} kg
          </strong>
          <small>Waste avoided</small>
        </div>
        <div className="card kpi">
          <strong className="impact-value">
            <CircleDollarSign aria-hidden="true" size={20} /> KES {fmt(kes)}
          </strong>
          <small>Extra income</small>
        </div>
      </div>
      <div className="split">
        <div className="card">
          <h3 className="impact-heading">
            <Recycle aria-hidden="true" size={18} /> Waste avoided (kg / month)
          </h3>
          <BarsChart data={IMPACT.waste} xKey="month" yKey="kg" />
        </div>
        <div className="card">
          <h3 className="impact-heading">
            <CircleDollarSign aria-hidden="true" size={18} /> Extra income (KES
            / month)
          </h3>
          <BarsChart
            data={IMPACT.income}
            xKey="month"
            yKey="kes"
            color={COLORS.blue}
            format={k}
          />
        </div>
      </div>
      <small>Sample data. Connect to real match results.</small>
    </>
  );
}
