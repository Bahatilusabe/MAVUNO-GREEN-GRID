import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Camera,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import { cn } from "../../src/lib/utils";
import Button from "../../shared/ui/Button";
import Field from "../../shared/ui/Field";
import Tabs from "../../shared/ui/Tabs";

const COUNTIES = ["Kirinyaga", "Embu", "Murang'a", "Nyeri"];
const SOIL_TYPES = ["Red loam", "Clay", "Sandy loam", "Black cotton", "Silt", "Peaty"];
const IRRIGATION = ["Drip", "Flood", "Sprinkler", "Rain-fed", "Furrow"];
const WATER_SOURCES = ["Borehole", "River", "Canal", "Rainwater harvest", "Municipal"];

const TABS = ["Personal", "Farm Details", "Notifications"];

/** The notification channels, and what each one is for. */
const CHANNELS = [
  { key: "Email", label: "Email", text: "Weekly market digest and match confirmations.", icon: Mail },
  { key: "SMS", label: "SMS", text: "Urgent alerts only — weather, spoilage and transport.", icon: Phone },
  { key: "Push", label: "Push", text: "Everything, the moment it happens on your phone.", icon: Bell },
];

/** The things a farmer can be told about. */
const TOPICS = [
  { key: "Weather", label: "Weather warnings", text: "Heavy rain, frost and dry spells for your county.", tone: "blue" },
  { key: "Price", label: "Market price moves", text: "When the price for your crop moves more than 5%.", tone: "amber" },
  { key: "Matches", label: "Buyer matches", text: "A buyer accepts, counters or declines your offer.", tone: "green" },
  { key: "Transport", label: "Transport updates", text: "Driver assigned, delayed or arrived at the farm.", tone: "purple" },
  { key: "Storage", label: "Storage capacity", text: "Cold store space opening up near you.", tone: "blue" },
  { key: "Recommendations", label: "AI recommendations", text: "Planting, irrigation and harvest timing advice.", tone: "green" },
  { key: "Reports", label: "Weekly reports", text: "A Monday summary of your farm performance.", tone: "amber" },
];

const TONE_CLASS = {
  green: "bg-brand-50 text-brand-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
};

/** A themed on/off switch. */
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-none items-center rounded-full border transition-colors duration-200",
        checked ? "border-brand-600 bg-brand-600" : "border-border bg-muted",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-0.5 left-0 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-0.5",
        )}
        style={{ height: "1.125rem", width: "1.125rem" }}
      />
    </button>
  );
}

/** A labelled row with an icon, text and a switch. */
function PreferenceRow({ icon: Icon, tone = "green", label, text, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span
            className={cn("mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg", TONE_CLASS[tone])}
            aria-hidden="true"
          >
            <Icon size={15} />
          </span>
        )}
        <div className="min-w-0">
          <strong className="block text-sm font-bold text-foreground">{label}</strong>
          {text && <p className="mt-0.5 text-xs font-medium leading-relaxed text-muted-foreground">{text}</p>}
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

/**
 * The farmer's own account.
 *
 * Three sections: who they are, the farm they sell from, and how MAVUNO is
 * allowed to reach them. Every control is themed, so the page reads the
 * same in light and dark mode.
 */
