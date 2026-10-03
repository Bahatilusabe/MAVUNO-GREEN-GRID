import { useMemo, useState } from "react";
import "./PartnerPortal.css";

const REQUESTS_INIT = [
  { id: 1, farmer: "Samuel Kamau", crop: "Tomatoes", kg: 900, county: "Kirinyaga", km: 12, price: 20, date: "Oct 18, 2026", status: "Pending" },
  { id: 2, farmer: "David Kiprop", crop: "Tomatoes", kg: 700, county: "Nyeri", km: 45, price: 20, date: "Oct 20, 2026", status: "Pending" },
  { id: 3, farmer: "Lucy Achieng", crop: "Tomatoes", kg: 1500, county: "Embu", km: 38, price: 20, date: "Oct 22, 2026", status: "Pending" },
  { id: 4, farmer: "Faith Muthoni", crop: "Tomatoes", kg: 300, county: "Machakos", km: 60, price: 20, date: "Oct 25, 2026", status: "Pending" },
];

const ORDERS_INIT = [
  { id: 100, farmer: "Mary Njeri", crop: "Tomatoes", kg: 800, price: 19, date: "Oct 01, 2026", status: "Delivered" },
  { id: 101, farmer: "Samuel Kamau", crop: "Tomatoes", kg: 600, price: 20, date: "Oct 12, 2026", status: "In transit" },
  { id: 102, farmer: "Grace Wanjiru", crop: "Tomatoes", kg: 400, price: 20, date: "Oct 14, 2026", status: "Scheduled" },
];

const STEPS = ["Scheduled", "In transit", "Delivered"];
const NEXT_LABEL = { Scheduled: "Mark in transit", "In transit": "Mark delivered" };
const cls = (...a) => a.filter(Boolean).join(" ");
const fmt = (n) => n.toLocaleString();

