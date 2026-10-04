import { useState } from "react";
import { toast } from "sonner";
import { BellOff, CheckCheck } from "lucide-react";
import { cls } from "../../shared/utils";
import EmptyState from "../../shared/EmptyState";
import NotificationItem from "./messages/NotificationItem";

const TABS = [["All", null], ["Alerts", "alert"], ["Messages", "message"], ["System", "system"]];

export default function Messages({ items, setItems, go }) {
  const [tab, setTab] = useState("All");
  const kind = TABS.find(([t]) => t === tab)[1];
  const list = items.filter((n) => !kind || n.kind === kind);
  const unreadIn = (k) => items.filter((n) => n.unread && (!k || n.kind === k)).length;

  const markRead = (id) => setItems((xs) => xs.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAll = () => setItems((xs) => xs.map((n) => ({ ...n, unread: false })));
  const open = (n) => { markRead(n.id); go(n.action.to); };
  const dismiss = (id) => {
    const removed = items.find((n) => n.id === id);
    setItems((xs) => xs.filter((n) => n.id !== id));
    toast("Notification dismissed", {
      action: { label: "Undo", onClick: () => setItems((xs) => [...xs, removed].sort((a, b) => a.id - b.id)) },
    });
  };

  return (
    <>
      <div className="nt-bar">
        <div className="tabs" role="tablist">
          {TABS.map(([t, k]) => {
            const c = unreadIn(k);
            return (
              <button key={t} role="tab" aria-selected={tab === t} className={cls("tab", tab === t && "active")} onClick={() => setTab(t)}>
                {t}{c > 0 && <b className="nt-count">{c}</b>}
              </button>
            );
          })}
        </div>
        <button className="btn btn-sm btn-ghost nt-markall" disabled={!unreadIn(null)} onClick={markAll}>
          <CheckCheck size={14} aria-hidden="true" /> Mark all as read
        </button>
      </div>

      {list.length ? (
        <section className="card nt-list">
          <ul>
            {list.map((n) => <NotificationItem key={n.id} n={n} onRead={markRead} onOpen={open} onDismiss={dismiss} />)}
          </ul>
        </section>
      ) : (
        <EmptyState icon={BellOff} title="You're all caught up" text="New alerts and messages will show up here." />
      )}
    </>
  );
}