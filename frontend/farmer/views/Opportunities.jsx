import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { OPPS, OPP_COLOR } from "../../shared/data";
import { cls } from "../../shared/utils";
import { Tabs, FakeMap } from "../components/ui";

export default function Opportunities() {
  const [filter, setFilter] = useState("All");
  const [matched, setMatched] = useState({});
  const list = OPPS.filter(
    (o) => filter === "All" || o.type + "s" === filter || o.type === filter,
  );
  const pins = list.map((o) => ({
    x: o.x,
    y: o.y,
    color: OPP_COLOR[o.type],
    label: o.name,
  }));

  return (
    <>
      <h3>Nearby Opportunities for Tomatoes</h3>
      <Tabs
        tabs={["All", "Buyers", "Processors", "Storage", "Transport"]}
        active={filter}
        onChange={setFilter}
      />
      <div className="split">
        <div>
          {list.map((o) => (
            <div key={o.id} className="card opp">
              <span className="row-icon" style={{ color: OPP_COLOR[o.type] }}>
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
