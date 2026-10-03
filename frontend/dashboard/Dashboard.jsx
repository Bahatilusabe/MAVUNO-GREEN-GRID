import { useMemo, useState } from "react";
import "./Dashboard.css";

const FARMS = [
  { id: 1, name: "Kiambaina Farm", crop: "Tomatoes", emoji: "🍅", area: 1.2, kg: 4500, harvest: "Oct 18, 2026", risk: "High", perf: 92 },
  { id: 2, name: "Mwea Plot 02", crop: "Rice", emoji: "🌾", area: 0.8, kg: 3200, harvest: "Nov 03, 2026", risk: "Low", perf: 78 },
  { id: 3, name: "Kutus Farm", crop: "French Beans", emoji: "🫛", area: 0.4, kg: 2100, harvest: "Oct 24, 2026", risk: "Medium", perf: 65 },
];

const FORECASTS = {
  "7 days": { labels: ["Oct 10", "Oct 12", "Oct 14", "Oct 16", "Oct 18", "Oct 20", "Oct 22"], supply: [1.2, 2.0, 2.9, 3.8, 4.5, 4.2, 3.8], demand: [0.6, 1.1, 2.2, 3.2, 2.9, 2.7, 2.5] },
  "14 days": { labels: ["Oct 10", "Oct 14", "Oct 18", "Oct 22", "Oct 26", "Oct 30", "Nov 03"], supply: [1.2, 2.9, 4.5, 3.8, 3.0, 3.4, 3.2], demand: [0.6, 2.2, 2.9, 2.5, 2.4, 2.6, 2.8] },
  "30 days": { labels: ["Oct 10", "Oct 17", "Oct 24", "Oct 31", "Nov 07", "Nov 14", "Nov 21"], supply: [1.2, 4.3, 3.6, 3.1, 3.3, 2.4, 1.8], demand: [0.6, 2.9, 2.4, 2.7, 2.9, 2.2, 1.9] },
};

const RECS = [
  { id: 1, icon: "🚨", tone: "danger", title: "High Surplus Risk – Tomatoes", text: "Expected surplus of 1,800 kg. Act within 72 hours.", conf: 87 },
  { id: 2, icon: "🫛", tone: "info", title: "Better Market Price – French Beans", text: "Nairobi price is 16% higher than local.", conf: 79 },
  { id: 3, icon: "🏬", tone: "info", title: "Reserve Cold Storage", text: "Reserve space for 1,800 kg to cut spoilage risk.", conf: 82 },
];

const OPPS = [
  { name: "Nairobi Fresh Markets", type: "Buyer", km: 68, price: "KES 28/kg", note: "High demand" },
  { name: "Kagio Juice Processors", type: "Processor", km: 20, price: "KES 20/kg", note: "Medium demand" },
  { name: "Kirieyaga Cold Storage", type: "Storage", km: 10, price: "KES 12/kg/day", note: "Available" },
];

const PRICES = [
  { crop: "Tomatoes", price: 28, delta: 6, trend: [22, 23, 25, 24, 26, 27, 28] },
  { crop: "French Beans", price: 64, delta: 16, trend: [52, 54, 55, 58, 60, 62, 64] },
  { crop: "Rice", price: 120, delta: -2, trend: [124, 123, 123, 122, 121, 121, 120] },
];

const ACTIVITY = [
  ["🍅", "Tomato crop updated", "2 days ago"],
  ["📈", "Harvest forecast updated", "4 days ago"],
  ["💧", "Soil moisture reading", "6 days ago"],
  ["🚜", "Farm registered", "2 weeks ago"],
];

const WEATHER = [["Today", "⛅", 24], ["Sat", "🌦️", 22], ["Sun", "🌧️", 20], ["Mon", "⛅", 23], ["Tue", "☀️", 26]];

const PROMPTS = ["What should I do with my surplus tomatoes?", "Which buyers pay the best price?", "When is the best time to harvest?"];

const cls = (...a) => a.filter(Boolean).join(" ");
const fmt = (n) => n.toLocaleString();

function Spark({ data, up }) {
  const W = 80, H = 26;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i * W) / (data.length - 1)},${H - 3 - ((v - min) / (max - min || 1)) * (H - 6)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="spark" aria-hidden>
      <polyline points={pts} fill="none" stroke={up ? "#22a05a" : "#dc2626"} strokeWidth="2" />
    </svg>
  );
}

