import { Sparkles } from "lucide-react";
import { TODAY_RECS } from "./data";

export default function TodayRecs({ go }) {
  return (
    <section className="card">
      <h3 className="ov-title"><Sparkles aria-hidden="true" size={18} /> Today's AI Recommendations</h3>
      {TODAY_RECS.map((r) => (
        <div key={r.title} className="ov-rec">
          <span className="ov-mico"><r.icon aria-hidden="true" size={18} /></span>
          <div className="grow"><strong>{r.title}</strong><small>{r.text}</small></div>
          <button className="btn btn-sm" onClick={() => go(r.to)}>{r.cta}</button>
        </div>
      ))}
    </section>
  );
}