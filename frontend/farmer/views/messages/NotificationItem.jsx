import { TriangleAlert, Handshake, Truck, Warehouse, TrendingUp, CloudRain, X } from "lucide-react";
import { cls } from "../../../shared/utils";

const ICONS = { risk: TriangleAlert, deal: Handshake, truck: Truck, storage: Warehouse, price: TrendingUp, weather: CloudRain };

export default function NotificationItem({ n, onRead, onOpen, onDismiss }) {
  const Icon = ICONS[n.icon];
  return (
    <li className={cls("nt", n.unread && "unread")}>
      <span className={`nt-ico ${n.tone}`}><Icon size={20} aria-hidden="true" /></span>
      <button className="nt-body" onClick={() => onRead(n.id)}>
        <strong>{n.title}</strong>
        <small>{n.text}</small>
      </button>
      <div className="nt-meta">
        <small>{n.ago}</small>
        {n.unread && <span className="nt-dot" role="img" aria-label="Unread" />}
      </div>
      {n.action && <button className="btn btn-sm" onClick={() => onOpen(n)}>{n.action.label}</button>}
      <button className="x" aria-label={`Dismiss ${n.title}`} onClick={() => onDismiss(n.id)}><X size={16} aria-hidden="true" /></button>
    </li>
  );
}