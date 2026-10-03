import { useState } from "react";
import "./FarmerPortal.css";
import { INITIAL_FARMS } from "../shared/data";
import { cls } from "../shared/utils";
import Assistant from "../shared/Assistant";
import { NAV, COUNTIES } from "./constants";
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

export default function FarmerPortal({ initialView = "overview" }) {
  const [view, setView] = useState(initialView);
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [farmId, setFarmId] = useState(1);
  const [adding, setAdding] = useState(false);
  const [county, setCounty] = useState("Kirinyaga");
  const [menu, setMenu] = useState(false);
  const farm = farms.find((f) => f.id === farmId) || farms[0];

  const go = (v) => { setView(v); setAdding(false); setMenu(false); };
  const openFarm = (id) => { setFarmId(id); setView("farm"); };
  const openCrop = (id) => { setFarmId(id); setView("forecast"); };
  const addFarm = (f) => {
    setFarms([...farms, { id: Date.now(), name: f.name, county: f.county, area: f.area, crop: "Rice", kg: 0, harvest: "—", risk: "Low", perf: 0, type: "Smallholder", water: f.water || "—", irrigation: f.irrigation || "—", stage: "Planning", coords: "—" }]);
    setAdding(false);
  };

  const activeNav = view === "farm" ? "farms" : view === "forecast" ? "crops" : view;
  const title = (NAV.find((n) => n[0] === activeNav) || NAV[0])[1];

  let content;
  switch (view) {
    case "overview": content = <Overview farms={farms} go={go} />; break;
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
    default: content = <div className="card empty">{title} is coming soon.</div>;
  }

  return (
    <div className="fp">
      <nav className={cls("sidebar", menu && "open")} aria-label="Main">
        <div className="brand"><span>🌿</span><div><strong>MAVUNO</strong><small>Green Grid</small></div></div>
        {NAV.map(([key, label, icon, dot]) => (
          <button key={key} className={cls("nav-item", activeNav === key && "active")} onClick={() => go(key)}>
            <span>{icon}</span>{label}{dot && <i className="dot" />}
          </button>
        ))}
        <div className="user"><div className="avatar">SK</div><div><strong>Samuel Kamau</strong><small>Kirinyaga County</small></div></div>
      </nav>

      <main className="main">
        <header className="topbar">
          <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}>☰</button>
          <h1>{title}</h1>
          <select value={county} onChange={(e) => setCounty(e.target.value)} aria-label="County">
            {COUNTIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="icon-btn" aria-label="Notifications">🔔</button>
          <div className="avatar">SK</div>
        </header>
        <section className="content">{content}</section>
      </main>

      <Assistant className="assistant card" />
    </div>
  );
}