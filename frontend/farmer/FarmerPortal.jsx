import { useState } from "react";
import { Hand } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_FARMS } from "../shared/data";
import { FARMER_NAV, FARMER_USER } from "../shared/nav";
import Shell from "../shared/Shell";
import Assistant from "../shared/Assistant";
import { COUNTIES } from "./constants";
import { useFarms } from "../src/hooks/useFarms";
import { getUser } from "../src/lib/api";
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

const demoCrops = () => INITIAL_FARMS.map((farm) => ({
  id: `demo-${farm.id}`,
  farm_id: farm.id,
  crop_type: farm.crop,
  planting_date: "",
  expected_harvest_date: farm.harvest,
  area_planted: farm.area,
  expected_yield: farm.kg,
  yield_unit: "kg",
  status: farm.stage === "Planning" ? "PLANNED" : "GROWING",
}));

export default function FarmerPortal({ initialView = "overview" }) {
  const [view, setView] = useState(initialView);

  // Live data from the API. When signed out or the API is down it falls back to demo data.
  const live = useFarms();
  const demo = Boolean(live.error);
  const [demoFarms, setDemoFarms] = useState(INITIAL_FARMS);
  const [demoCropList, setDemoCropList] = useState(demoCrops);

  const farms = demo ? demoFarms : live.farms;
  const crops = demo ? demoCropList : live.farms.flatMap((f) => f.crops);

  const [farmId, setFarmId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [county, setCounty] = useState("Kirinyaga");
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  });

  const firstName = getUser()?.full_name?.split(" ")[0] || "Samuel";
  const farm = farms.find((f) => f.id === farmId) || farms[0];

  const go = (v) => { setView(v); setAdding(false); };
  const openFarm = (id) => { setFarmId(id); setView("farm"); };
  const openCrop = (id) => { setFarmId(id); setView("forecast"); };

  const addFarm = async (f) => {
    if (demo) {
      setDemoFarms((cur) => [...cur, {
        id: Date.now(), name: f.name, county: f.county, area: f.area, crop: "—", kg: 0,
        harvest: "—", risk: "Low", perf: 0, type: "Smallholder", water: f.water || "—",
        irrigation: f.irrigation || "—", stage: "Planning", coords: f.coords || "—",
        lat: f.lat, lng: f.lng,
      }]);
    } else {
      try {
        await live.addFarm(f);
      } catch (e) {
        toast.error(e.message);
        return;
      }
    }
    setAdding(false);
    toast.success(`${f.name} added`);
  };

  const addCrop = async (crop) => {
    if (demo) {
      setDemoCropList((cur) => [...cur, crop]);
      setDemoFarms((cur) => cur.map((item) => item.id === crop.farm_id
        ? { ...item, crop: crop.crop_type, kg: crop.expected_yield, harvest: crop.expected_harvest_date, stage: crop.status }
        : item));
    } else {
      try {
        await live.addCrop(crop);
      } catch (e) {
        toast.error(e.message);
        return;
      }
    }
    setAdding(false);
    toast.success(`${crop.crop_type} added to the farm`);
  };

  const unread = notes.filter((n) => n.unread).length;
  const nav = FARMER_NAV.map((n) => (n[0] === "messages" ? [n[0], n[1], n[2], unread] : n));

  const activeNav = view === "farm" ? "farms" : view === "forecast" ? "crops" : view;
  const navTitle = (nav.find((n) => n[0] === activeNav) || nav[0])[1];
  const home = view === "overview";

  // Farm-dependent screens wait for the first load instead of flashing "No farms yet"
  const farmViews = ["overview", "farms", "farm", "crops", "forecast", "storage"];
  const waiting = live.loading && !demo && farmViews.includes(view);

  let content;
  if (waiting) {
    content = (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm" role="status">
        Loading your farms…
      </div>
    );
  } else {
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
      case "farm":
        content = farm
          ? <FarmDetails farm={farm} onBack={() => go("farms")} onForecast={() => setView("forecast")} />
          : <MyFarms farms={farms} onOpen={openFarm} onAdd={() => { setView("farms"); setAdding(true); }} />;
        break;
      case "crops":
        content = (
          <div className="space-y-6">
            {adding && <AddCropForm farms={farms} onSave={addCrop} onCancel={() => setAdding(false)} />}
            <Crops farms={farms} crops={crops} onOpen={openCrop} onAdd={() => setAdding(true)} />
          </div>
        );
        break;
      case "forecast":
        content = farm
          ? <Forecast farm={farm} onBack={() => go("crops")} go={go} />
          : <MyFarms farms={farms} onOpen={openFarm} onAdd={() => { setView("farms"); setAdding(true); }} />;
        break;
      case "opportunities": content = <Opportunities farm={farm} />; break;
      case "recs": content = <Recommendations />; break;
      case "market": content = <Market />; break;
      case "impact": content = <Impact />; break;
      case "settings": content = <Profile />; break;
      case "storage": content = <Storage farms={farms} />; break;
      case "transport": content = <Transport go={go} />; break;
      case "weather": content = <Weather farm={farm} />; break;
      case "messages": content = <Messages items={notes} setItems={setNotes} go={go} />; break;
      default: content = (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
          {navTitle} is coming soon.
        </div>
      );
    }
  }

  return (
    <Shell
      nav={nav}
      active={activeNav}
      onNavigate={go}
      title={
        home ? (
          <span className="flex items-center gap-2">
            {greeting}, {firstName} <Hand className="text-amber-500 inline-block" aria-hidden="true" size={20} />
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
      aside={<Assistant farmId={!demo && typeof farm?.id === "string" ? farm.id : undefined} />}
    >
      <div className="space-y-6">
        {demo && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="status">
            Demo mode: {live.error === "Not signed in" ? "sign in to save your farms and crops." : `${live.error}. Changes are not saved.`}
          </p>
        )}
        {content}
      </div>
    </Shell>
  );
}
