import { fmt } from "../../../shared/utils";
import { StatusPill } from "../../components/page-parts";

export default function Reservations({ reservations }) {
  return (
    <section className="card">
      <h3>My Reservations</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Facility</th><th>Crop</th><th>Quantity</th><th>Status</th><th>Harvest Date</th></tr></thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.facility}</strong></td><td>{r.crop}</td><td>{fmt(r.kg)} kg</td>
                <td><StatusPill status={r.status} /></td><td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}