export default function PartnerPortal({ partnerName = "Kagio Juice Processors", partnerType = "Processor" }) {
  const [tab, setTab] = useState("Requests");
  const [requests, setRequests] = useState(REQUESTS_INIT);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [listing, setListing] = useState({ price: 20, capacity: 2000, accepting: true });
  const [draft, setDraft] = useState({ price: "20", capacity: "2000" });
  const [saved, setSaved] = useState(false);

  const stats = useMemo(() => {
    const load = orders.filter((o) => o.status !== "Delivered").reduce((s, o) => s + o.kg, 0);
    const delivered = orders.filter((o) => o.status === "Delivered");
    return {
      load,
      remaining: Math.max(0, listing.capacity - load),
      util: Math.min(100, Math.round((load / listing.capacity) * 100)),
      revenue: delivered.reduce((s, o) => s + o.kg * o.price, 0),
      deliveredKg: delivered.reduce((s, o) => s + o.kg, 0),
      pending: requests.filter((r) => r.status === "Pending").length,
    };
  }, [orders, requests, listing.capacity]);

  const decide = (r, accept) => {
    setRequests((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: accept ? "Accepted" : "Declined" } : x)));
    if (accept) setOrders((os) => [...os, { id: Date.now(), farmer: r.farmer, crop: r.crop, kg: r.kg, price: r.price, date: r.date, status: "Scheduled" }]);
  };

  const advance = (id) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: STEPS[STEPS.indexOf(o.status) + 1] || o.status } : o)));

  const price = Number(draft.price), cap = Number(draft.capacity);
  const draftError = !(price > 0) ? "Enter a price above 0." : !(cap > 0) ? "Enter a capacity above 0." : cap < stats.load ? `Capacity can't go below current load (${fmt(stats.load)} kg).` : "";
  const edit = (k) => (e) => { setDraft({ ...draft, [k]: e.target.value }); setSaved(false); };
  const save = () => { setListing({ ...listing, price, capacity: cap }); setSaved(true); };

  const kpis = [
    ["📥", "New requests", stats.pending, "awaiting your decision"],
    ["📦", "Capacity used", `${stats.util}%`, `${fmt(stats.remaining)} kg free`],
    ["⚖️", "Delivered volume", `${fmt(stats.deliveredKg)} kg`, "completed orders"],
    ["💰", "Revenue", `KES ${fmt(stats.revenue)}`, "from delivered orders"],
  ];

  return (
    <div className="pp">
      <header className="pp-head">
        <div>
          <h1>{partnerName}</h1>
          <small>{partnerType} partner • MAVUNO Green Grid</small>
        </div>
        <label className="pp-switch">
          <span>{listing.accepting ? "Accepting requests" : "Paused"}</span>
          <input type="checkbox" role="switch" checked={listing.accepting} onChange={(e) => setListing({ ...listing, accepting: e.target.checked })} />
          <i />
        </label>
      </header>

      {!listing.accepting && <div className="pp-banner" role="status">Paused. Farmers can't send you new match requests.</div>}

      <div className="pp-kpis">
        {kpis.map(([icon, label, value, sub]) => (
          <div key={label} className="pp-card pp-kpi">
            <span className="pp-ico">{icon}</span>
            <div><small>{label}</small><strong>{value}</strong><small>{sub}</small></div>
          </div>
        ))}
      </div>

      <div className="pp-card">
        <div className="pp-row"><strong className="grow">Capacity today</strong><small>{fmt(stats.load)} / {fmt(listing.capacity)} kg</small></div>
        <div className="pp-bar"><div className={stats.util >= 85 ? "hi" : stats.util >= 60 ? "md" : "lo"} style={{ width: `${stats.util}%` }} /></div>
      </div>

      <div className="pp-tabs" role="tablist">
        {["Requests", "Orders", "Listing"].map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={cls("pp-tab", tab === t && "on")} onClick={() => setTab(t)}>
            {t}{t === "Requests" && stats.pending > 0 ? ` (${stats.pending})` : ""}
          </button>
        ))}
      </div>

      {tab === "Requests" && (
        <section className="pp-card">
          {requests.map((r) => {
            const tooBig = r.kg > stats.remaining;
            const blocked = tooBig || !listing.accepting;
            return (
              <div key={r.id} className="pp-line">
                <span className="pp-ico">🍅</span>
                <div className="grow">
                  <strong>{r.farmer}</strong>
                  <small>{r.crop} • {fmt(r.kg)} kg • {r.county} • {r.km} km</small>
                  <small>Offer KES {r.price}/kg • Pickup {r.date}</small>
                  {r.status === "Pending" && tooBig && <small className="warn">Exceeds free capacity ({fmt(stats.remaining)} kg).</small>}
                </div>
                {r.status === "Pending" ? (
                  <div className="pp-actions">
                    <button className="pp-btn sm" disabled={blocked} title={blocked ? "Not enough capacity or paused" : ""} onClick={() => decide(r, true)}>Accept</button>
                    <button className="pp-btn sm ghost" onClick={() => decide(r, false)}>Decline</button>
                  </div>
                ) : (
                  <span className={`pp-pill ${r.status.toLowerCase()}`}>{r.status}</span>
                )}
              </div>
            );
          })}
        </section>
      )}

      {tab === "Orders" && (
        <section className="pp-card">
          <div className="pp-table-wrap">
            <table>
              <thead><tr><th>Farmer</th><th>Crop</th><th>Quantity</th><th>Value</th><th>Pickup</th><th>Status</th><th /></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.farmer}</strong></td><td>{o.crop}</td><td>{fmt(o.kg)} kg</td><td>KES {fmt(o.kg * o.price)}</td><td>{o.date}</td>
                    <td><span className={`pp-pill ${o.status.replace(" ", "-").toLowerCase()}`}>{o.status}</span></td>
                    <td>{NEXT_LABEL[o.status] && <button className="pp-btn sm" onClick={() => advance(o.id)}>{NEXT_LABEL[o.status]}</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "Listing" && (
        <section className="pp-card pp-form">
          <h3>Your listing</h3>
          <label>Price offered (KES/kg)<input type="number" min="1" value={draft.price} onChange={edit("price")} /></label>
          <label>Daily capacity (kg)<input type="number" min="1" value={draft.capacity} onChange={edit("capacity")} /></label>
          {draftError && <small className="warn" role="alert">{draftError}</small>}
          <button className="pp-btn" disabled={!!draftError} onClick={save}>{saved ? "Saved ✓" : "Save listing"}</button>
          <small>Listing changes are local until you connect an API.</small>
        </section>
      )}
    </div>
  );
}