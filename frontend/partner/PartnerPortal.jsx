<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Package, Tag, Building2, AlertTriangle } from "lucide-react";
=======
import { useMemo, useState } from "react";
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
import { toast } from "sonner";
import { AlertTriangle, Bell, Building2, Inbox, Package, Tag } from "lucide-react";
import Shell from "../shared/Shell";
<<<<<<< HEAD
import { api, getToken } from "../src/lib/api";
import { useDeals } from "../src/hooks/useDeals";
import usePartnerStats from "./usePartnerStats";
=======
import { navigate } from "../shared/nav";
import NotificationsPopover from "../shared/NotificationsPopover";
import { WEEKLY } from "./data";
import { usePartnerPortal } from "../src/hooks/usePartnerPortal";
import { useNotifications } from "../src/hooks/useNotifications";
import Badge from "../shared/ui/Badge";
import Tabs from "../shared/ui/Tabs";
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
import KpiGrid from "./components/KpiGrid";
import CapacityBar from "./components/CapacityBar";
import VolumeCard from "./components/VolumeCard";
import RequestsTab from "./components/RequestsTab";
import OrdersTab from "./components/OrdersTab";
import ListingTab from "./components/ListingTab";

<<<<<<< HEAD
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Must match STEPS in partner/data.js
const ORDER_LABEL = { scheduled: "Scheduled", in_transit: "In transit", delivered: "Delivered" };

const DEFAULT_LISTING = { price: 20, capacity: 2000, accepting: true };

const fromServer = (p) => ({
  price: Number(p.pricePerKg ?? DEFAULT_LISTING.price),
  capacity: Number(p.capacityKg ?? DEFAULT_LISTING.capacity),
  accepting: p.accepting,
});

