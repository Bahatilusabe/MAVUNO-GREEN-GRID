export default function AlertsCard({ alerts, onResolve }) {
  return (
    <section className="ad-card">
      <h3>🚨 Alerts</h3>
      {alerts.map((a) => (
        <div key={a.id} className="ad-row ad-line">
          <span className={`ad-pill ${a.level.toLowerCase()}`}>{a.level}</span>
          <small className="grow ink">{a.text}</small>
          <button className="ad-btn sm ghost" onClick={() => onResolve(a.id)}>Resolve</button>
        </div>
      ))}
      {!alerts.length && <p className="ad-empty">No open alerts 🎉</p>}
    </section>
  );
}