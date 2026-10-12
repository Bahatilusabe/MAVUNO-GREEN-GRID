import { useState } from "react";
import { CalendarDays, X } from "lucide-react";

const EMPTY = {
  crop_type: "",
  variety: "",
  planting_date: "",
  expected_harvest_date: "",
  area_planted: "",
  expected_yield: "",
  yield_unit: "kg",
  status: "PLANNED",
};

const CROP_TYPES = ["Tomatoes", "French Beans", "Rice", "Maize", "Onions"];

export default function AddCropForm({ farms, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, farm_id: farms[0]?.id || "" });
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const validDates = !form.planting_date || !form.expected_harvest_date
    || form.expected_harvest_date > form.planting_date;
  const valid = form.farm_id && form.crop_type && form.planting_date && form.expected_harvest_date
    && validDates
    && Number(form.area_planted) > 0 && Number(form.expected_yield) > 0;

  const submit = (event) => {
    event.preventDefault();
    if (!valid) return;
    onSave({
      ...form,
      farm_id: Number(form.farm_id),
      area_planted: Number(form.area_planted),
      expected_yield: Number(form.expected_yield),
      id: Date.now(),
    });
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-green-200 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Register a crop cycle</h3>
          <p className="text-xs text-gray-500 mt-1">Add planting details so harvest, storage, and market plans can use the same record.</p>
        </div>
        <button type="button" onClick={onCancel} aria-label="Close crop form" className="p-2 text-gray-400 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="text-sm font-medium text-gray-700">Farm *
          <select className="mt-1 w-full p-2 border rounded-lg bg-white" value={form.farm_id} onChange={set("farm_id")} required>
            {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">Crop *
          <select className="mt-1 w-full p-2 border rounded-lg bg-white" value={form.crop_type} onChange={set("crop_type")} required>
            <option value="">Select crop</option>
            {CROP_TYPES.map((crop) => <option key={crop}>{crop}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">Variety
          <input className="mt-1 w-full p-2 border rounded-lg" value={form.variety} onChange={set("variety")} placeholder="e.g. Anna F1" />
        </label>
        <label className="text-sm font-medium text-gray-700">Planting date *
          <div className="relative mt-1">
            <CalendarDays size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="w-full p-2 pl-9 border rounded-lg" type="date" value={form.planting_date} onChange={set("planting_date")} required />
          </div>
        </label>
        <label className="text-sm font-medium text-gray-700">Expected harvest *
          <div className="relative mt-1">
            <CalendarDays size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="w-full p-2 pl-9 border rounded-lg" type="date" min={form.planting_date || undefined} value={form.expected_harvest_date} onChange={set("expected_harvest_date")} required />
          </div>
        </label>
        <label className="text-sm font-medium text-gray-700">Area planted (ha) *
          <input className="mt-1 w-full p-2 border rounded-lg" type="number" min="0.01" step="0.01" value={form.area_planted} onChange={set("area_planted")} required />
        </label>
        <label className="text-sm font-medium text-gray-700">Expected yield *
          <div className="flex mt-1">
            <input className="w-full p-2 border rounded-l-lg" type="number" min="1" step="1" value={form.expected_yield} onChange={set("expected_yield")} required />
            <select className="p-2 border border-l-0 rounded-r-lg bg-gray-50" value={form.yield_unit} onChange={set("yield_unit")}>
              <option value="kg">kg</option>
              <option value="tonnes">tonnes</option>
            </select>
          </div>
        </label>
        <label className="text-sm font-medium text-gray-700">Status
          <select className="mt-1 w-full p-2 border rounded-lg bg-white" value={form.status} onChange={set("status")}>
            {["PLANNED", "PLANTED", "GROWING"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={!valid} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed">Save crop cycle</button>
      </div>
    </form>
  );
}
