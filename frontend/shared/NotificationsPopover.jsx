import { BellOff, X } from "lucide-react";
import { cn } from "../src/lib/utils";

/**
 * The one notification feed.
 *
 * The partner portal, the admin console and the farmer dashboard each had
 * their own copy of this popover, wired to the same `/notifications` feed.
 * They now share it, so the bell behaves identically in every portal:
 * click an item to mark it read, "mark all read" clears the badge, and the
 * dismissed item leaves the list.
 */
export default function NotificationsPopover({ notifications, onClose, className }) {
  const { items, unread, markRead, markAllRead, dismiss } = notifications;

  return (
    <div
      className={cn(
        "fixed right-4 top-16 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-pop",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <strong className="text-sm font-bold text-foreground">Notifications</strong>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-[11px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
              onClick={markAllRead}
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close notifications"
            onClick={onClose}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <ul className="max-h-80 divide-y divide-border overflow-y-auto scrollbar-thin">
        {items.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-4 py-8 text-center text-xs font-medium text-muted-foreground">
            <BellOff size={18} aria-hidden="true" />
            Nothing new right now.
          </li>
        )}

        {items.map((n) => (
          <li
            key={n.id}
            className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
          >
            <span
              className="mt-1.5 h-2 w-2 flex-none rounded-full"
              style={{ background: n.unread ? "var(--g500)" : "var(--border)" }}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => n.unread && markRead(n.id)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="text-xs font-bold text-foreground">{n.title}</p>
              {n.body && (
                <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-muted-foreground">
                  {n.body}
                </p>
              )}
            </button>

            <button
              type="button"
              className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity duration-150 hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
              aria-label={`Dismiss ${n.title}`}
              onClick={() => dismiss(n.id)}
            >
              <X size={13} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
