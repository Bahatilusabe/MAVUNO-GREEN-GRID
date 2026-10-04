import {
  CircleAlert,
  PartyPopper,
  Sparkles,
  Sprout,
  Store,
  Warehouse,
  X,
} from "lucide-react";
import { cls } from "../../shared/utils";

const RECOMMENDATION_ICONS = {
  Harvest: Sprout,
  Market: Store,
  Storage: Warehouse,
};

export default function RecsCard({ recs, onDismiss, onNavigate }) {
  return (
    <section className="db-card">
      <div className="db-row">
        <h3 className="grow db-heading">
          <Sparkles aria-hidden="true" size={18} /> AI Recommendations
        </h3>
        <button className="db-link" onClick={() => onNavigate("recs")}>
          View all
        </button>
      </div>
      {recs.map((r) => {
        const Icon = RECOMMENDATION_ICONS[r.kind] || CircleAlert;
        return (
          <div key={r.id} className={cls("db-rec", r.tone)}>
            <span className="db-ico">
              <Icon aria-hidden="true" size={18} />
            </span>
            <div className="grow">
              <strong>{r.title}</strong>
              <small>{r.text}</small>
              <span className="db-chip">{r.conf}% confidence</span>
            </div>
            <button
              className="db-x"
              aria-label={`Dismiss ${r.title}`}
              onClick={() => onDismiss(r.id)}
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        );
      })}
      {!recs.length && (
        <p className="db-empty">
          <PartyPopper aria-hidden="true" size={18} /> You're all caught up
        </p>
      )}
    </section>
  );
}
