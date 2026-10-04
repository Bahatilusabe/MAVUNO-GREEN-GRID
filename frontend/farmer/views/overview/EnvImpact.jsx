import { ENV } from "./data";

export default function EnvImpact() {
  return (
    <section className="card">
      <h3 className="ov-title">My Environmental Impact</h3>
      <div className="ov-env">
        {ENV.map(([Icon, label, value, sub]) => (
          <div key={label} className="ov-env-tile">
            <span className="ov-mico sm"><Icon aria-hidden="true" size={16} /></span>
            <div><small>{label}</small><strong>{value}</strong><small>{sub}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}