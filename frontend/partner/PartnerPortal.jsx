import { useState } from "react";
import { Inbox, Package, Tag } from "lucide-react";
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
  };
  const advance = (id) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: STEPS[STEPS.indexOf(o.status) + 1] || o.status } : o)));

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
    <Shell nav={nav} active={tab} onNavigate={setTab} title="Partner Portal" subtitle="Requests, orders and capacity" user={user} alerts={stats.pending}>
      <div className="pp">
        <header className="pp-head">
          <div><h1>{partnerName}</h1><small>{partnerType} partner • MAVUNO Green Grid</small></div>
          <label className="pp-switch">
            <span>{listing.accepting ? "Accepting requests" : "Paused"}</span>
            <input type="checkbox" role="switch" checked={listing.accepting} onChange={(e) => setListing({ ...listing, accepting: e.target.checked })} />
            <i />
          </label>
        </header>

        {!listing.accepting && <div className="pp-banner" role="status">Paused. Farmers can't send you new match requests.</div>}

        <KpiGrid stats={stats} />
        <div className="pp-grid2">
          <CapacityBar stats={stats} capacity={listing.capacity} />
          <VolumeCard />
        </div>

        {tab === "Requests" && <RequestsTab requests={requests} stats={stats} accepting={listing.accepting} onDecide={decide} />}
        {tab === "Orders" && <OrdersTab orders={orders} onAdvance={advance} />}
        {tab === "Listing" && <ListingTab listing={listing} load={stats.load} onSave={(price, capacity) => setListing({ ...listing, price, capacity })} />}
      </div>
    </Shell>
  );
}