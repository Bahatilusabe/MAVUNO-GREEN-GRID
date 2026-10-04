import { Snowflake, Warehouse } from "lucide-react";
import { fmt } from "../../../shared/utils";

const TYPE_ICON = { "Cold Store": Snowflake, Refrigerated: Snowflake, Warehouse };

export default function FacilitiesTable({ facilities, requested, tons, onReserve }) {
  return (
    <section className="card" id="storage-facilities">
      <h3>Storage Facilities</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Facility</th><th>Type</th><th>Available</th><th>Distance</th><th>Cost / Day</th><th>Compatible Crops</th><th>Action</th></tr>
          </thead>
          <tbody>
            {facilities.map((f) => {
              const Icon = TYPE_ICON[f.type] || Warehouse;
              const done = requested.includes(f.id);
              const full = f.available < tons;
              return (
                <tr key={f.id}>
                  <td><span className="pg-cell"><span className="pg-mini"><Icon size={16} aria-hidden="true" /></span><strong>{f.name}</strong></span></td>
                  <td>{f.type}</td>
                  <td>{f.available.toFixed(1)} t</td>
                  <td>{f.km} km</td>
                  <td>KES {fmt(f.cost)}</td>
                  <td className="pg-crops">{f.crops}</td>
                  <td>
                    <button className="btn btn-sm" disabled={done || full} title={full ? "Not enough free capacity" : undefined} onClick={() => onReserve(f)}>
                      {done ? "Requested" : full ? "Full" : "Reserve"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}