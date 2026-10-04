import { useState } from "react";
import { Bell, CircleHelp, Menu, Shuffle, Sprout } from "lucide-react";
import { cls } from "./utils";

// nav items: [key, label, icon, badge?]  (badge: true = dot, number = count pill)
export default function Shell({ nav, active, onNavigate, title, subtitle, user, alerts = 0, actions, aside, children }) {
  const [open, setOpen] = useState(false);
  const pick = (key) => { setOpen(false); onNavigate(key); };

  return (
    <div className={cls("sh", aside && "has-aside")}>
      <nav className={cls("sh-side", open && "open")} aria-label="Main">
        <div className="sh-brand"><Sprout aria-hidden="true" size={26} /><div><strong>MAVUNO</strong><small>Green Grid</small></div></div>
        {nav.map(([key, label, Icon, badge]) => (
          <button key={key} className={cls("sh-item", active === key && "active")} aria-current={active === key ? "page" : undefined} onClick={() => pick(key)}>
            <Icon aria-hidden="true" size={18} />{label}
            {badge === true && <i className="sh-dot" />}
            {typeof badge === "number" && badge > 0 && <b className="sh-count">{badge}</b>}
          </button>
        ))}
        <a className="sh-item sh-switch" href="#/"><Shuffle aria-hidden="true" size={18} /> Switch view</a>
        <div className="sh-user">
          <div className="sh-avatar">{user.initials}</div>
          <div><strong>{user.name}</strong><small>{user.sub}</small></div>
        </div>
      </nav>

      <main className="sh-main">
        <header className="sh-top">
          <button className="sh-burger" aria-label="Menu" onClick={() => setOpen(!open)}><Menu aria-hidden="true" size={18} /></button>
          <div className="sh-title">
            <h1>{title}</h1>
            {subtitle && <small>{subtitle}</small>}
          </div>
          {actions}
          <button className="sh-icon" aria-label="Notifications"><Bell aria-hidden="true" size={17} />{alerts > 0 && <span className="sh-badge">{alerts}</span>}</button>
          <button className="sh-icon" aria-label="Help"><CircleHelp aria-hidden="true" size={17} /></button>
          <div className="sh-avatar">{user.initials}</div>
        </header>
        <section className="sh-content">{children}</section>
      </main>

      {aside}
    </div>
  );
}