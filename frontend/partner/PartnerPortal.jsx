import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Package, Tag, Building2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Shell from "../shared/Shell";
import { api, getToken } from "../src/lib/api";
import { useDeals } from "../src/hooks/useDeals";
import usePartnerStats from "./usePartnerStats";
import KpiGrid from "./components/KpiGrid";
import CapacityBar from "./components/CapacityBar";
import VolumeCard from "./components/VolumeCard";
import RequestsTab from "./components/RequestsTab";
import OrdersTab from "./components/OrdersTab";
import ListingTab from "./components/ListingTab";

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
  };

  const name = profile?.name ?? partnerName;
  const type = profile ? cap(profile.type) : partnerType;

  const nav = [
    ["Requests", "Requests", Inbox, stats.pending],
    ["Orders", "Orders", Package],
    ["Listing", "Listing", Tag],
  ];

  const user = {
    name,
    sub: `${type} partner`,
    initials: name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
  };

  return (
    <Shell
      nav={nav}
      active={tab}
      onNavigate={setTab}
      title="Partner Portal"
      subtitle="Requests, orders and capacity"
      user={user}
      alerts={stats.pending}
    >
      <div className="space-y-6 pb-12">
        {/* Partner Header & Toggle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl shadow-2xs">
              <Building2 size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{name}</h1>
              <p className="text-xs text-gray-500 font-medium">{type} partner • MAVUNO Green Grid</p>
            </div>
          </div>

          {/* Accepting Requests Toggle Switch */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl self-start sm:self-auto">
            <span className="text-xs font-bold text-gray-700">
              {listing.accepting ? "Accepting requests" : "Paused"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                role="switch"
                checked={listing.accepting}
                onChange={(e) => setAccepting(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700" />
            </label>
          </div>
        </div>

        {/* Paused Banner */}
        {!listing.accepting && (
          <div
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs sm:text-sm font-semibold shadow-xs"
            role="status"
          >
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <span>Paused. Farmers can't send you new match requests.</span>
          </div>
        )}

        {/* KPIs */}
        <KpiGrid stats={stats} />

        {/* Capacity Bar & Volume Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CapacityBar stats={stats} capacity={listing.capacity} />
          <VolumeCard />
        </div>

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
      </div>
    </Shell>
  );
}