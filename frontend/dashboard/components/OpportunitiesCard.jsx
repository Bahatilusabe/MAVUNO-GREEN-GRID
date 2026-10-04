import { useState } from "react";
import { Check, Link } from "lucide-react";
import { OPPS } from "../../shared/data";
import { cls } from "../../shared/utils";

export default function OpportunitiesCard({ onNavigate }) {
  const [matched, setMatched] = useState({});
  return (
    <section className="db-card">
      <div className="db-row">
        <h3 className="grow db-heading">
          <Link aria-hidden="true" size={18} /> Nearby Opportunities
        </h3>
        <button className="db-link" onClick={() => onNavigate("opportunities")}>
          View all
        </button>
      </div>
      {OPPS.slice(0, 3).map((o) => (
        <div key={o.name} className="db-row opp">
          <div className="grow">
            <strong>{o.name}</strong>
            <small>
              {o.type} • {o.km} km • {o.price} • {o.note}
            </small>
          </div>
          <button
            className={cls("db-btn sm", matched[o.name] && "done")}
            onClick={() =>
              setMatched({ ...matched, [o.name]: !matched[o.name] })
            }
          >
            {matched[o.name] ? (
              <>
                Matched <Check aria-hidden="true" size={14} />
              </>
            ) : (
              "Match"
            )}
          </button>
        </div>
      ))}
    </section>
  );
}
