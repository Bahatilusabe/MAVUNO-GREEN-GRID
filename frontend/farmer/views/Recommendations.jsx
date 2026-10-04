import { useState } from "react";
import { toast } from "sonner";
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
import { RECS } from "../../shared/data";
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
  const list = RECS.filter(
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
                  <span className="chip">{r.conf}% confidence</span>
                </div>
              </div>
              <button
                className="x"
                aria-label="Dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissed((current) => [...current, r.id]);
                  toast("Recommendation dismissed", {
                    action: {
                      label: "Undo",
                      onClick: () =>
                        setDismissed((current) =>
                          current.filter((id) => id !== r.id),
                        ),
                    },
                  });
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
              <strong className="grow">Confidence {active.conf}%</strong>
              <Globe aria-hidden="true" size={18} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
