import { Sparkles } from "lucide-react";

export default function RecommendedCard({ facilities }) {
  const top = [...facilities].sort((a, b) => b.score - a.score).slice(0, 3);
  return (
    <section className="card">
      <div className="pg-ai"><Sparkles size={16} aria-hidden="true" /> <strong>MAVUNO AI</strong> <span>Recommended Storage</span></div>
      <p className="pg-note">
        Based on your harvest forecast and current capacity, {top[0].name} offers the best balance of cost, distance and temperature suitability.
      </p>
      <h4>Top 3 Options</h4>
      {top.map((f, i) => (
        <div key={f.id} className="pg-opt">
          <span className="pg-rank">{i + 1}</span>
          <div className="grow"><strong>{f.name}</strong><small>{f.km} km</small></div>
          <span className="pg-score">Score {f.score}%</span>
        </div>
      ))}
      <button className="btn pg-block" onClick={() => document.getElementById("storage-facilities")?.scrollIntoView({ behavior: "smooth" })}>
        View Full Analysis
      </button>
    </section>
  );
}