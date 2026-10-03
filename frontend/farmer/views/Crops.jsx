import { useState } from "react";
import { fmt } from "../../shared/utils";
import { riskClass } from "../constants";
import { CropIcon, Tabs, Thumb } from "../components/ui";

const time = (f) => Date.parse(f.harvest) || Infinity;

export default function Crops({ farms, onOpen }) {
  const [tab, setTab] = useState("My Crops");
  const sorted = [...farms].sort((a, b) => time(a) - time(b));
  return (
    <>
      <Tabs
        tabs={["My Crops", "Harvest Calendar"]}
        active={tab}
        onChange={setTab}
      />
      {tab === "My Crops" ? (
        <div className="crop-grid">
          {farms.map((f) => (
            <button
              key={f.id}
              className="card crop-card"
              onClick={() => onOpen(f.id)}
            >
              <Thumb crop={f.crop} size={72} />
              <div>
                <strong>{f.crop}</strong>
                <small>{(f.kg / 1000).toFixed(1)} t</small>
                <span className={riskClass(f.risk)}>{f.risk} Risk</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="card empty">Calendar view coming soon.</div>
      )}
      <div className="card">
        <h3>Upcoming Harvests</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Farm</th>
                <th>Expected Date</th>
                <th>Quantity</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => onOpen(f.id)}
                  className="clickable"
                >
                  <td>
                    <CropIcon crop={f.crop} size={16} /> {f.crop}
                  </td>
                  <td>{f.name.replace(" Farm", "")}</td>
                  <td>{f.harvest}</td>
                  <td>{fmt(f.kg)} kg</td>
                  <td>
                    <span className={riskClass(f.risk)}>{f.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
