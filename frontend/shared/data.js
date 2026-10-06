export const CROP = {
  Tomatoes: { tone: "tomato" },
  "French Beans": { tone: "beans" },
  Rice: { tone: "rice" },
};

export const INITIAL_FARMS = [
  { id: 1, name: "Kiambaina Farm", county: "Kirinyaga", area: 1.2, crop: "Tomatoes", kg: 4500, harvest: "Oct 18, 2026", risk: "High", perf: 92, type: "Smallholder", water: "Borehole", irrigation: "Drip", stage: "Flowering", coords: "-0.5186, 37.3675" },
  { id: 2, name: "Mwea Plot 02", county: "Kirinyaga", area: 0.8, crop: "Rice", kg: 3200, harvest: "Nov 03, 2026", risk: "Low", perf: 78, type: "Smallholder", water: "Canal", irrigation: "Flood", stage: "Tillering", coords: "-0.6700, 37.3500" },
  { id: 3, name: "Kutus Farm", county: "Kirinyaga", area: 0.4, crop: "French Beans", kg: 2100, harvest: "Oct 24, 2026", risk: "Medium", perf: 65, type: "Smallholder", water: "River", irrigation: "Drip", stage: "Pod fill", coords: "-0.5600, 37.2800" },
];

export const OPPS = [
  { id: 1, name: "Nairobi Fresh Markets", type: "Buyer", km: 68, cap: "1,500 kg", price: "KES 28/kg", note: "High demand", x: 38, y: 12 },
  { id: 2, name: "Kagio Juice Processors", type: "Processor", km: 20, cap: "2,000 kg", price: "KES 20/kg", note: "Medium demand", x: 70, y: 32 },
  { id: 3, name: "Kirieyaga Cold Storage", type: "Storage", km: 10, cap: "5,000 kg", price: "KES 12/kg/day", note: "Available", x: 52, y: 58 },
  { id: 4, name: "Wakulima Transporters", type: "Transport", km: 40, cap: "10 t", price: "KES 18/km", note: "Available", x: 30, y: 74 },
];

export const OPP_COLOR = { Buyer: "#1e7a46", Processor: "#2f9e5c", Storage: "#2563eb", Transport: "#1e3a8a" };

export const RECS = [
  { id: 1, kind: "Harvest", title: "High Surplus Risk – Tomatoes", text: "Expected surplus of 1,800 kg. Act within 72 hours.", cta: "View Plan", conf: 87, tone: "danger",
    why: [["ok", "Local demand is 40% lower than expected supply"], ["ok", "Storage capacity is limited in your area"], ["ok", "Nearby buyers have available capacity"], ["bad", "Transport is available within 48 km only"]],
    impact: ["+KES 43,000 value", "−1.2 t waste avoided", "−3.4 t CO₂ reduced"] },
  { id: 2, kind: "Market", title: "Better Market Price – French Beans", text: "Nairobi market price is 16% higher than local.", cta: "View Details", conf: 79, tone: "info",
    why: [["ok", "Export-grade demand rising this week"], ["ok", "Your harvest window matches buyer needs"], ["bad", "Higher transport cost to Nairobi"]],
    impact: ["+KES 12,500 value", "−0.4 t waste avoided", "−0.9 t CO₂ reduced"] },
  { id: 3, kind: "Storage", title: "Storage Recommendation", text: "Reserve cold storage for 1,800 kg to reduce spoilage risk.", cta: "Reserve Now", conf: 82, tone: "info",
    why: [["ok", "Cold storage 10 km away has capacity"], ["ok", "Cuts spoilage risk from High to Low"], ["bad", "Storage fee KES 12/kg/day"]],
    impact: ["+KES 21,600 value", "−1.5 t waste avoided", "−2.8 t CO₂ reduced"] },
];

