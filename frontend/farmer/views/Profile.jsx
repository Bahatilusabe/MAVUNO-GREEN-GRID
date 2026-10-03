import { useState } from "react";
import { Check } from "lucide-react";
import { Tabs, Toggle } from "../components/ui";

const LABELS = {
  Email: "Email Notifications",
  SMS: "SMS Notifications",
  Push: "Push Notifications",
  "AI Recommendations": "AI Recommendations",
  "Weekly Reports": "Weekly Reports",
};

export default function Profile() {
  const [tab, setTab] = useState("Personal");
  const [form, setForm] = useState({
    name: "Samuel Kamau",
    phone: "+254 712 345 678",
    email: "samuel.kamau@email.com",
    password: "",
  });
  const [s, setS] = useState({
    Email: true,
    SMS: true,
    Push: true,
    "AI Recommendations": true,
    "Weekly Reports": true,
  });
  const [lang, setLang] = useState("English");
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setSaved(false);
  };

  return (
    <>
      <div className="card profile-head">
        <div className="avatar big">SK</div>
        <div>
          <h2>{form.name}</h2>
          <small>Kirinyaga County</small>
          <span className="pill pill-low">● Verified Farmer</span>
        </div>
      </div>
      <Tabs
        tabs={["Personal", "Farm Details", "Notifications"]}
        active={tab}
        onChange={setTab}
      />
      {tab === "Personal" ? (
        <div className="split">
          <div className="card form">
            <h3>Personal Information</h3>
            <label>
              Full Name
              <input value={form.name} onChange={set("name")} />
            </label>
            <label>
              Phone
              <input type="tel" value={form.phone} onChange={set("phone")} />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={set("email")} />
            </label>
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
              />
            </label>
            <button className="btn" onClick={() => setSaved(true)}>
              {saved ? (
                <>
                  Saved <Check aria-hidden="true" size={16} />
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
          <div className="card">
            <h3>Settings</h3>
            {Object.keys(s).map((k) => (
              <Toggle
                key={k}
                label={LABELS[k]}
                on={s[k]}
                onChange={(v) => setS({ ...s, [k]: v })}
              />
            ))}
            <label>
              Language
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                {["English", "Kiswahili", "Kikuyu"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : (
        <div className="card empty">{tab} settings coming soon.</div>
      )}
    </>
  );
}
