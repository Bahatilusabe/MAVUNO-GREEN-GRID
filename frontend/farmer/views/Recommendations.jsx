import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Globe,
  PartyPopper,
  Sprout,
  Store,
  Warehouse,
  X,
} from "lucide-react";
import { fetchSurplusAlerts, RECS } from "../../shared/data";
import { cls } from "../../shared/utils";
import { Tabs } from "../components/ui";

const RECOMMENDATION_ICONS = {
  Harvest: Sprout,
  Market: Store,
  Storage: Warehouse,
};

export default function Recommendations() {
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);
  const [sel, setSel] = useState(1);
  const [backendRecs, setBackendRecs] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSurplusAlerts().then((response) => {
      if (!active || response?.status !== "success") return;
      setBackendRecs(Array.isArray(response.data) ? response.data : []);
    });
    return () => {
      active = false;
    };
  }, []);

  const recommendations = backendRecs === null
    ? RECS
    : backendRecs.map((rec) => ({
      id: `backend-week-${rec.week}`,
      kind: "Harvest",
      tone: Number(rec.risk) >= 0.6 ? "danger" : "info",
      title: `Week ${rec.week} · ${Number(rec.surplus_t).toFixed(0)} t surplus`,
      text: rec.ai_explanation || rec.ai_reasoning || "Surplus alert from the MAVUNO backend.",
      cta: "Review alert",
      risk: Number(rec.risk),
      why: [
        ["ok", `Backend risk score: ${Number(rec.risk).toFixed(2)} / 1`],
        ["ok", `${Number(rec.surplus_t).toFixed(1)} t projected surplus`],
      ],
      impact: [
        `Saved: ${Number(rec.tonnes_saved ?? 0).toFixed(1)} t`,
        `Unplaced: ${Number(rec.tonnes_wasted ?? 0).toFixed(1)} t`,
        `Revenue: KES ${Number(rec.revenue_kes ?? 0).toLocaleString("en-KE")}`,
        `CO2e avoided: ${Number(rec.co2e_avoided_t ?? 0).toFixed(1)} t`,
      ],
    }));

  const list = recommendations.filter(
    (r) => !dismissed.includes(r.id) && (filter === "All" || r.kind === filter),
  );
  const active = list.find((r) => r.id === sel) || list[0];

  return (
    <>
      <Tabs
        tabs={["All", "Harvest", "Market", "Storage", "Transport"]}
        active={filter}
        onChange={setFilter}
      />
      <div className="split">
        <div>
          {list.map((r) => (
            <div
              key={r.id}
              className={cls(
                "card rec",
                `rec-${r.tone}`,
                active?.id === r.id && "selected",
              )}
              onClick={() => setSel(r.id)}
            >
              <span className="row-icon">
                {(() => {
                  const Icon = RECOMMENDATION_ICONS[r.kind] || Sprout;
                  return <Icon aria-hidden="true" size={18} />;
                })()}
              </span>
              <div className="grow">
                <strong>{r.title}</strong>
                <small>{r.text}</small>
                <div className="btn-row">
                  <button className="btn btn-sm">{r.cta}</button>
                  {r.conf != null && <span className="chip">{r.conf}% confidence</span>}
                  {r.risk != null && <span className="chip">Risk {r.risk.toFixed(2)}</span>}
                </div>
              </div>
              <button
                className="x"
                aria-label="Dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissed([...dismissed, r.id]);
                }}
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>
          ))}
          {!list.length && (
            <div className="card empty">
              <PartyPopper aria-hidden="true" size={18} /> You're all caught up
            </div>
          )}
        </div>
        {active && (
          <div>
            <div className="card">
              <h3>Why this recommendation?</h3>
              {active.why.map(([t, s]) => (
                <div key={s} className={cls("why", t)}>
                  {t === "ok" ? (
                    <CircleCheck aria-hidden="true" size={16} />
                  ) : (
                    <CircleX aria-hidden="true" size={16} />
                  )}{" "}
                  {s}
                </div>
              ))}
              <h4>Estimated Impact</h4>
              {active.impact.map((s) => (
                <div key={s} className="why ok">
                  <BadgeCheck aria-hidden="true" size={16} /> {s}
                </div>
              ))}
            </div>
            <div className="card row">
              <strong className="grow">
                {active.risk != null ? `Risk score ${active.risk.toFixed(2)} / 1` : `Confidence ${active.conf}%`}
              </strong>
              <Globe aria-hidden="true" size={18} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
