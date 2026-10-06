import { useState } from "react";
import { toast } from "sonner";
import { BellOff, CheckCheck, Bell } from "lucide-react";
import EmptyState from "../../shared/EmptyState";
import NotificationItem from "./messages/NotificationItem";

const TABS = [["All", null], ["Alerts", "alert"], ["Messages", "message"], ["System", "system"]];

export default function Messages({ items, setItems, go }) {
  const [tab, setTab] = useState("All");
  const kind = TABS.find(([t]) => t === tab)?.[1];
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

  const hasUnread = unreadIn(null) > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter Bar & Mark All Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2" role="tablist">
          {TABS.map(([t, k]) => {
            const count = unreadIn(k);
            const isActive = tab === t;

            return (
              <button
                key={t}
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{t}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isActive ? "bg-white text-green-800" : "bg-green-600 text-white"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mark All as Read Button */}
        <button
          disabled={!hasUnread}
          onClick={markAll}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 w-fit ${
            hasUnread
              ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer shadow-xs"
              : "bg-gray-50 text-gray-300 cursor-not-allowed"
          }`}
        >
          <CheckCheck size={14} aria-hidden="true" /> Mark all as read
        </button>
      </div>

      {/* Notification List Section */}
      {list.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
              <Bell className="text-green-600" size={20} /> Notifications & Alerts
            </h3>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
              {list.length} Items
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-3">
            {list.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onRead={markRead}
                onOpen={open}
                onDismiss={dismiss}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
          <EmptyState
            icon={BellOff}
            title="You're all caught up"
            text="New alerts and messages will show up here."
          />
        </div>
      )}
    </div>
  );
}