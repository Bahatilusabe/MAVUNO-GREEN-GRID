import { Sprout } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { StatusPill } from "../../components/page-parts";

export default function RequestsTable({ requests, onView }) {
  return (
    <section className="card">
      <h3>Transport Requests</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Crop</th><th>Quantity</th><th>Origin</th><th>Destination</th><th>Required By</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td><span className="pg-cell"><span className="pg-mini"><Sprout size={16} aria-hidden="true" /></span>{r.crop}</span></td>
                <td>{fmt(r.kg)} kg</td><td>{r.from}</td><td>{r.to}</td><td>{r.by}</td>
                <td><StatusPill status={r.status} /></td>
                <td><button className="btn btn-sm" onClick={() => onView(r)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}