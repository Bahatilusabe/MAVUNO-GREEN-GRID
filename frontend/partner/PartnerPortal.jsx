import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Bell, Building2, Inbox, Package, Tag } from "lucide-react";
import Shell from "../shared/Shell";
import { navigate } from "../shared/nav";
import NotificationsPopover from "../shared/NotificationsPopover";
import { WEEKLY } from "./data";
import { usePartnerPortal } from "../src/hooks/usePartnerPortal";
import { useNotifications } from "../src/hooks/useNotifications";
import Badge from "../shared/ui/Badge";
import Tabs from "../shared/ui/Tabs";
import KpiGrid from "./components/KpiGrid";
import CapacityBar from "./components/CapacityBar";
import VolumeCard from "./components/VolumeCard";
import RequestsTab from "./components/RequestsTab";
import OrdersTab from "./components/OrdersTab";
import ListingTab from "./components/ListingTab";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "2026-10-01" and "Oct 01, 2026" both have to land on the right weekday. */
function weekdayOf(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return (date.getDay() + 6) % 7; // Monday = 0
}

/** Throughput per weekday, derived from the orders the partner actually holds. */
function weeklyFrom(orders) {
  const buckets = new Map(DAYS.map((d, i) => [i, { day: d, kg: 0 }]));

  for (const o of orders) {
    const index = weekdayOf(o.date);
    if (index == null) continue;
    buckets.get(index).kg += Number(o.kg || 0);
  }

  const series = DAYS.map((_, i) => buckets.get(i));
  return series.some((b) => b.kg > 0) ? series : null;
}

export default function PartnerPortal({ path = "/partner" }) {
  const {
    partner,
    requests,
    orders,
    listing,
    stats,
    loading,
    live,
    error,
    decide,
    advance,
    saveListing,
  } = usePartnerPortal();

  const notifications = useNotifications();
  const [tab, setTab] = useState("requests");
  const [busyId, setBusyId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const name = partner?.name || "MAVUNO partner";
  const type = partner?.type || "Partner";

  const user = {
    name,
    sub: partner?.county ? `${type} · ${partner.county}` : `${type} partner`,
    initials: name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };

  const nav = [
    ["requests", "Requests", Inbox, stats.pending],
    ["orders", "Orders", Package],
    ["listing", "Listing", Tag],
  ];

  const weekly = useMemo(() => weeklyFrom(orders), [orders]);
  const crumbs = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Partner portal" },
  ];

  const handleDecide = async (request, accept) => {
    setBusyId(request.id);
    try {
      await decide(request, accept);
      toast[accept ? "success" : "info"](
        accept
          ? `Accepted ${request.farmer}'s request`
          : `Declined ${request.farmer}'s request`
      );
    } catch (e) {
      toast.error(e.message || "Could not record that decision");
    } finally {
      setBusyId(null);
    }
  };

  const handleAdvance = async (order, nextStatus) => {
    setBusyId(order.id);
    try {
      await advance(order, nextStatus);
      toast.success(`Order marked ${nextStatus}`);
    } catch (e) {
      toast.error(e.message || "Could not update the order");
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveListing = async (price, capacity) => {
    setSaving(true);
    try {
      await saveListing({ price, capacity, accepting: listing.accepting });
    } finally {
      setSaving(false);
    }
  };

  const toggleAccepting = async (accepting) => {
    try {
      await saveListing({ price: listing.price, capacity: listing.capacity, accepting });
      toast.success(accepting ? "You are accepting requests" : "Requests paused");
    } catch (e) {
      toast.error(e.message || "Could not update the listing");
    }
  };

  return (
    <Shell
      nav={nav}
      active={tab}
      onNavigate={setTab}
      title="Partner Portal"
      subtitle="Requests, orders and capacity"
      user={user}
      path={path}
      breadcrumbs={crumbs}
      alerts={notifications.unread}
      onBell={() => setBellOpen((v) => !v)}
    >
      {/* Notification feed */}
      {bellOpen && (
        <NotificationsPopover
          notifications={notifications}
          onClose={() => setBellOpen(false)}
        />
      )}

      <div className="space-y-6">
        {/* Partner identity + accepting switch */}
        <section className="surface flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <span
              className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-brand-50 text-brand-700"
              aria-hidden="true"
            >
              <Building2 size={24} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold tracking-tight text-foreground">{name}</h2>
              <p className="text-xs font-medium text-muted-foreground">
                {type} partner · MAVUNO Green Grid
                {partner?.county ? ` · ${partner.county}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-border bg-muted/50 px-4 py-2.5 sm:self-auto">
            <span className="text-xs font-bold text-foreground">
              {listing.accepting ? "Accepting requests" : "Paused"}
            </span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                role="switch"
                aria-label="Accepting new requests"
                checked={listing.accepting}
                onChange={(e) => toggleAccepting(e.target.checked)}
                className="peer sr-only"
              />
              <span className="block h-6 w-11 rounded-full bg-border transition-colors duration-200 peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60" />
              <span className="pointer-events-none absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
            </label>
          </div>
        </section>

        {/* Status banners */}
        {!listing.accepting && (
          <div
            className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 sm:text-sm"
            role="status"
          >
            <AlertTriangle size={18} className="flex-none text-amber-600" aria-hidden="true" />
            <span>Paused. Farmers can&apos;t send you new match requests.</span>
          </div>
        )}

        {error && (
          <div
            className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-3 text-xs font-semibold text-muted-foreground"
            role="status"
          >
            <Badge tone={live ? "neutral" : "warning"}>{live ? "Live" : "Sample data"}</Badge>
            <span>{error}</span>
          </div>
        )}

        <KpiGrid stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CapacityBar stats={stats} capacity={listing.capacity} />
          <VolumeCard data={weekly ?? WEEKLY} live={Boolean(weekly)} />
        </div>

        <div className="space-y-4">
          <Tabs
            tabs={[
              { key: "requests", label: "Requests", badge: stats.pending },
              { key: "orders", label: "Orders", badge: orders.length },
              { key: "listing", label: "Listing" },
            ]}
            value={tab}
            onChange={setTab}
            ariaLabel="Partner sections"
          />

          {tab === "requests" && (
            <RequestsTab
              requests={requests}
              stats={stats}
              accepting={listing.accepting}
              onDecide={handleDecide}
              busyId={busyId}
            />
          )}
          {tab === "orders" && <OrdersTab orders={orders} onAdvance={handleAdvance} busyId={busyId} />}
          {tab === "listing" && (
            <ListingTab
              listing={listing}
              load={stats.load}
              onSave={handleSaveListing}
              saving={saving}
            />
          )}
        </div>

        {loading && (
          <p className="flex items-center justify-center gap-2 pb-4 text-xs font-medium text-muted-foreground">
            <Bell size={13} aria-hidden="true" /> Syncing with the platform…
          </p>
        )}
      </div>
    </Shell>
  );
}
