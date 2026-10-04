import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { TIP } from "../../../shared/chartColors";
import { SOURCES, TOTAL_IMPACT } from "./data";

export default function Sources() {
  return (
    <section className="card">
      <h3>Where Your Impact Comes From</h3>
      <div className="pg-sources">
        <div className="pg-donut">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={SOURCES} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2} stroke="none">
                {SOURCES.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip {...TIP} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pg-donut-center"><small>Total Impact</small><strong>{TOTAL_IMPACT}</strong></div>
        </div>
        <ul className="pg-legend">
          {SOURCES.map((s) => (
            <li key={s.name}><i style={{ background: s.color }} /><span className="grow">{s.name}</span><b>{s.value}%</b></li>
          ))}
        </ul>
      </div>
    </section>
  );
}