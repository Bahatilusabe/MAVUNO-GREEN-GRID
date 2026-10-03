import { useMemo, useState } from "react";
import "./AdminDashboard.css";

const USERS = [
  { id: 1, name: "Samuel Kamau", county: "Kirinyaga", farms: 3, tons: 9.8, status: "Active", joined: "2026-03-12" },
  { id: 2, name: "Grace Wanjiru", county: "Murang'a", farms: 2, tons: 5.1, status: "Active", joined: "2026-04-02" },
  { id: 3, name: "Peter Mwangi", county: "Nyeri", farms: 1, tons: 1.9, status: "Pending", joined: "2026-09-28" },
  { id: 4, name: "Mary Njeri", county: "Embu", farms: 4, tons: 12.4, status: "Active", joined: "2026-02-19" },
  { id: 5, name: "John Otieno", county: "Kirinyaga", farms: 1, tons: 0.9, status: "Suspended", joined: "2026-05-30" },
  { id: 6, name: "Faith Muthoni", county: "Machakos", farms: 2, tons: 3.3, status: "Pending", joined: "2026-10-01" },
  { id: 7, name: "David Kiprop", county: "Nyeri", farms: 3, tons: 7.2, status: "Active", joined: "2026-06-14" },
  { id: 8, name: "Lucy Achieng", county: "Embu", farms: 1, tons: 2.0, status: "Active", joined: "2026-08-08" },
];

const PARTNERS = [
  { id: 1, name: "Kirieyaga Cold Storage", type: "Storage", county: "Kirinyaga", status: "Approved" },
  { id: 2, name: "Wakulima Transporters", type: "Transport", county: "Kirinyaga", status: "Approved" },
  { id: 3, name: "Mt. Kenya Fresh Co.", type: "Buyer", county: "Nyeri", status: "Pending" },
  { id: 4, name: "Kagio Juice Processors", type: "Processor", county: "Kirinyaga", status: "Approved" },
  { id: 5, name: "Savanna Haulers", type: "Transport", county: "Machakos", status: "Pending" },
];

const COUNTY_RISK = [
  { county: "Kirinyaga", risk: 74 },
  { county: "Murang'a", risk: 58 },
  { county: "Nyeri", risk: 41 },
  { county: "Embu", risk: 33 },
  { county: "Machakos", risk: 19 },
];

const WASTE = [
  { m: "Apr", t: 4.1 }, { m: "May", t: 6.3 }, { m: "Jun", t: 8.8 },
  { m: "Jul", t: 11.2 }, { m: "Aug", t: 14.6 }, { m: "Sep", t: 18.9 },
];

const ALERTS_INIT = [
  { id: 1, level: "High", text: "Tomato surplus risk spiking in Kirinyaga (1,800 kg unmatched)" },
  { id: 2, level: "Medium", text: "Cold storage capacity above 85% in Kirinyaga" },
  { id: 3, level: "Medium", text: "2 partner applications waiting over 48 hours" },
  { id: 4, level: "Low", text: "Weather API latency above normal" },
];

const HEALTH = [
  ["API", "Operational", "ok"],
  ["Database", "Operational", "ok"],
  ["SMS gateway", "Degraded", "warn"],
  ["AI engine", "Operational", "ok"],
];

const cls = (...a) => a.filter(Boolean).join(" ");