export default function PartnerPortal({ partnerName = "Kagio Juice Processors", partnerType = "Processor" }) {
  const [tab, setTab] = useState("Requests");
  const [profile, setProfile] = useState(null);
  const [listing, setListing] = useState(DEFAULT_LISTING);
  const { deals, refresh } = useDeals();

  useEffect(() => {
    if (!getToken()) return;
    api
      .get("/partners/me")
      .then(({ partner }) => {
        setProfile(partner);
        setListing(fromServer(partner));
      })
      .catch(() => {
        /* keep the defaults */
      });
  }, []);

  // usePartnerStats and the tabs expect capitalised statuses, so adapt the server rows here
  const requests = useMemo(() => deals.map((d) => ({ ...d, status: cap(d.status) })), [deals]);

  const orders = useMemo(
    () =>
      deals
        .filter((d) => ORDER_LABEL[d.status])
        .map((d) => ({
          id: d.id,
          farmer: d.farmerName,
          crop: d.crop,
          kg: d.kg,
          price: d.pricePerKg,
          date: d.pickupDate,
          status: ORDER_LABEL[d.status],
        })),
    [deals]
  );

  const stats = usePartnerStats(orders, requests, listing.capacity);

  const advance = useCallback(
    async (id) => {
      try {
        await api.post(`/deals/${id}/advance`);
        await refresh();
        toast.success("Order status updated");
      } catch (e) {
        toast.error(e.message);
      }
    },
    [refresh]
  );

  // Throws on failure so ListingTab can show the error and keep the form as it is
  const saveListing = async (price, capacity) => {
    const { partner } = await api.patch("/partners/me", {
      price_per_kg: price,
      capacity_kg: Math.round(capacity),
    });
    setProfile(partner);
    setListing(fromServer(partner));
  };

  const setAccepting = async (accepting) => {
    setListing((l) => ({ ...l, accepting }));
    try {
      await api.patch("/partners/me", { accepting });
    } catch (e) {
      setListing((l) => ({ ...l, accepting: !accepting }));
      toast.error(e.message);
    }
=======
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekdayOf(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return (date.getDay() + 6) % 7; // Monday = 0
}

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
    sub: partner?.county ? `${type} partner · ${partner.county}` : `${type} partner`,
    initials: name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase(),
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
  };

  const name = profile?.name ?? partnerName;
  const type = profile ? cap(profile.type) : partnerType;

  const nav = [
    ["requests", "Requests", Inbox, stats.pending],
    ["orders", "Orders", Package],
    ["listing", "Listing", Tag],
  ];

<<<<<<< HEAD
  const user = {
    name,
    sub: `${type} partner`,
    initials: name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
=======
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
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
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

  let content;
  switch (tab) {
    case "requests":
      content = (
        <div className="space-y-6">
          <RequestsTab
            requests={requests}
            stats={stats}
            accepting={listing.accepting}
            onDecide={handleDecide}
            busyId={busyId}
          />
        </div>
      );
      break;
    case "orders":
      content = (
        <div className="space-y-6">
          <OrdersTab orders={orders} onAdvance={handleAdvance} busyId={busyId} />
        </div>
      );
      break;
    case "listing":
      content = (
        <div className="space-y-6">
          <ListingTab
            listing={listing}
            load={stats.load}
            onSave={handleSaveListing}
            saving={saving}
          />
        </div>
      );
      break;
    default:
      content = <div className="p-12 text-center text-muted-foreground">Select a section from the sidebar.</div>;
  }

  return (
    <Shell
      nav={nav}
      active={tab}
      onNavigate={setTab}
      title="Partner Portal"
<<<<<<< HEAD
      subtitle="Requests, orders and capacity"
      user={user}
      alerts={stats.pending}
=======
      subtitle={
        tab === "requests" ? "Manage incoming farmer requests" :
        tab === "orders" ? "Track active shipments and deliveries" :
        "Configure your service offering and capacity"
      }
      user={user}
      path={path}
      breadcrumbs={crumbs}
      alerts={notifications.unread}
      onBell={() => setBellOpen((v) => !v)}
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
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
<<<<<<< HEAD
            <div className="p-3 bg-green-100 text-green-700 rounded-xl shadow-2xs">
              <Building2 size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{name}</h1>
              <p className="text-xs text-gray-500 font-medium">{type} partner • MAVUNO Green Grid</p>
=======
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
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-border bg-muted/50 px-4 py-2.5 sm:self-auto">
            <span className="text-xs font-bold text-foreground">
              {listing.accepting ? "Accepting requests" : "Paused"}
            </span>
<<<<<<< HEAD
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                role="switch"
                checked={listing.accepting}
                onChange={(e) => setAccepting(e.target.checked)}
                className="sr-only peer"
=======
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                role="switch"
                aria-label="Accepting new requests"
                checked={listing.accepting}
                onChange={(e) => toggleAccepting(e.target.checked)}
                className="peer sr-only"
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
              />
              <span className="block h-6 w-11 rounded-full bg-border transition-colors duration-200 peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60" />
              <span className="pointer-events-none absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
            </label>
          </div>
        </section>

        {/* Status banners */}
        {!listing.accepting && (
          <div
<<<<<<< HEAD
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs sm:text-sm font-semibold shadow-xs"
            role="status"
          >
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <span>Paused. Farmers can't send you new match requests.</span>
=======
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
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
          </div>
        )}

        <KpiGrid stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CapacityBar stats={stats} capacity={listing.capacity} />
          <VolumeCard data={weekly ?? WEEKLY} live={Boolean(weekly)} />
        </div>

<<<<<<< HEAD
        {/* Dynamic Tab Views */}
        <div className="pt-2">
          {tab === "Requests" && (
            <RequestsTab requests={requests} stats={stats} accepting={listing.accepting} onChanged={refresh} />
          )}
          {tab === "Orders" && <OrdersTab orders={orders} onAdvance={advance} />}
          {tab === "Listing" && (
            <ListingTab
              key={`${listing.price}-${listing.capacity}`}
              listing={listing}
              load={stats.load}
              onSave={saveListing}
            />
          )}
        </div>
=======
        {content}

        {loading && (
          <p className="flex items-center justify-center gap-2 pb-4 text-xs font-medium text-muted-foreground">
            <Bell size={13} aria-hidden="true" /> Syncing with the platform…
          </p>
        )}
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
      </div>
    </Shell>
  );
}