export default function Profile() {
  const [tab, setTab] = useState("Personal");

  const [form, setForm] = useState({
    name: "Samuel Kamau",
    phone: "+254 712 345 678",
    email: "samuel.kamau@email.com",
    password: "",
  });

  const [farm, setFarm] = useState({
    name: "Kiambaina Farm",
    county: "Kirinyaga",
    area: "1.2",
    soil: "Red loam",
    irrigation: "Drip",
    water: "Borehole",
    lat: "-0.5186",
    lng: "37.3675",
  });

  const [channels, setChannels] = useState({ Email: true, SMS: true, Push: true });
  const [topics, setTopics] = useState({
    Weather: true,
    Price: true,
    Matches: true,
    Transport: true,
    Storage: false,
    Recommendations: true,
    Reports: true,
  });
  const [quiet, setQuiet] = useState({ from: "21:00", to: "06:00", enabled: true });
  const [lang, setLang] = useState("English");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setFarmField = (k) => (e) => setFarm({ ...farm, [k]: e.target.value });

  const savePersonal = () => {
    if (!form.name.trim()) {
      toast.error("Your name cannot be empty.");
      return;
    }
    toast.success("Profile updated", { description: "Your details have been saved." });
  };

  const saveFarm = () => {
    const area = Number(farm.area);
    if (!farm.name.trim()) {
      toast.error("Give the farm a name.");
      return;
    }
    if (!Number.isFinite(area) || area <= 0) {
      toast.error("Enter the farm area in hectares.");
      return;
    }
    toast.success("Farm details saved", {
      description: `${farm.name} — ${area} ha in ${farm.county}.`,
    });
  };

  const saveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const initials = form.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="surface relative overflow-hidden p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--brand-200) 55%, transparent) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative group">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-2xl font-extrabold text-white shadow-card border-4 border-card">
              {initials || "?"}
            </div>
            <label className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-brand-700 text-white shadow-pop transition-colors hover:bg-brand-800">
              <Camera size={14} aria-hidden="true" />
              <span className="sr-only">Change profile photo</span>
              <input
                type="file"
                className="hidden"
                onChange={() => toast.success("Profile photo uploaded")}
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{form.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800">
                <ShieldCheck size={14} aria-hidden="true" /> Verified Farmer
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Kirinyaga County · Primary Producer
            </p>
            <p className="mt-2 max-w-lg text-xs font-medium leading-relaxed text-muted-foreground">
              Your verified status lets buyers on MAVUNO see who they are dealing with, and
              unlocks match requests against registered partners.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} value={tab} onChange={setTab} ariaLabel="Profile sections" />

      {tab === "Personal" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="surface p-6 lg:col-span-7">
            <h3 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-bold text-foreground">
              <User size={18} className="text-brand-600" aria-hidden="true" /> Personal Information
            </h3>

            <div className="mt-4 space-y-4">
              <Field label="Full name" id="profile-name">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <User size={16} aria-hidden="true" />
                </span>
                <input
                  id="profile-name"
                  className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={form.name}
                  onChange={set("name")}
                />
              </Field>

              <Field label="Phone number" id="profile-phone">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Phone size={16} aria-hidden="true" />
                </span>
                <input
                  id="profile-phone"
                  type="tel"
                  className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </Field>

              <Field label="Email address" id="profile-email">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Mail size={16} aria-hidden="true" />
                </span>
                <input
                  id="profile-email"
                  type="email"
                  className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={form.email}
                  onChange={set("email")}
                />
              </Field>

              <Field label="New password" hint="Leave blank to keep your current password." id="profile-password">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Lock size={16} aria-hidden="true" />
                </span>
                <input
                  id="profile-password"
                  type="password"
                  className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                />
              </Field>

              <Button onClick={savePersonal}>Update profile</Button>
            </div>
          </div>

          <div className="surface p-6 lg:col-span-5">
            <h3 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-bold text-foreground">
              <Globe size={18} className="text-brand-600" aria-hidden="true" /> Language
            </h3>
            <div className="mt-4 space-y-4">
              <Field label="Preferred language" id="profile-language">
                <select
                  id="profile-language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                >
                  {["English", "Kiswahili", "Kikuyu"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <p className="rounded-xl bg-muted/60 px-3.5 py-3 text-xs font-medium leading-relaxed text-muted-foreground">
                Market prices, weather warnings and buyer messages are translated into your
                chosen language. Contracts and match requests always stay in English.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "Farm Details" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="surface p-6 lg:col-span-8">
            <h3 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-bold text-foreground">
              <Sprout size={18} className="text-brand-600" aria-hidden="true" /> The farm you sell from
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Farm name" id="farm-name" className="sm:col-span-2">
                <input
                  id="farm-name"
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={farm.name}
                  onChange={setFarmField("name")}
                />
              </Field>

              <Field label="County" id="farm-county">
                <select
                  id="farm-county"
                  value={farm.county}
                  onChange={setFarmField("county")}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                >
                  {COUNTIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Area (hectares)" id="farm-area">
                <input
                  id="farm-area"
                  type="number"
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={farm.area}
                  onChange={setFarmField("area")}
                />
              </Field>

              <Field label="Soil type" id="farm-soil">
                <select
                  id="farm-soil"
                  value={farm.soil}
                  onChange={setFarmField("soil")}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Irrigation method" id="farm-irrigation">
                <select
                  id="farm-irrigation"
                  value={farm.irrigation}
                  onChange={setFarmField("irrigation")}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                >
                  {IRRIGATION.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Water source" id="farm-water">
                <select
                  id="farm-water"
                  value={farm.water}
                  onChange={setFarmField("water")}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                >
                  {WATER_SOURCES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field
                label="Latitude"
                id="farm-lat"
                hint="Used to match you with nearby buyers and transport."
              >
                <div className="flex items-center gap-2">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <MapPin size={16} aria-hidden="true" />
                  </span>
                  <input
                    id="farm-lat"
                    className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                    value={farm.lat}
                    onChange={setFarmField("lat")}
                  />
                </div>
              </Field>

              <Field label="Longitude" id="farm-lng">
                <input
                  id="farm-lng"
                  className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
                  value={farm.lng}
                  onChange={setFarmField("lng")}
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={saveFarm}>Save farm details</Button>
              <p className="text-xs font-medium text-muted-foreground">
                Buyers see these details when you send a match request.
              </p>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div className="surface p-5">
              <h4 className="text-sm font-bold text-foreground">Profile strength</h4>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Buyers trust a complete profile. Two details are still missing.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  ["Identity verified", true],
                  ["Phone number confirmed", true],
                  ["Soil and irrigation recorded", true],
                  ["Water source confirmed", true],
                  ["Second farm added", false],
                ].map(([label, done]) => (
                  <li key={label} className="flex items-center gap-2 text-xs font-medium">
                    <span
                      className={cn(
                        "grid h-4 w-4 flex-none place-items-center rounded-full text-[10px] font-bold text-white",
                        done ? "bg-brand-600" : "bg-border text-muted-foreground",
                      )}
                      aria-hidden="true"
                    >
                      {done ? "✓" : ""}
                    </span>
                    <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-5">
              <h4 className="text-sm font-bold text-foreground">What buyers see</h4>
              <div className="mt-3 space-y-2 rounded-xl bg-muted/60 p-3.5">
                <p className="text-sm font-bold text-foreground">{farm.name}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {farm.county} · {farm.area} ha · {farm.soil}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {farm.irrigation} irrigation, {farm.water.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "Notifications" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="surface p-6 lg:col-span-7">
            <h3 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-bold text-foreground">
              <Bell size={18} className="text-brand-600" aria-hidden="true" /> How MAVUNO reaches you
            </h3>
            <div className="divide-y divide-border">
              {CHANNELS.map((c) => (
                <PreferenceRow
                  key={c.key}
                  icon={c.icon}
                  label={c.label}
                  text={c.text}
                  checked={channels[c.key]}
                  onChange={(v) => setChannels({ ...channels, [c.key]: v })}
                />
              ))}
            </div>

            <h4 className="mt-6 border-t border-border pt-5 text-sm font-bold text-foreground">
              Quiet hours
            </h4>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              <Switch
                checked={quiet.enabled}
                onChange={(v) => setQuiet({ ...quiet, enabled: v })}
                label="Quiet hours"
              />
              <Field label="From" id="quiet-from" className="w-32">
                <input
                  id="quiet-from"
                  type="time"
                  value={quiet.from}
                  disabled={!quiet.enabled}
                  onChange={(e) => setQuiet({ ...quiet, from: e.target.value })}
                />
              </Field>
              <Field label="To" id="quiet-to" className="w-32">
                <input
                  id="quiet-to"
                  type="time"
                  value={quiet.to}
                  disabled={!quiet.enabled}
                  onChange={(e) => setQuiet({ ...quiet, to: e.target.value })}
                />
              </Field>
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Nothing but spoilage and safety alerts is sent between these hours.
            </p>
          </div>

          <div className="surface p-6 lg:col-span-5">
            <h3 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-bold text-foreground">
              <Sprout size={18} className="text-brand-600" aria-hidden="true" /> What you hear about
            </h3>
            <div className="divide-y divide-border">
              {TOPICS.map((t) => (
                <PreferenceRow
                  key={t.key}
                  label={t.label}
                  text={t.text}
                  tone={t.tone}
                  checked={topics[t.key]}
                  onChange={(v) => setTopics({ ...topics, [t.key]: v })}
                />
              ))}
            </div>

            <Button onClick={saveNotifications} className="mt-5">
              Save preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
