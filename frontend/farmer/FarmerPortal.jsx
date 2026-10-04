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
import Messages from "./views/Messages";
import { NOTIFICATIONS } from "./views/messages/data";

const SUBTITLES = {
  storage: "Find, compare and reserve storage before your harvest arrives.",
  transport: "Move your produce efficiently.",
  impact: "See what MAVUNO Green Grid is helping you save.",
  messages: "Alerts, buyer updates and system notices in one place.",
};

export default function FarmerPortal({ initialView = "overview" }) {
  const [view, setView] = useState(initialView);
  const [farms, setFarms] = useState(INITIAL_FARMS);
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
        <>
          {adding && <AddFarmForm onSave={addFarm} onCancel={() => setAdding(false)} />}
          <MyFarms farms={farms} onOpen={openFarm} onAdd={() => setAdding(true)} />
        </>
      );
      break;
    case "farm": content = <FarmDetails farm={farm} onBack={() => go("farms")} onForecast={() => setView("forecast")} />; break;
    case "crops": content = <Crops farms={farms} onOpen={openCrop} />; break;
    case "forecast": content = <Forecast farm={farm} onBack={() => go("crops")} go={go} />; break;
    case "opportunities": content = <Opportunities />; break;
    case "recs": content = <Recommendations />; break;
    case "market": content = <Market />; break;
    case "impact": content = <Impact />; break;
    case "settings": content = <Profile />; break;
    case "storage": content = <Storage farms={farms} />; break;
    case "transport": content = <Transport go={go} />; break;
    case "messages": content = <Messages items={notes} setItems={setNotes} go={go} />; break;
    default: content = <div className="card empty">{navTitle} is coming soon.</div>;
  }

  return (
    <Shell
      nav={nav}
      active={activeNav}
      onNavigate={go}
      title={home ? <>{greeting}, Samuel <Hand aria-hidden="true" size={20} /></> : navTitle}
      subtitle={home ? "Here's what MAVUNO is seeing across your farms today." : SUBTITLES[view]}
      user={FARMER_USER}
      alerts={unread}
      onBell={() => go("messages")}
      actions={
        <select value={county} onChange={(e) => setCounty(e.target.value)} aria-label="County">
          {COUNTIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      }
      aside={<Assistant className="sh-assist" />}
    >
      <div className="fp">{content}</div>
    </Shell>
  );
}