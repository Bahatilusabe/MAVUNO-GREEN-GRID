import { useMemo, useState } from "react";
import "./FarmerPortal.css";

const NAV = [
  ["overview", "Overview", "🏠"],
  ["farms", "My Farms", "🚜"],
  ["crops", "Crops & Harvests", "🌱"],
  ["opportunities", "Green Grid Opportunities", "🔗"],
  ["recs", "AI Recommendations", "✨"],
  ["market", "Market & Buyers", "🛒"],
  ["storage", "Storage", "🏬"],
  ["transport", "Transport", "🚚"],
  ["impact", "Impact", "🌍"],
  ["messages", "Messages", "💬", true],
  ["settings", "Settings", "⚙️"],
];

const CROP = {
  Tomatoes: { emoji: "🍅", tone: "tomato" },
  "French Beans": { emoji: "🫛", tone: "beans" },
  Rice: { emoji: "🌾", tone: "rice" },
};

const INITIAL_FARMS = [
  { id: 1, name: "Kiambaina Farm", county: "Kirinyaga", area: 1.2, crop: "Tomatoes", kg: 4500, harvest: "Oct 18, 2026", risk: "High", perf: 92, type: "Smallholder", water: "Borehole", irrigation: "Drip", stage: "Flowering", coords: "-0.5186, 37.3675" },
  { id: 2, name: "Mwea Plot 02", county: "Kirinyaga", area: 0.8, crop: "Rice", kg: 3200, harvest: "Nov 03, 2026", risk: "Low", perf: 78, type: "Smallholder", water: "Canal", irrigation: "Flood", stage: "Tillering", coords: "-0.6700, 37.3500" },
  { id: 3, name: "Kutus Farm", county: "Kirinyaga", area: 0.4, crop: "French Beans", kg: 2100, harvest: "Oct 24, 2026", risk: "Medium", perf: 65, type: "Smallholder", water: "River", irrigation: "Drip", stage: "Pod fill", coords: "-0.5600, 37.2800" },
];

const OPPS = [
  { id: 1, name: "Nairobi Fresh Markets", type: "Buyer", km: 68, cap: "1,500 kg", price: "KES 28/kg", note: "High demand", x: 38, y: 12 },
  { id: 2, name: "Kagio Juice Processors", type: "Processor", km: 20, cap: "2,000 kg", price: "KES 20/kg", note: "Medium demand", x: 70, y: 32 },
  { id: 3, name: "Kirieyaga Cold Storage", type: "Storage", km: 10, cap: "5,000 kg", price: "KES 12/kg/day", note: "Available", x: 52, y: 58 },
  { id: 4, name: "Wakulima Transporters", type: "Transport", km: 40, cap: "10 t", price: "KES 18/km", note: "Available", x: 30, y: 74 },
];

const OPP_COLOR = { Buyer: "#1e7a46", Processor: "#2f9e5c", Storage: "#2563eb", Transport: "#1e3a8a" };

const RECS = [
  { id: 1, kind: "Harvest", icon: "🚨", title: "High Surplus Risk – Tomatoes", text: "Expected surplus of 1,800 kg. Act within 72 hours.", cta: "View Plan", conf: 87, tone: "danger",
    why: [["ok", "Local demand is 40% lower than expected supply"], ["ok", "Storage capacity is limited in your area"], ["ok", "Nearby buyers have available capacity"], ["bad", "Transport is available within 48 km only"]],
    impact: ["+KES 43,000 value", "−1.2 t waste avoided", "−3.4 t CO₂ reduced"] },
  { id: 2, kind: "Market", icon: "🫛", title: "Better Market Price – French Beans", text: "Nairobi market price is 16% higher than local.", cta: "View Details", conf: 79, tone: "info",
    why: [["ok", "Export-grade demand rising this week"], ["ok", "Your harvest window matches buyer needs"], ["bad", "Higher transport cost to Nairobi"]],
    impact: ["+KES 12,500 value", "−0.4 t waste avoided", "−0.9 t CO₂ reduced"] },
  { id: 3, kind: "Storage", icon: "🏬", title: "Storage Recommendation", text: "Reserve cold storage for 1,800 kg to reduce spoilage risk.", cta: "Reserve Now", conf: 82, tone: "info",
    why: [["ok", "Cold storage 10 km away has capacity"], ["ok", "Cuts spoilage risk from High to Low"], ["bad", "Storage fee KES 12/kg/day"]],
    impact: ["+KES 21,600 value", "−1.5 t waste avoided", "−2.8 t CO₂ reduced"] },
];