function Bars({ data }) {
  const W = 420, H = 190, P = 30;
  const max = Math.ceil(Math.max(...data.map((d) => d.t)) / 5) * 5;
  const bw = (W - P * 2) / data.length;
  const y = (v) => H - P - (v / max) * (H - P * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ad-chart" role="img" aria-label="Waste avoided per month in tonnes">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} className="grid" />
          <text x={P - 6} y={y(max * f) + 4} textAnchor="end" className="axis">{Math.round(max * f)}t</text>
        </g>
      ))}
      {data.map((d, i) => (
        <g key={d.m}>
          <rect x={P + i * bw + 10} y={y(d.t)} width={bw - 20} height={H - P - y(d.t)} rx="4" fill="#22a05a" />
          <text x={P + i * bw + bw / 2} y={y(d.t) - 5} textAnchor="middle" className="axis">{d.t}</text>
          <text x={P + i * bw + bw / 2} y={H - 10} textAnchor="middle" className="axis">{d.m}</text>
        </g>
      ))}
    </svg>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState(USERS);
  const [partners, setPartners] = useState(PARTNERS);
  const [alerts, setAlerts] = useState(ALERTS_INIT);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: "name", dir: 1 });

  const kpi = useMemo(() => ({
    users: users.length,
    active: users.filter((u) => u.status === "Active").length,
    farms: users.reduce((s, u) => s + u.farms, 0),
    tons: users.reduce((s, u) => s + u.tons, 0).toFixed(1),
    pendingUsers: users.filter((u) => u.status === "Pending").length,
    pendingPartners: partners.filter((p) => p.status === "Pending").length,
    openAlerts: alerts.length,
  }), [users, partners, alerts]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users
      .filter((u) => (status === "All" || u.status === status) && (!term || u.name.toLowerCase().includes(term) || u.county.toLowerCase().includes(term)))
      .sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        return (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir;
      });
  }, [users, q, status, sort]);

  const setUserStatus = (id, s) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: s } : u)));
  const setPartnerStatus = (id, s) => setPartners((ps) => ps.map((p) => (p.id === id ? { ...p, status: s } : p)));
  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));
  const arrow = (k) => (sort.key === k ? (sort.dir === 1 ? " ▲" : " ▼") : "");

  const kpis = [
    ["👥", "Total farmers", kpi.users, `${kpi.active} active`],
    ["🚜", "Registered farms", kpi.farms, "across 5 counties"],
    ["⚖️", "Expected harvest", `${kpi.tons} t`, "all farmers"],
    ["🕒", "Pending approvals", kpi.pendingUsers + kpi.pendingPartners, `${kpi.pendingUsers} farmers, ${kpi.pendingPartners} partners`],
    ["🚨", "Open alerts", kpi.openAlerts, "needs review", kpi.openAlerts > 0],
  ];

  return (
    <div className="ad">
      <header className="ad-head">
        <div><h1>Admin Dashboard</h1><small>Platform overview for MAVUNO Green Grid</small></div>
        <span className="ad-badge">Admin</span>
      </header>

      <div className="ad-kpis">
        {kpis.map(([icon, label, value, sub, danger]) => (
          <div key={label} className={cls("ad-card ad-kpi", danger && "danger")}>
            <span className="ad-ico">{icon}</span>
            <div><small>{label}</small><strong>{value}</strong><small>{sub}</small></div>
          </div>
        ))}
      </div>

      <div className="ad-grid2">
        <section className="ad-card">
          <h3>Waste avoided (tonnes / month)</h3>
          <Bars data={WASTE} />
        </section>
        <section className="ad-card">
          <h3>Surplus risk by county</h3>
          {COUNTY_RISK.map((c) => (
            <div key={c.county} className="ad-risk">
              <span>{c.county}</span>
              <div className="ad-bar"><div className={c.risk >= 60 ? "hi" : c.risk >= 35 ? "md" : "lo"} style={{ width: `${c.risk}%` }} /></div>
              <b>{c.risk}%</b>
            </div>
          ))}
        </section>
      </div>

      <section className="ad-card">
        <div className="ad-row">
          <h3 className="grow">Farmers</h3>
          <input className="ad-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or county…" aria-label="Search farmers" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            {["All", "Active", "Pending", "Suspended"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th><button onClick={() => sortBy("name")}>Name{arrow("name")}</button></th>
                <th><button onClick={() => sortBy("county")}>County{arrow("county")}</button></th>
                <th><button onClick={() => sortBy("farms")}>Farms{arrow("farms")}</button></th>
                <th><button onClick={() => sortBy("tons")}>Harvest (t){arrow("tons")}</button></th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong><small>Joined {u.joined}</small></td>
                  <td>{u.county}</td><td>{u.farms}</td><td>{u.tons}</td>
                  <td><span className={`ad-pill ${u.status.toLowerCase()}`}>{u.status}</span></td>
                  <td className="ad-actions">
                    {u.status === "Pending" && <button className="ad-btn sm" onClick={() => setUserStatus(u.id, "Active")}>Approve</button>}
                    {u.status === "Active" && <button className="ad-btn sm ghost" onClick={() => setUserStatus(u.id, "Suspended")}>Suspend</button>}
                    {u.status === "Suspended" && <button className="ad-btn sm" onClick={() => setUserStatus(u.id, "Active")}>Reactivate</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="ad-empty">No farmers match.</p>}
        </div>
      </section>

      <div className="ad-grid2">
        <section className="ad-card">
          <h3>Partners</h3>
          {partners.map((p) => (
            <div key={p.id} className="ad-row ad-line">
              <div className="grow"><strong>{p.name}</strong><small>{p.type} • {p.county}</small></div>
              {p.status === "Pending" ? (
                <>
                  <button className="ad-btn sm" onClick={() => setPartnerStatus(p.id, "Approved")}>Approve</button>
                  <button className="ad-btn sm ghost" onClick={() => setPartnerStatus(p.id, "Rejected")}>Reject</button>
                </>
              ) : (
                <span className={`ad-pill ${p.status.toLowerCase()}`}>{p.status}</span>
              )}
            </div>
          ))}
        </section>

        <div className="ad-stack">
          <section className="ad-card">
            <h3>Alerts</h3>
            {alerts.map((a) => (
              <div key={a.id} className="ad-row ad-line">
                <span className={`ad-pill ${a.level.toLowerCase()}`}>{a.level}</span>
                <small className="grow ink">{a.text}</small>
                <button className="ad-btn sm ghost" onClick={() => setAlerts(alerts.filter((x) => x.id !== a.id))}>Resolve</button>
              </div>
            ))}
            {!alerts.length && <p className="ad-empty">No open alerts 🎉</p>}
          </section>

          <section className="ad-card">
            <h3>System health</h3>
            {HEALTH.map(([name, state, tone]) => (
              <div key={name} className="ad-row ad-line">
                <span className={`ad-dot ${tone}`} /><span className="grow">{name}</span><small>{state}</small>
              </div>
            ))}
            <small>Sample data. Connect to your monitoring service.</small>
          </section>
        </div>
      </div>
    </div>
  );
}