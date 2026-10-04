import { Link2 } from "lucide-react";
import { cls } from "../../../shared/utils";
import { ACTIVITY } from "./data";

export default function GridActivity() {
  return (
    <section className="card">
      <h3 className="ov-title"><Link2 aria-hidden="true" size={18} /> Green Grid Activity</h3>
      {ACTIVITY.map((a) => (
        <div key={a.title} className="ov-tl-item">
          <span className={cls("ov-tl-ico", a.danger && "danger")}><a.icon aria-hidden="true" size={16} /></span>
          <div className="grow"><strong>{a.title}</strong><small>{a.sub}</small></div>
          <span className="ov-ago">{a.ago}</span>
        </div>
      ))}
      <small>Sample data. Connect to live events.</small>
    </section>
  );
}