export const BUYERS = [
  { name: "Nairobi Fresh Markets", sub: "Buyer • 68 km", cap: "1,500 kg capacity", price: "KES 28/kg" },
  { name: "Kagio Juice Processors", sub: "Processor • 20 km", cap: "2,000 kg capacity", price: "KES 20/kg" },
];

export const MARKET_PRICES = [
  ["Nairobi Fresh Markets", "KES 28/kg", "High"],
  ["Kagio Processors", "KES 20/kg", "Medium"],
  ["Nakuru Market", "KES 17/kg", "Low"],
];

export const PRICE_TREND = [
  { week: "Sep 5", nairobi: 24, kagio: 18, nakuru: 15 },
  { week: "Sep 12", nairobi: 25, kagio: 18, nakuru: 16 },
  { week: "Sep 19", nairobi: 26, kagio: 19, nakuru: 16 },
  { week: "Sep 26", nairobi: 27, kagio: 19, nakuru: 17 },
  { week: "Oct 3", nairobi: 28, kagio: 20, nakuru: 17 },
];

export const FORECAST = {
  labels: ["Oct 10", "Oct 13", "Oct 16", "Oct 18", "Oct 21", "Oct 24"],
  supply: [1.2, 2.6, 3.8, 4.5, 4.1, 3.6],
  demand: [0.6, 1.6, 3.2, 2.9, 2.6, 2.4],
};

export const FORECASTS = {
  "7 days": { labels: ["Oct 10", "Oct 12", "Oct 14", "Oct 16", "Oct 18", "Oct 20", "Oct 22"], supply: [1.2, 2.0, 2.9, 3.8, 4.5, 4.2, 3.8], demand: [0.6, 1.1, 2.2, 3.2, 2.9, 2.7, 2.5] },
  "14 days": { labels: ["Oct 10", "Oct 14", "Oct 18", "Oct 22", "Oct 26", "Oct 30", "Nov 03"], supply: [1.2, 2.9, 4.5, 3.8, 3.0, 3.4, 3.2], demand: [0.6, 2.2, 2.9, 2.5, 2.4, 2.6, 2.8] },
  "30 days": { labels: ["Oct 10", "Oct 17", "Oct 24", "Oct 31", "Nov 07", "Nov 14", "Nov 21"], supply: [1.2, 4.3, 3.6, 3.1, 3.3, 2.4, 1.8], demand: [0.6, 2.9, 2.4, 2.7, 2.9, 2.2, 1.9] },
};

export const CROP_PRICES = [
  { crop: "Tomatoes", price: 28, delta: 6, trend: [22, 23, 25, 24, 26, 27, 28] },
  { crop: "French Beans", price: 64, delta: 16, trend: [52, 54, 55, 58, 60, 62, 64] },
  { crop: "Rice", price: 120, delta: -2, trend: [124, 123, 123, 122, 121, 121, 120] },
];

export const IMPACT = {
  waste: [{ month: "Jun", kg: 120 }, { month: "Jul", kg: 210 }, { month: "Aug", kg: 340 }, { month: "Sep", kg: 480 }],
  income: [{ month: "Jun", kes: 3200 }, { month: "Jul", kes: 5600 }, { month: "Aug", kes: 9100 }, { month: "Sep", kes: 12800 }],
};

export const PROMPTS = [
  "What should I do with my surplus tomatoes?",
  "Which buyers pay the best price?",
  "When is the best time to harvest?",
  "What's the weather forecast?",
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export async function fetchSurplusAlerts() {
  try {
    const response = await fetch(`${API_URL}/surplus-alerts`);
    if (!response.ok) {
      throw new Error(`Backend returned HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to connect to MAVUNO AI backend:", error);
    return null;
  }
}

export async function fetchOpportunities() {
  try {
    const response = await fetch(`${API_URL}/opportunities`);
    if (!response.ok) {
      throw new Error(`Backend returned HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch opportunities from backend, falling back to static data:", err);
    return OPPS; 
  }
}