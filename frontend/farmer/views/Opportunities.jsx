import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { fetchOpportunities, OPPS, OPP_COLOR } from "../../shared/data";
import { cls } from "../../shared/utils";
import { Tabs, FakeMap } from "../components/ui";

const TYPE_LABELS = {
  buyer: "Buyers",
  processor: "Processors",
  cold_store: "Storage",
  recovery: "Recovery",
};

const colorForType = (type) => OPP_COLOR[
  { Buyers: "Buyer", Processors: "Processor" }[type] || type
] || "#278451";

export default function Opportunities() {
  const [filter, setFilter] = useState("All");
  const [matched, setMatched] = useState({});
  const [backendOpportunities, setBackendOpportunities] = useState(null);

  useEffect(() => {
    let active = true;
    fetchOpportunities().then((data) => {
      if (active) setBackendOpportunities(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const opportunities = backendOpportunities === null
    ? OPPS
    : backendOpportunities.map((item, index) => ({
      id: `backend-${item.name}`,
      name: item.name,
      type: TYPE_LABELS[item.type] || item.type,
      km: Number(item.distance_km),
      cap: `${Number(item.capacity_t).toLocaleString("en-KE")} t/week`,
      price: `KES ${Number(item.price_kes_kg).toLocaleString("en-KE")}/kg`,
      note: `${item.lead_days} day lead time`,
      x: 12 + (index % 4) * 24,
      y: 18 + Math.floor(index / 4) * 28,
    }));
  const list = opportunities.filter(
    (opportunity) => filter === "All" || opportunity.type === filter,
  );
  const pins = list.map((o) => ({
    x: o.x,
    y: o.y,
    color: colorForType(o.type),
    label: o.name,
  }));

  return (
    <>
      <h3>Nearby Opportunities for Tomatoes</h3>
      <Tabs
        tabs={["All", "Buyers", "Processors", "Storage", "Recovery", "Transport"]}
        active={filter}
        onChange={setFilter}
      />
      <div className="split">
        <div>
          {list.map((o) => (
            <div key={o.id} className="card opp">
              <span className="row-icon" style={{ color: colorForType(o.type) }}>
                ●
              </span>
              <div className="grow">
                <strong>{o.name}</strong>
                <small>
                  {o.type} • {o.km} km • {o.cap}
                </small>
                <small>
                  {o.price} • {o.note}
                </small>
              </div>
              <button
                className={cls("btn btn-sm", matched[o.id] && "btn-done")}
                onClick={() => {
                  const was = matched[o.id];
                  setMatched((current) => ({ ...current, [o.id]: !was }));
                  toast[was ? "info" : "success"](
                    was
                      ? `Match with ${o.name} removed`
                      : `Match request sent to ${o.name}`,
                  );
                }}
              >
                {matched[o.id] ? (
                  <>
                    Matched <Check aria-hidden="true" size={16} />
                  </>
                ) : (
                  "Match"
                )}
              </button>
            </div>
          ))}
          {!list.length && (
            <div className="card empty">Nothing in this category yet.</div>
          )}
        </div>
        <div className="card">
          <FakeMap pins={pins} height={320} />
          <div className="legend">
            {Object.entries(OPP_COLOR).map(([k, c]) => (
              <span key={k}>
                <i style={{ background: c }} />
                {k}
              </span>
            ))}
          </div>
          <button className="btn">View Route</button>
        </div>
      </div>
    </>
  );
}
