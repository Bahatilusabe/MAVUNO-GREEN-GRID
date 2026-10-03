import { Leaf } from "lucide-react";
import { fmt } from "../../shared/utils";

export default function RequestsTab({ requests, stats, accepting, onDecide }) {
  return (
    <section className="pp-card">
      {requests.map((r) => {
        const tooBig = r.kg > stats.remaining;
        const blocked = tooBig || !accepting;
        return (
          <div key={r.id} className="pp-line">
            <span className="pp-ico">
              <Leaf aria-hidden="true" size={20} />
            </span>
            <div className="grow">
              <strong>{r.farmer}</strong>
              <small>
                {r.crop} • {fmt(r.kg)} kg • {r.county} • {r.km} km
              </small>
              <small>
                Offer KES {r.price}/kg • Pickup {r.date}
              </small>
              {r.status === "Pending" && tooBig && (
                <small className="warn">
                  Exceeds free capacity ({fmt(stats.remaining)} kg).
                </small>
              )}
            </div>
            {r.status === "Pending" ? (
              <div className="pp-actions">
                <button
                  className="pp-btn sm"
                  disabled={blocked}
                  title={blocked ? "Not enough capacity or paused" : ""}
                  onClick={() => onDecide(r, true)}
                >
                  Accept
                </button>
                <button
                  className="pp-btn sm ghost"
                  onClick={() => onDecide(r, false)}
                >
                  Decline
                </button>
              </div>
            ) : (
              <span className={`pp-pill ${r.status.toLowerCase()}`}>
                {r.status}
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
