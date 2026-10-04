import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Warehouse, CalendarCheck, TriangleAlert } from "lucide-react";
import { StatCard } from "../components/page-parts";
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

  return (
    <div className="pg">
      <div className="pg-stats">
        <StatCard icon={Building2} tone="purple" label="Nearby Facilities" value={facilities.length} trend={STAT_TRENDS.facilities} />
        <StatCard icon={Warehouse} tone="blue" label="Available Capacity" value={`${totals.available.toFixed(1)} t`} trend={STAT_TRENDS.available} />
        <StatCard icon={CalendarCheck} tone="green" label="Reserved Capacity" value={`${totals.reserved.toFixed(1)} t`} trend={STAT_TRENDS.reserved} />
        <StatCard icon={TriangleAlert} tone="red" label="Crops at Risk" value={atRisk} trend={STAT_TRENDS.risk} down danger />
      </div>
      <div className="pg-two map">
        <MapCard facilities={facilities} />
        <RecommendedCard facilities={facilities} />
      </div>
      <FacilitiesTable facilities={facilities} requested={requested} tons={TONS} onReserve={reserve} />
      <div className="pg-two">
        <Reservations reservations={reservations} />
        <CapacityTimeline facilities={facilities} />
      </div>
    </div>
  );
}