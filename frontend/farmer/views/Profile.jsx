import { useState } from "react";
import { toast } from "sonner";
import { User, ShieldCheck, Camera, Lock, Mail, Phone, Globe, Bell } from "lucide-react";

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
  
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-6">
      {/* Modernized Profile Header Banner */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-green-50/40 via-white to-white">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center text-2xl font-bold shadow-md border-4 border-white">
            SK
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-green-700 text-white rounded-full shadow-lg cursor-pointer hover:bg-green-800 transition-colors">
            <Camera size={14} />
            <input type="file" className="hidden" onChange={() => toast.success("Profile photo uploaded")} />
          </label>
        </div>
        
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{form.name}</h2>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mx-auto sm:mx-0">
              <ShieldCheck size={14} /> Verified Farmer
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Kirinyaga County • Primary Producer</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8">
        {["Personal", "Farm Details", "Notifications"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === t 
                ? "border-green-700 text-green-800" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Personal" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Personal Information Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <User size={18} className="text-green-600" /> Personal Information
            </h3>
            
            <label className="block text-sm font-medium text-gray-700">Full Name
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={16} /></span>
                <input className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" value={form.name} onChange={set("name")} />
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">Phone Number
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Phone size={16} /></span>
                <input className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" type="tel" value={form.phone} onChange={set("phone")} />
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">Email Address
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Mail size={16} /></span>
                <input className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" type="email" value={form.email} onChange={set("email")} />
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">New Password
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={16} /></span>
                <input className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
              </div>
            </label>

            <button className="w-full sm:w-auto px-6 py-2.5 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors shadow-sm" onClick={() => toast.success("Profile updated successfully")}>
              Update Profile
            </button>
          </div>

          {/* Preferences & Settings */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Bell size={18} className="text-green-600" /> Notifications & Language
            </h3>

            <div className="space-y-4">
              {Object.keys(s).map((k) => (
                <div key={k} className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-700">{LABELS[k]}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                  </label>
                </div>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 pt-2 border-t">Preferred Language
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Globe size={16} /></span>
                <select className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white" value={lang} onChange={(e) => setLang(e.target.value)}>
                  {["English", "Kiswahili", "Kikuyu"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
          {tab} settings coming soon.
        </div>
      )}
    </div>
  );
}