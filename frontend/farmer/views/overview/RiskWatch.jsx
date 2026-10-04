import { Brain, CircleCheck, Hourglass, Scale } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { CropIcon, FakeMap } from "../../components/ui";
import { FACTORS, CONFIDENCE, HOURS_TO_WINDOW } from "./data";

function Ring({ pct }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" width="52" height="52" role="img" aria-label={`${pct}% confidence`}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="#e6f4ec" strokeWidth="4" />
      <circle cx="22" cy="22" r={r} fill="none" stroke="#1e7a46" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 22 22)" />
      <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#12261b">{pct}%</text>
    </svg>
  );
}

export default function RiskWatch({ m, go }) {
  const top = m.topFarm;
  return (
    <section className="card ov-hero">
      <div className="ov-map">
        <FakeMap risk={!!top} height={236} pins={top ? [{ x: 45, y: 50, color: "#dc2626", label: top.name }] : []} />
        {top && <span className="ov-maptag">High Risk Area</span>}
      </div>

      <div className="ov-hero-body">
        <div className="ov-brand"><Brain aria-hidden="true" size={17} /> <strong>MAVUNO AI</strong> <b>Harvest Risk Watch</b></div>
        {top ? (
          <>
            <h2 className="ov-headline">
              <CropIcon crop={top.crop} size={22} />
              <span>{top.crop} entering a <em>HIGH</em> surplus-risk window</span>
            </h2>
            <div className="ov-metrics">
              <div className="ov-metric"><span className="ov-mico"><Scale aria-hidden="true" size={18} /></span><div><strong>{fmt(m.exposedKg)} kg</strong><small>potentially exposed</small></div></div>
              <div className="ov-metric"><span className="ov-mico"><Hourglass aria-hidden="true" size={18} /></span><div><strong>{HOURS_TO_WINDOW} hours</strong><small>to harvest window</small></div></div>
            </div>
            <div className="ov-actions">
              <button className="btn" onClick={() => go("opportunities")}>View Green Grid Plan →</button>
              <button className="btn btn-outline" onClick={() => go("recs")}>Review Factors</button>
            </div>
          </>
        ) : (
          <h2 className="ov-headline"><CircleCheck aria-hidden="true" size={22} /><span>No farms are in a surplus-risk window</span></h2>
        )}
      </div>

      <aside className="ov-factors">
        <div className="ov-conf">
          <div className="grow">
            <small>Confidence</small>
            <div className="bar"><div style={{ width: `${CONFIDENCE}%` }} /></div>
          </div>
          <Ring pct={CONFIDENCE} />
        </div>
        <h4>Key Factors</h4>
        {FACTORS.map(([Icon, label, value, mark]) => (
          <div key={label} className="ov-factor">
            <span className="ov-mico sm"><Icon aria-hidden="true" size={16} /></span>
            <span>{label}</span>
            <small className="ov-fv">{value} ({mark})</small>
          </div>
        ))}
      </aside>
    </section>
  );
}