const BUYERS = [
  { name: "Nairobi Fresh Markets", sub: "Buyer • 68 km", cap: "1,500 kg capacity", price: "KES 28/kg", icon: "🛍️" },
  { name: "Kagio Juice Processors", sub: "Processor • 20 km", cap: "2,000 kg capacity", price: "KES 20/kg", icon: "🏭" },
];

const PRICES = [
  ["Nairobi Fresh Markets", "KES 28/kg", "High"],
  ["Kagio Processors", "KES 20/kg", "Medium"],
  ["Nakuru Market", "KES 17/kg", "Low"],
];

const FORECAST = {
  labels: ["Oct 10", "Oct 13", "Oct 16", "Oct 18", "Oct 21", "Oct 24"],
  supply: [1.2, 2.6, 3.8, 4.5, 4.1, 3.6],
  demand: [0.6, 1.6, 3.2, 2.9, 2.6, 2.4],
};

const PROMPTS = [
  "What should I do with my surplus tomatoes?",
  "Which buyers pay the best price?",
  "When is the best time to harvest?",
  "What's the weather forecast?",
];

const cls = (...a) => a.filter(Boolean).join(" ");
const riskClass = (r) => `pill pill-${r.toLowerCase()}`;
const fmt = (n) => n.toLocaleString();

/* ---------- shared bits ---------- */
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t} role="tab" aria-selected={active === t} className={cls("tab", active === t && "active")} onClick={() => onChange(t)}>
          {t}
        </button>
      ))}
    </div>
  );
}

function Thumb({ crop, size = 64 }) {
  const c = CROP[crop] || CROP.Rice;
  return <div className={`thumb thumb-${c.tone}`} style={{ width: size, height: size, fontSize: size * 0.5 }}>{c.emoji}</div>;
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat">
      <span className="stat-icon">{icon}</span>
      <div><small>{label}</small><strong>{value}</strong></div>
    </div>
  );
}

function FakeMap({ pins = [], height = 260, risk = false }) {
  return (
    <div className={cls("map", risk && "map-risk")} style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="map-roads" aria-hidden>
        <path d="M0 30 Q30 40 50 55 T100 80" /><path d="M20 0 Q35 40 60 100" /><path d="M0 85 Q40 60 100 20" />
      </svg>
      {risk && <div className="risk-blob" />}
      {pins.map((p, i) => (
        <span key={i} className="pin" style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color }} title={p.label} />
      ))}
    </div>
  );
}

