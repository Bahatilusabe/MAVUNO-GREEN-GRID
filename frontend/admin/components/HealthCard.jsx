import { HEALTH } from "../data";

export default function HealthCard() {
  return (
    <section className="ad-card">
      <h3>🩺 System health</h3>
      {HEALTH.map(([name, state, tone]) => (
        <div key={name} className="ad-row ad-line">
          <span className={`ad-dot ${tone}`} /><span className="grow">{name}</span><small>{state}</small>
        </div>
      ))}
      <small>Sample data. Connect to your monitoring service.</small>
    </section>
  );
}