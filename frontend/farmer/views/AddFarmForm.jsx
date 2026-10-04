import { useState } from "react";

const COUNTIES = ["Kirinyaga", "Embu", "Murang'a", "Nyeri", "Machakos"];
const EMPTY = { name: "", county: "", sub: "", area: "", water: "", irrigation: "" };

export default function AddFarmForm({ onSave, onCancel }) {
  const [f, setF] = useState(EMPTY);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name && f.county && f.sub && Number(f.area) > 0;

  return (
    <div className="card add-farm">
      <h3>Add Farm</h3>
      <label>Farm Name *<input value={f.name} onChange={set("name")} placeholder="e.g. Kiambaina Farm" /></label>
      <label>County *
        <select value={f.county} onChange={set("county")}>
          <option value="">Select County</option>
          {COUNTIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Sub County *<input value={f.sub} onChange={set("sub")} placeholder="Select Sub County" /></label>
      <label>Area (acres) *<input type="number" min="0" step="0.1" value={f.area} onChange={set("area")} placeholder="e.g. 1.2" /></label>
      <label>Water Source
        <select value={f.water} onChange={set("water")}>
          <option value="">Select</option>{["Borehole", "River", "Canal", "Rain-fed"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Irrigation Type
        <select value={f.irrigation} onChange={set("irrigation")}>
          <option value="">Select</option>{["Drip", "Sprinkler", "Flood", "None"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Upload Farm Photo<div className="dropzone">Click to upload or drag</div></label>
      <div className="btn-row">
        <button className="btn grow" disabled={!valid} onClick={() => onSave({ ...f, area: +(Number(f.area) * 0.4047).toFixed(2) })}>Save Farm</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}