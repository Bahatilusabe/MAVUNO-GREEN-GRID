import { StatusPill } from "../../components/page-parts";
import { INTERVENTIONS } from "./data";

export default function Interventions() {
  return (
    <section className="card">
      <h3>Recent Interventions</h3>
      <ul className="pg-tl">
        {INTERVENTIONS.map((i) => (
          <li key={i.id}>
            <span className="pg-tl-dot" />
            <div className="grow"><small>{i.date}</small><strong>{i.title}</strong><small>{i.sub}</small></div>
            <StatusPill status={i.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}