function LineChart({ labels, a, b }) {
  const W = 520, H = 220, P = 32;
  const max = Math.ceil(Math.max(...a, ...b));
  const x = (i) => P + (i * (W - P * 2)) / (labels.length - 1);
  const y = (v) => H - P - (v / max) * (H - P * 2);
  const pts = (arr) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = (arr) => `${P},${H - P} ${pts(arr)} ${x(arr.length - 1)},${H - P}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Expected production vs market demand">
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

/* ---------- views ---------- */
function Overview({ farms, go }) {
  const totals = useMemo(() => ({
    area: farms.reduce((s, f) => s + f.area, 0).toFixed(1),
    kg: farms.reduce((s, f) => s + f.kg, 0),
    high: farms.filter((f) => f.risk === "High").length,
  }), [farms]);
  return (
    <>
      <div className="stat-row">
        <div className="card kpi"><strong>{farms.length}</strong><small>Total farms</small></div>
        <div className="card kpi"><strong>{totals.area} ha</strong><small>Total area</small></div>
        <div className="card kpi"><strong>{(totals.kg / 1000).toFixed(1)} t</strong><small>Expected harvest</small></div>
        <div className="card kpi danger"><strong>{totals.high}</strong><small>High risk</small></div>
      </div>
      <div className="card">
        <h3>Needs attention</h3>
        {RECS.slice(0, 2).map((r) => (
          <div key={r.id} className="row">
            <span className="row-icon">{r.icon}</span>
            <div className="grow"><strong>{r.title}</strong><small>{r.text}</small></div>
            <button className="btn btn-sm" onClick={() => go("recs")}>Open</button>
          </div>
        ))}
      </div>
    </>
  );
}

function AddFarmForm({ onSave, onCancel }) {
  const empty = { name: "", county: "", sub: "", area: "", water: "", irrigation: "" };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name && f.county && f.sub && Number(f.area) > 0;
  return (
    <div className="card add-farm">
      <h3>Add Farm</h3>
      <label>Farm Name *<input value={f.name} onChange={set("name")} placeholder="e.g. Kiambaina Farm" /></label>
      <label>County *
        <select value={f.county} onChange={set("county")}>
          <option value="">Select County</option>
          {["Kirinyaga", "Embu", "Murang'a", "Nyeri", "Machakos"].map((c) => <option key={c}>{c}</option>)}
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

function MyFarms({ farms, onOpen, onAdd }) {
  const totals = {
    area: farms.reduce((s, f) => s + f.area, 0).toFixed(1),
    kg: farms.reduce((s, f) => s + f.kg, 0),
    high: farms.filter((f) => f.risk === "High").length,
  };
  const pins = farms.map((f, i) => ({ x: 25 + i * 22, y: 30 + (i % 2) * 30, color: f.risk === "High" ? "#dc2626" : "#1e7a46", label: f.name }));
  return (
    <div className="split">
      <div>
        <div className="stat-row">
          <div className="card kpi"><strong>{farms.length}</strong><small>Total farms</small></div>
          <div className="card kpi"><strong>{totals.area} ha</strong><small>Total area</small></div>
          <div className="card kpi"><strong>{(totals.kg / 1000).toFixed(1)} t</strong><small>Expected harvest</small></div>
          <div className="card kpi danger"><strong>{totals.high}</strong><small>High risk</small></div>
        </div>
        {farms.map((f) => (
          <div key={f.id} className="card farm-row">
            <Thumb crop={f.crop} size={84} />
            <div className="grow">
              <strong>{f.name}</strong>
              <small>{f.county} • {f.area} ha • {f.crop}</small>
              <small>Expected harvest: {(f.kg / 1000).toFixed(1)} t</small>
              <span className={riskClass(f.risk)}>Risk: {f.risk}</span>
            </div>
            <button className="btn btn-soft" onClick={() => onOpen(f.id)}>View Details ›</button>
          </div>
        ))}
        <button className="btn" onClick={onAdd}>＋ Add Farm</button>
      </div>
      <div>
        <div className="card">
          <FakeMap pins={pins} height={240} risk />
          <div className="legend"><i style={{ background: "#1e7a46" }} />Your Farms <i style={{ background: "#dc2626" }} />Risk Area <i style={{ background: "#7cc79a" }} />Other Farms</div>
        </div>
        <div className="card">
          <h3>Farm Performance</h3>
          {farms.map((f) => (
            <div key={f.id} className="perf">
              <span>{f.name.replace(" Farm", "")}</span>
              <div className="bar"><div style={{ width: `${f.perf}%` }} /></div>
              <b>{f.perf}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FarmDetails({ farm, onBack, onForecast }) {
  const [tab, setTab] = useState("Overview");
  const activity = ["Tomato crop updated • 2 days ago", "Harvest forecast updated • 4 days ago", "Soil moisture reading • 6 days ago", "Farm registered • 2 weeks ago"];
  return (
    <>
      <button className="link" onClick={onBack}>‹ Back to My Farms</button>
      <h2>{farm.name}</h2>
      <small>📍 {farm.county} County</small>
      <Tabs tabs={["Overview", "Crops", "Soil & Water", "History"]} active={tab} onChange={setTab} />
      {tab === "Overview" ? (
        <div className="split">
          <div className="card">
            <div className="farm-hero">
              <Thumb crop={farm.crop} size={150} />
              <div className="mini-grid">
                <div><small>Total Area</small><strong>{farm.area} ha</strong></div>
                <div><small>Farm Type</small><strong>{farm.type}</strong></div>
                <div><small>Water Source</small><strong>{farm.water}</strong></div>
                <div><small>Irrigation</small><strong>{farm.irrigation}</strong></div>
              </div>
            </div>
            <h4>Farm Location</h4>
            <small>{farm.coords}</small>
            <FakeMap pins={[{ x: 50, y: 50, color: "#1e7a46", label: farm.name }]} height={150} />
            <button className="btn" onClick={onForecast}>View Harvest Forecast</button>
          </div>
          <div className="card">
            <h4>Recent Activity</h4>
            {activity.map((a) => <div key={a} className="row"><span className="row-icon">•</span><small className="grow">{a}</small></div>)}
          </div>
        </div>
      ) : (
        <div className="card empty">{tab} details coming soon.</div>
      )}
    </>
  );
}

function Crops({ farms, onOpen }) {
  const [tab, setTab] = useState("My Crops");
  const sorted = [...farms].sort((a, b) => a.harvest.localeCompare(b.harvest));
  return (
    <>
      <Tabs tabs={["My Crops", "Harvest Calendar"]} active={tab} onChange={setTab} />
      {tab === "My Crops" ? (
        <div className="crop-grid">
          {farms.map((f) => (
            <button key={f.id} className="card crop-card" onClick={() => onOpen(f.id)}>
              <Thumb crop={f.crop} size={72} />
              <div><strong>{f.crop}</strong><small>{(f.kg / 1000).toFixed(1)} t</small><span className={riskClass(f.risk)}>{f.risk} Risk</span></div>
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
            <thead><tr><th>Crop</th><th>Farm</th><th>Expected Date</th><th>Quantity</th><th>Risk</th></tr></thead>
            <tbody>
              {sorted.map((f) => (
                <tr key={f.id} onClick={() => onOpen(f.id)} className="clickable">
                  <td>{CROP[f.crop].emoji} {f.crop}</td><td>{f.name.replace(" Farm", "")}</td><td>{f.harvest}</td><td>{fmt(f.kg)} kg</td>
                  <td><span className={riskClass(f.risk)}>{f.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Forecast({ farm, onBack, go }) {
  const [tab, setTab] = useState("Overview");
  const surplus = Math.max(0, Math.round(farm.kg * 0.4));
  const pct = Math.round((surplus / farm.kg) * 100);
  return (
    <>
      <button className="link" onClick={onBack}>‹ Back</button>
      <div className="crop-head"><Thumb crop={farm.crop} size={64} /><h2>{farm.crop} – {farm.name}</h2></div>
      <Tabs tabs={["Overview", "Forecast", "Risk Analysis", "Recommendations"]} active={tab} onChange={setTab} />
      <div className="stat-row">
        <Stat icon="🌸" label="Current Stage" value={farm.stage} />
        <Stat icon="📅" label="Expected Harvest" value={farm.harvest} />
        <Stat icon="⚖️" label="Expected Quantity" value={`${fmt(farm.kg)} kg`} />
        <Stat icon="⏳" label="Harvest Window" value="5 days" />
      </div>
      {tab === "Recommendations" ? (
        <div className="card"><p>{RECS[0].text}</p><button className="btn" onClick={() => go("recs")}>Open AI Recommendations</button></div>
      ) : (
        <div className="split">
          <div className="card">
            <h3>Harvest Forecast</h3>
            <div className="legend"><i style={{ background: "#22a05a" }} />Expected Production <i style={{ background: "#2563eb" }} />Market Demand</div>
            <LineChart labels={FORECAST.labels} a={FORECAST.supply} b={FORECAST.demand} />
          </div>
          <div className="card">
            <h3>Surplus Risk</h3>
            <div className={cls("risk-box", `risk-${farm.risk.toLowerCase()}`)}><strong>{farm.risk}</strong><small>{pct}%</small></div>
            <div className="risk-box neutral"><small>Potential surplus</small><strong>{fmt(surplus)} kg</strong></div>
            <div className="risk-box warn"><small>Spoilage risk</small><strong>Medium</strong></div>
          </div>
        </div>
      )}
    </>
  );
}

function Opportunities() {
  const [filter, setFilter] = useState("All");
  const [matched, setMatched] = useState({});
  const list = OPPS.filter((o) => filter === "All" || o.type + "s" === filter || o.type === filter);
  const pins = list.map((o) => ({ x: o.x, y: o.y, color: OPP_COLOR[o.type], label: o.name }));
  return (
    <>
      <h3>Nearby Opportunities for Tomatoes</h3>
      <Tabs tabs={["All", "Buyers", "Processors", "Storage", "Transport"]} active={filter} onChange={setFilter} />
      <div className="split">
        <div>
          {list.map((o) => (
            <div key={o.id} className="card opp">
              <span className="row-icon" style={{ color: OPP_COLOR[o.type] }}>●</span>
              <div className="grow">
                <strong>{o.name}</strong>
                <small>{o.type} • {o.km} km • {o.cap}</small>
                <small>{o.price} • {o.note}</small>
              </div>
              <button className={cls("btn btn-sm", matched[o.id] && "btn-done")} onClick={() => setMatched({ ...matched, [o.id]: !matched[o.id] })}>
                {matched[o.id] ? "Matched ✓" : "Match"}
              </button>
            </div>
          ))}
          {!list.length && <div className="card empty">Nothing in this category yet.</div>}
        </div>
        <div className="card">
          <FakeMap pins={pins} height={320} />
          <div className="legend">{Object.entries(OPP_COLOR).map(([k, c]) => <span key={k}><i style={{ background: c }} />{k}</span>)}</div>
          <button className="btn">View Route</button>
        </div>
      </div>
    </>
  );
}

function Recommendations() {
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);
  const [sel, setSel] = useState(1);
  const list = RECS.filter((r) => !dismissed.includes(r.id) && (filter === "All" || r.kind === filter));
  const active = RECS.find((r) => r.id === sel) || list[0];
  return (
    <>
      <Tabs tabs={["All", "Harvest", "Market", "Storage", "Transport"]} active={filter} onChange={setFilter} />
      <div className="split">
        <div>
          {list.map((r) => (
            <div key={r.id} className={cls("card rec", `rec-${r.tone}`, active?.id === r.id && "selected")} onClick={() => setSel(r.id)}>
              <span className="row-icon">{r.icon}</span>
              <div className="grow">
                <strong>{r.title}</strong><small>{r.text}</small>
                <div className="btn-row"><button className="btn btn-sm">{r.cta}</button><span className="chip">{r.conf}% confidence</span></div>
              </div>
              <button className="x" aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setDismissed([...dismissed, r.id]); }}>✕</button>
            </div>
          ))}
          {!list.length && <div className="card empty">You're all caught up 🎉</div>}
        </div>
        {active && (
          <div>
            <div className="card">
              <h3>Why this recommendation?</h3>
              {active.why.map(([t, s]) => <div key={s} className={cls("why", t)}>{t === "ok" ? "✔" : "✖"} {s}</div>)}
              <h4>Estimated Impact</h4>
              {active.impact.map((s) => <div key={s} className="why ok">◎ {s}</div>)}
            </div>
            <div className="card row"><strong className="grow">Confidence {active.conf}%</strong><span>🌐</span></div>
          </div>
        )}
      </div>
    </>
  );
}

function Market() {
  const [tab, setTab] = useState("Market Prices");
  const [routes, setRoutes] = useState({});
  return (
    <>
      <Tabs tabs={["Market Prices", "Buyers", "Demand Trends"]} active={tab} onChange={setTab} />
      <div className="card">
        <div className="row"><h3 className="grow">Current Market Prices (Tomatoes)</h3><button className="link">View All</button></div>
        <table>
          <thead><tr><th>Market</th><th>Price</th><th>Demand</th></tr></thead>
          <tbody>
            {PRICES.map(([m, p, d]) => (
              <tr key={m}><td>{m}</td><td>{p}</td><td><span className={cls("pill", d === "High" ? "pill-high-demand" : d === "Medium" ? "pill-medium" : "pill-low")}>{d}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Top Buyers</h3>
      <div className="buyer-grid">
        {BUYERS.map((b) => (
          <div key={b.name} className="card buyer">
            <div className="row"><span className="row-icon">{b.icon}</span><div><strong>{b.name}</strong><small>{b.sub}</small></div></div>
            <small>{b.cap}</small><small>{b.price}</small>
            <button className={cls("btn", routes[b.name] && "btn-done")} onClick={() => setRoutes({ ...routes, [b.name]: true })}>
              {routes[b.name] ? "Route optimized ✓" : "Optimize Route"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Toggle({ label, on, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <i />
    </label>
  );
}

function Profile() {
  const [tab, setTab] = useState("Personal");
  const [form, setForm] = useState({ name: "Samuel Kamau", phone: "+254 712 345 678", email: "samuel.kamau@email.com", password: "" });
  const [s, setS] = useState({ Email: true, SMS: true, Push: true, "AI Recommendations": true, "Weekly Reports": true });
  const [lang, setLang] = useState("English");
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); };
  return (
    <>
      <div className="card profile-head">
        <div className="avatar big">SK</div>
        <div><h2>{form.name}</h2><small>Kirinyaga County</small><span className="pill pill-low">● Verified Farmer</span></div>
      </div>
      <Tabs tabs={["Personal", "Farm Details", "Notifications"]} active={tab} onChange={setTab} />
      {tab === "Personal" ? (
        <div className="split">
          <div className="card form">
            <h3>Personal Information</h3>
            <label>Full Name<input value={form.name} onChange={set("name")} /></label>
            <label>Phone<input type="tel" value={form.phone} onChange={set("phone")} /></label>
            <label>Email<input type="email" value={form.email} onChange={set("email")} /></label>
            <label>Password<input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" /></label>
            <button className="btn" onClick={() => setSaved(true)}>{saved ? "Saved ✓" : "Update Profile"}</button>
          </div>
          <div className="card">
            <h3>Settings</h3>
            {Object.keys(s).map((k) => (
              <Toggle key={k} label={k === "AI Recommendations" || k === "Weekly Reports" ? k : `${k} Notifications`} on={s[k]} onChange={(v) => setS({ ...s, [k]: v })} />
            ))}
            <label>Language
              <select value={lang} onChange={(e) => setLang(e.target.value)}>{["English", "Kiswahili", "Kikuyu"].map((l) => <option key={l}>{l}</option>)}</select>
            </label>
          </div>
        </div>
      ) : (
        <div className="card empty">{tab} settings coming soon.</div>
      )}
    </>
  );
}

function Assistant() {
  const [msgs, setMsgs] = useState([{ from: "ai", text: "I'm here to help you make better decisions, reduce loss and improve your farm." }]);
  const [text, setText] = useState("");
  const send = (q) => {
    const t = (q ?? text).trim();
    if (!t) return;
    const l = t.toLowerCase();
    const reply = l.includes("surplus") ? "Reserve cold storage for 1,800 kg and match with Nairobi Fresh Markets (KES 28/kg). Act within 72 hours."
      : l.includes("buyer") ? "Nairobi Fresh Markets pays best at KES 28/kg, 68 km away."
      : l.includes("harvest") ? "Your tomatoes are ready around Oct 18. Harvest early morning for the best shelf life."
      : l.includes("weather") ? "I'll connect live weather soon. For now, plan around light rain mid-week."
      : "Got it. I'm checking your farms and the market for an answer.";
    setMsgs((m) => [...m, { from: "me", text: t }, { from: "ai", text: reply }]);
    setText("");
  };
  return (
    <aside className="assistant card">
      <div className="row"><span className="row-icon">🌿</span><div><strong>MAVUNO AI</strong><small>Your farming assistant</small></div></div>
      <div className="chat" aria-live="polite">{msgs.map((m, i) => <p key={i} className={`bubble ${m.from}`}>{m.text}</p>)}</div>
      <small className="muted">Suggested prompts</small>
      {PROMPTS.map((p) => <button key={p} className="prompt" onClick={() => send(p)}>{p}</button>)}
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask MAVUNO AI…" />
        <button className="btn btn-sm" aria-label="Send">➤</button>
      </form>
      <small className="muted center">Powered by MAVUNO AI</small>
    </aside>
  );
}

/* ---------- shell ---------- */
export default function FarmerPortal() {
  const [view, setView] = useState("overview");
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [farmId, setFarmId] = useState(1);
  const [adding, setAdding] = useState(false);
  const [county, setCounty] = useState("Kirinyaga");
  const [menu, setMenu] = useState(false);
  const farm = farms.find((f) => f.id === farmId) || farms[0];

  const go = (v) => { setView(v); setAdding(false); setMenu(false); };
  const openFarm = (id) => { setFarmId(id); setView("farm"); };
  const openCrop = (id) => { setFarmId(id); setView("forecast"); };
  const addFarm = (f) => {
    const id = Date.now();
    setFarms([...farms, { id, name: f.name, county: f.county, area: f.area, crop: "Rice", kg: 0, harvest: "—", risk: "Low", perf: 0, type: "Smallholder", water: f.water || "—", irrigation: f.irrigation || "—", stage: "Planning", coords: "—" }]);
    setAdding(false);
  };

  const activeNav = view === "farm" ? "farms" : view === "forecast" ? "crops" : view;
  const title = (NAV.find((n) => n[0] === activeNav) || NAV[0])[1];

  let content;
  switch (view) {
    case "overview": content = <Overview farms={farms} go={go} />; break;
    case "farms":
      content = adding
        ? <div className="split"><MyFarms farms={farms} onOpen={openFarm} onAdd={() => setAdding(true)} /><AddFarmForm onSave={addFarm} onCancel={() => setAdding(false)} /></div>
        : <MyFarms farms={farms} onOpen={openFarm} onAdd={() => setAdding(true)} />;
      break;
    case "farm": content = <FarmDetails farm={farm} onBack={() => go("farms")} onForecast={() => setView("forecast")} />; break;
    case "crops": content = <Crops farms={farms} onOpen={openCrop} />; break;
    case "forecast": content = <Forecast farm={farm} onBack={() => go("crops")} go={go} />; break;
    case "opportunities": content = <Opportunities />; break;
    case "recs": content = <Recommendations />; break;
    case "market": content = <Market />; break;
    case "settings": content = <Profile />; break;
    default: content = <div className="card empty">{title} is coming soon.</div>;
  }

  return (
    <div className="fp">
      <nav className={cls("sidebar", menu && "open")} aria-label="Main">
        <div className="brand"><span>🌿</span><div><strong>MAVUNO</strong><small>Green Grid</small></div></div>
        {NAV.map(([key, label, icon, dot]) => (
          <button key={key} className={cls("nav-item", activeNav === key && "active")} onClick={() => go(key)}>
            <span>{icon}</span>{label}{dot && <i className="dot" />}
          </button>
        ))}
        <div className="user"><div className="avatar">SK</div><div><strong>Samuel Kamau</strong><small>Kirinyaga County</small></div></div>
      </nav>

      <main className="main">
        <header className="topbar">
          <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}>☰</button>
          <h1>{title}</h1>
          <select value={county} onChange={(e) => setCounty(e.target.value)} aria-label="County">
            {["Kirinyaga", "Embu", "Murang'a", "Nyeri"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="icon-btn" aria-label="Notifications">🔔</button>
          <div className="avatar">SK</div>
        </header>
        <section className="content">{content}</section>
      </main>

      <Assistant />
    </div>
  );
}