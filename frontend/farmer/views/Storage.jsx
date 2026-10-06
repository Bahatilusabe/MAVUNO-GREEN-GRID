import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Warehouse, CalendarCheck, TriangleAlert, TrendingUp, TrendingDown } from "lucide-react";
import { FACILITIES, RESERVATIONS_INIT, RESERVE_KG, STAT_TRENDS } from "./storage/data";
import MapCard from "./storage/MapCard";
import RecommendedCard from "./storage/RecommendedCard";
import FacilitiesTable from "./storage/FacilitiesTable";
import Reservations from "./storage/Reservations";
import CapacityTimeline from "./storage/CapacityTimeline";

const TONS = RESERVE_KG / 1000;

export default function Storage({ farms }) {
  const [facilities, setFacilities] = useState(FACILITIES);
  const [reservations, setReservations] = useState(RESERVATIONS_INIT);
  const [requested, setRequested] = useState([]);

  const totals = useMemo(() => ({
    available: facilities.reduce((s, f) => s + f.available, 0),
    reserved: facilities.reduce((s, f) => s + f.reserved, 0),
  }), [facilities]);

  const atRisk = farms.filter((f) => f.risk !== "Low").length;

  const reserve = (f) => {
    setFacilities((fs) => fs.map((x) => (x.id === f.id ? { ...x, available: +(x.available - TONS).toFixed(1), reserved: +(x.reserved + TONS).toFixed(1) } : x)));
    setReservations((rs) => [...rs, { id: Date.now(), facility: f.name, crop: "Tomatoes", kg: RESERVE_KG, status: "Pending", date: "Oct 18, 2026" }]);
    setRequested((r) => [...r, f.id]);
    toast.success(`Reserved ${RESERVE_KG.toLocaleString()} kg at ${f.name}`, { description: "Waiting for the facility to confirm." });
  };

  const statCardsData = [
    { label: "Nearby Facilities", value: facilities.length, trend: STAT_TRENDS.facilities, icon: Building2, tone: "purple", warn: false },
    { label: "Available Capacity", value: `${totals.available.toFixed(1)} t`, trend: STAT_TRENDS.available, icon: Warehouse, tone: "blue", warn: false },
    { label: "Reserved Capacity", value: `${totals.reserved.toFixed(1)} t`, trend: STAT_TRENDS.reserved, icon: CalendarCheck, tone: "green", warn: false },
    { label: "Crops at Risk", value: atRisk, trend: STAT_TRENDS.risk, icon: TriangleAlert, tone: "red", warn: atRisk > 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsData.map(({ label, value, trend, icon: Icon, tone, warn }) => (
          <div 
            key={label} 
            className={`relative p-5 rounded-xl border bg-white shadow-sm flex items-start justify-between transition-all hover:shadow-md ${
              warn ? "border-red-300 bg-red-50/30" : "border-gray-200"
            }`}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
              <div className="flex items-center pt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  warn ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {warn ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {trend}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center justify-center ${
              tone === "purple" ? "bg-purple-100 text-purple-700" :
              tone === "blue" ? "bg-blue-100 text-blue-700" :
              tone === "red" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
            }`}>
              <Icon aria-hidden="true" size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Map & Recommended Storage Card Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MapCard facilities={facilities} />
        </div>
        <div className="lg:col-span-5">
          <RecommendedCard facilities={facilities} />
        </div>
      </div>

      {/* Storage Facilities Table */}
      <FacilitiesTable facilities={facilities} requested={requested} tons={TONS} onReserve={reserve} />

      {/* Reservations & Capacity Timeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Reservations reservations={reservations} />
        </div>
        <div className="lg:col-span-5">
          <CapacityTimeline facilities={facilities} />
        </div>
      </div>
    </div>
  );
}