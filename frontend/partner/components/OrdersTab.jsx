import { fmt } from "../../shared/utils";
import { NEXT_LABEL } from "../data";

export default function OrdersTab({ orders, onAdvance }) {
  return (
    <section className="pp-card">
      <div className="pp-table-wrap">
        <table>
          <thead><tr><th>Farmer</th><th>Crop</th><th>Quantity</th><th>Value</th><th>Pickup</th><th>Status</th><th /></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.farmer}</strong></td><td>{o.crop}</td><td>{fmt(o.kg)} kg</td><td>KES {fmt(o.kg * o.price)}</td><td>{o.date}</td>
                <td><span className={`pp-pill ${o.status.replace(" ", "-").toLowerCase()}`}>{o.status}</span></td>
                <td>{NEXT_LABEL[o.status] && <button className="pp-btn sm" onClick={() => onAdvance(o.id)}>{NEXT_LABEL[o.status]}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}