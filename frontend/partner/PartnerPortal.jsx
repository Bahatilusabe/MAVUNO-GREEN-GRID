import { useState } from "react";
import { Inbox, Package, Tag, Building2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Shell from "../shared/Shell";
import { REQUESTS_INIT, ORDERS_INIT, STEPS } from "./data";
import usePartnerStats from "./usePartnerStats";
import KpiGrid from "./components/KpiGrid";
import CapacityBar from "./components/CapacityBar";
import VolumeCard from "./components/VolumeCard";
import RequestsTab from "./components/RequestsTab";
import OrdersTab from "./components/OrdersTab";
import ListingTab from "./components/ListingTab";

export default function PartnerPortal({ partnerName = "Kagio Juice Processors", partnerType = "Processor" }) {
  const [tab, setTab] = useState("Requests");
  const [requests, setRequests] = useState(REQUESTS_INIT);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [listing, setListing] = useState({ price: 20, capacity: 2000, accepting: true });
  const stats = usePartnerStats(orders, requests, listing.capacity);

  const decide = (r, accept) => {
    setRequests((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: accept ? "Accepted" : "Declined" } : x)));
    if (accept) setOrders((os) => [...os, { id: Date.now(), farmer: r.farmer, crop: r.crop, kg: r.kg, price: r.price, date: r.date, status: "Scheduled" }]);
    toast[accept ? "success" : "info"](
      accept
        ? `Accepted ${r.farmer}'s request`
        : `Declined ${r.farmer}'s request`,
    );
  };

  const advance = (id) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: STEPS[STEPS.indexOf(o.status) + 1] || o.status } : o)));
    toast.success("Order status updated");
  };

  const nav = [
    ["Requests", "Requests", Inbox, stats.pending],
    ["Orders", "Orders", Package],
    ["Listing", "Listing", Tag],
  ];

  const user = {
    name: partnerName,
    sub: `${partnerType} partner`,
    initials: partnerName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
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
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{partnerName}</h1>
              <p className="text-xs text-gray-500 font-medium">{partnerType} partner • MAVUNO Green Grid</p>
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
                onChange={(e) => setListing({ ...listing, accepting: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700" />
            </label>
          </div>
        </div>

        {/* Paused Banner */}
        {!listing.accepting && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs sm:text-sm font-semibold shadow-xs" role="status">
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
          {tab === "Requests" && <RequestsTab requests={requests} stats={stats} accepting={listing.accepting} onDecide={decide} />}
          {tab === "Orders" && <OrdersTab orders={orders} onAdvance={advance} />}
          {tab === "Listing" && <ListingTab listing={listing} load={stats.load} onSave={(price, capacity) => setListing({ ...listing, price, capacity })} />}
        </div>
      </div>
    </Shell>
  );
}