function Chart({ labels, a, b }) {
  const W = 560, H = 230, P = 34;
  const max = Math.ceil(Math.max(...a, ...b));
  const x = (i) => P + (i * (W - P * 2)) / (labels.length - 1);
  const y = (v) => H - P - (v / max) * (H - P * 2);
  const pts = (arr) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = (arr) => `${P},${H - P} ${pts(arr)} ${x(arr.length - 1)},${H - P}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Expected production versus market demand">
      {Array.from({ length: max + 1 }, (_, i) => (
        <g key={i}>
          <line x1={P} x2={W - P} y1={y(i)} y2={y(i)} className="grid" />
          <text x={P - 8} y={y(i) + 4} textAnchor="end" className="axis">{i}t</text>
        </g>
      ))}
      <polygon points={area(a)} fill="rgba(34,160,90,.15)" />
      <polygon points={area(b)} fill="rgba(37,99,235,.12)" />
      <polyline points={pts(a)} fill="none" stroke="#22a05a" strokeWidth="2.5" />
      <polyline points={pts(b)} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      {labels.map((l, i) => <text key={l} x={x(i)} y={H - 8} textAnchor="middle" className="axis">{l}</text>)}
    </svg>
  );
}

function Assistant() {
  const [msgs, setMsgs] = useState([{ from: "ai", text: "I'm here to help you make better decisions and reduce loss." }]);
  const [text, setText] = useState("");
  const send = (q) => {
    const t = (q ?? text).trim();
    if (!t) return;
    const l = t.toLowerCase();
    const reply = l.includes("surplus") ? "Reserve cold storage for 1,800 kg and match with Nairobi Fresh Markets (KES 28/kg). Act within 72 hours."
      : l.includes("buyer") ? "Nairobi Fresh Markets pays best at KES 28/kg, 68 km away."
      : l.includes("harvest") ? "Tomatoes are ready around Oct 18. Harvest early morning for best shelf life."
      : "Got it. Checking your farms and the market.";
    setMsgs((m) => [...m, { from: "me", text: t }, { from: "ai", text: reply }]);
    setText("");
  };
  return (
    <aside className="db-card db-assistant">
      <div className="db-row"><span className="db-ico">🌿</span><div><strong>MAVUNO AI</strong><small>Your farming assistant</small></div></div>
      <div className="db-chat" aria-live="polite">{msgs.map((m, i) => <p key={i} className={`db-bubble ${m.from}`}>{m.text}</p>)}</div>
      {PROMPTS.map((p) => <button key={p} className="db-prompt" onClick={() => send(p)}>{p}</button>)}
      <form className="db-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask MAVUNO AI…" aria-label="Ask MAVUNO AI" />
        <button className="db-btn sm" aria-label="Send">➤</button>
      </form>
    </aside>
  );
}

export default function Dashboard({ onNavigate = () => {}, userName = "Samuel" }) {
  const [range, setRange] = useState("7 days");
  const [dismissed, setDismissed] = useState([]);
  const [matched, setMatched] = useState({});

  const t = useMemo(() => {
    const kg = FARMS.reduce((s, f) => s + f.kg, 0);
    return {
      farms: FARMS.length,
      area: FARMS.reduce((s, f) => s + f.area, 0).toFixed(1),
      tons: (kg / 1000).toFixed(1),
      high: FARMS.filter((f) => f.risk === "High").length,
    };
  }, []);

  const fc = FORECASTS[range];
  const recs = RECS.filter((r) => !dismissed.includes(r.id));

  const kpis = [
    ["🚜", "Total farms", t.farms, "farms"],
    ["📐", "Total area", `${t.area} ha`, "farms"],
    ["⚖️", "Expected harvest", `${t.tons} t`, "crops"],
    ["⚠️", "High risk crops", t.high, "recs", t.high > 0],
  ];

  return (
    <div className="db">
      <div className="db-main">
        <header className="db-head">
          <div>
            <h1>Good day, {userName} 👋</h1>
            <small>Here's how your farms are doing this week.</small>
          </div>
          <button className="db-btn" onClick={() => onNavigate("farms")}>＋ Add Farm</button>
        </header>

        {t.high > 0 && recs.some((r) => r.id === 1) && (
          <div className="db-alert" role="alert">
            <span>🚨</span>
            <div className="grow"><strong>High surplus risk on Tomatoes</strong><small>1,800 kg may go unsold. Act within 72 hours.</small></div>
            <button className="db-btn sm" onClick={() => onNavigate("recs")}>View Plan</button>
          </div>
        )}

        <div className="db-kpis">
          {kpis.map(([icon, label, value, to, danger]) => (
            <button key={label} className={cls("db-card db-kpi", danger && "danger")} onClick={() => onNavigate(to)}>
              <span className="db-ico">{icon}</span>
              <div><small>{label}</small><strong>{value}</strong></div>
            </button>
          ))}
        </div>

        <div className="db-grid2">
          <section className="db-card">
            <div className="db-row">
              <h3 className="grow">Harvest Forecast</h3>
              <div className="db-seg" role="tablist">
                {Object.keys(FORECASTS).map((r) => (
                  <button key={r} role="tab" aria-selected={range === r} className={cls(range === r && "on")} onClick={() => setRange(r)}>{r}</button>
                ))}
              </div>
            </div>
            <div className="db-legend"><span><i style={{ background: "#22a05a" }} />Expected Production</span><span><i style={{ background: "#2563eb" }} />Market Demand</span></div>
            <Chart labels={fc.labels} a={fc.supply} b={fc.demand} />
          </section>

          <section className="db-card">
            <div className="db-row"><h3 className="grow">My Crops</h3><button className="db-link" onClick={() => onNavigate("crops")}>View all</button></div>
            {FARMS.map((f) => (
              <button key={f.id} className="db-crop" onClick={() => onNavigate("crops")}>
                <span className="db-ico lg">{f.emoji}</span>
                <div className="grow">
                  <strong>{f.crop}</strong>
                  <small>{f.name} • {(f.kg / 1000).toFixed(1)} t • {f.harvest}</small>
                  <div className="db-bar"><div style={{ width: `${f.perf}%` }} /></div>
                </div>
                <span className={`db-pill ${f.risk.toLowerCase()}`}>{f.risk}</span>
              </button>
            ))}
          </section>
        </div>

        <div className="db-grid2">
          <section className="db-card">
            <div className="db-row"><h3 className="grow">AI Recommendations</h3><button className="db-link" onClick={() => onNavigate("recs")}>View all</button></div>
            {recs.map((r) => (
              <div key={r.id} className={cls("db-rec", r.tone)}>
                <span className="db-ico">{r.icon}</span>
                <div className="grow"><strong>{r.title}</strong><small>{r.text}</small><span className="db-chip">{r.conf}% confidence</span></div>
                <button className="db-x" aria-label={`Dismiss ${r.title}`} onClick={() => setDismissed([...dismissed, r.id])}>✕</button>
              </div>
            ))}
            {!recs.length && <p className="db-empty">You're all caught up 🎉</p>}
          </section>

          <section className="db-card">
            <div className="db-row"><h3 className="grow">Nearby Opportunities</h3><button className="db-link" onClick={() => onNavigate("opportunities")}>View all</button></div>
            {OPPS.map((o) => (
              <div key={o.name} className="db-row opp">
                <div className="grow"><strong>{o.name}</strong><small>{o.type} • {o.km} km • {o.price} • {o.note}</small></div>
                <button className={cls("db-btn sm", matched[o.name] && "done")} onClick={() => setMatched({ ...matched, [o.name]: !matched[o.name] })}>
                  {matched[o.name] ? "Matched ✓" : "Match"}
                </button>
              </div>
            ))}
          </section>
        </div>

        <div className="db-grid3">
          <section className="db-card">
            <div className="db-row"><h3 className="grow">Market Prices</h3><button className="db-link" onClick={() => onNavigate("market")}>Market</button></div>
            {PRICES.map((p) => (
              <div key={p.crop} className="db-price">
                <div className="grow"><strong>{p.crop}</strong><small>KES {p.price}/kg</small></div>
                <Spark data={p.trend} up={p.delta >= 0} />
                <b className={p.delta >= 0 ? "up" : "down"}>{p.delta >= 0 ? "▲" : "▼"} {Math.abs(p.delta)}%</b>
              </div>
            ))}
          </section>

          <section className="db-card">
            <h3>Weather</h3>
            <div className="db-weather">
              {WEATHER.map(([d, i, c]) => <div key={d}><small>{d}</small><span>{i}</span><b>{c}°</b></div>)}
            </div>
            <small>Sample data. Connect a weather API.</small>
          </section>

          <section className="db-card">
            <h3>Recent Activity</h3>
            {ACTIVITY.map(([i, a, w]) => (
              <div key={a} className="db-row"><span className="db-ico sm">{i}</span><div className="grow"><small className="ink">{a}</small><small>{w}</small></div></div>
            ))}
          </section>
        </div>
      </div>
      <Assistant />
    </div>
  );
}