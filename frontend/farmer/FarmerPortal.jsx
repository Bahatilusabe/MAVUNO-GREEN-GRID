import { useState } from "react";
import { Hand } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_FARMS } from "../shared/data";
import { FARMER_NAV, FARMER_USER } from "../shared/nav";
import Shell from "../shared/Shell";
import Assistant from "../shared/Assistant";
import { COUNTIES } from "./constants";
import Overview from "./views/Overview";
import MyFarms from "./views/MyFarms";
import AddFarmForm from "./views/AddFarmForm";
import FarmDetails from "./views/FarmDetails";
import Crops from "./views/Crops";
import Forecast from "./views/Forecast";
import Opportunities from "./views/Opportunities";
import Recommendations from "./views/Recommendations";
import Market from "./views/Market";
import Impact from "./views/Impact";
import Profile from "./views/Profile";
import Storage from "./views/Storage";
import Transport from "./views/Transport";
import Weather from "./views/Weather";
import Messages from "./views/Messages";
import AddCropForm from "./views/AddCropForm";
import { NOTIFICATIONS } from "./views/messages/data";

const SUBTITLES = {
  storage: "Find, compare and reserve storage before your harvest arrives.",
  transport: "Move your produce efficiently.",
  impact: "See what MAVUNO Green Grid is helping you save.",
  messages: "Alerts, buyer updates and system notices in one place.",
  weather: "Forecasts, weather statistics and field predictions for your farms.",
};

export default function FarmerPortal({ initialView = "overview" }) {
  const [view, setView] = useState(initialView);
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [crops, setCrops] = useState(() => INITIAL_FARMS.map((farm) => ({
    id: `demo-${farm.id}`,
    farm_id: farm.id,
    crop_type: farm.crop,
    planting_date: "",
    expected_harvest_date: farm.harvest,
    area_planted: farm.area,
    expected_yield: farm.kg,
    yield_unit: "kg",
    status: farm.stage === "Planning" ? "PLANNED" : "GROWING",
  })));
  const [farmId, setFarmId] = useState(1);
  const [adding, setAdding] = useState(false);
  const [county, setCounty] = useState("Kirinyaga");
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  });

  const farm = farms.find((f) => f.id === farmId) || farms[0];

  const go = (v) => { setView(v); setAdding(false); };
  const openFarm = (id) => { setFarmId(id); setView("farm"); };
  const openCrop = (id) => { setFarmId(id); setView("forecast"); };
  
  const addFarm = (f) => {
    setFarms([...farms, { id: Date.now(), name: f.name, county: f.county, area: f.area, crop: "Rice", kg: 0, harvest: "—", risk: "Low", perf: 0, type: "Smallholder", water: f.water || "—", irrigation: f.irrigation || "—", stage: "Planning", coords: "—" }]);
    setAdding(false);
    toast.success(`${f.name} added`);
  };

  const addCrop = (crop) => {
    setCrops((current) => [...current, crop]);
    setFarms((current) => current.map((item) => item.id === crop.farm_id
      ? { ...item, crop: crop.crop_type, kg: crop.expected_yield, harvest: crop.expected_harvest_date, stage: crop.status }
      : item));
    setAdding(false);
    toast.success(`${crop.crop_type} added to the farm`);
  };

  const unread = notes.filter((n) => n.unread).length;
  const nav = FARMER_NAV.map((n) => (n[0] === "messages" ? [n[0], n[1], n[2], unread] : n));

  const activeNav = view === "farm" ? "farms" : view === "forecast" ? "crops" : view;
  const navTitle = (nav.find((n) => n[0] === activeNav) || nav[0])[1];
  const home = view === "overview";

  let content;
  switch (view) {
    case "overview": content = <Overview farms={farms} go={go} onOpenFarm={openFarm} />; break;
    case "farms":
      content = (
        <div className="space-y-6">
          {adding && <AddFarmForm onSave={addFarm} onCancel={() => setAdding(false)} />}
          <MyFarms farms={farms} onOpen={openFarm} onAdd={() => setAdding(true)} />
        </div>
      );
      break;
    case "farm": content = <FarmDetails farm={farm} onBack={() => go("farms")} onForecast={() => setView("forecast")} />; break;
    case "crops":
      content = (
        <div className="space-y-6">
          {adding && <AddCropForm farms={farms} onSave={addCrop} onCancel={() => setAdding(false)} />}
          <Crops farms={farms} crops={crops} onOpen={openCrop} onAdd={() => setAdding(true)} />
        </div>
      );
      break;
    case "forecast": content = <Forecast farm={farm} onBack={() => go("crops")} go={go} />; break;
    case "opportunities": content = <Opportunities />; break;
    case "recs": content = <Recommendations />; break;
    case "market": content = <Market />; break;
    case "impact": content = <Impact />; break;
    case "settings": content = <Profile />; break;
    case "storage": content = <Storage farms={farms} />; break;
    case "transport": content = <Transport go={go} />; break;
    case "weather": content = <Weather />; break;
    case "messages": content = <Messages items={notes} setItems={setNotes} go={go} />; break;
    default: content = (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
        {navTitle} is coming soon.
      </div>
    );
  }

  return (
    <Shell
      nav={nav}
      active={activeNav}
      onNavigate={go}
      title={
        home ? (
          <span className="flex items-center gap-2">
            {greeting}, Samuel <Hand className="text-amber-500 inline-block" aria-hidden="true" size={20} />
          </span>
        ) : (
          navTitle
        )
      }
      subtitle={home ? "Here's what MAVUNO is seeing across your farms today." : SUBTITLES[view]}
      user={FARMER_USER}
      alerts={unread}
      onBell={() => go("messages")}
      actions={
        <select 
          value={county} 
          onChange={(e) => setCounty(e.target.value)} 
          aria-label="County"
          className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:border-green-600 transition-all cursor-pointer shadow-2xs"
        >
          {COUNTIES.map((c) => <option key={c} value={c}>{c} County</option>)}
        </select>
      }
      aside={<Assistant />}
    >
      <div className="space-y-6">{content}</div>
    </Shell>
  );
}  