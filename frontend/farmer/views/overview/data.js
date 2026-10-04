import {
  AlertTriangle,
  Building2,
  Handshake,
  Leaf,
  Recycle,
  Snowflake,
  TrendingDown,
  Truck,
  Warehouse,
  Wheat,
  Droplets,
  Cloud,
} from "lucide-react";

export const STAT_TRENDS = {
  farms: "↑ 1 new farm this month",
  harvest: "↑ 12% vs. last 4 weeks",
  risk: "↑ 45% vs. last 4 weeks",
  value: "↑ 18% vs. last 4 weeks",
};

export const VALUE_PROTECTED = 184000;
export const CONFIDENCE = 87;
export const HOURS_TO_WINDOW = 72;

export const FACTORS = [
  [TrendingDown, "Local demand", "Low", "–"],
  [Wheat, "Expected supply", "High", "↑"],
  [Warehouse, "Available storage", "Limited", "–"],
];

export const TODAY_RECS = [
  { icon: Snowflake, title: "Reserve cold storage", text: "Your tomatoes will maintain quality and reduce losses by up to 40%.", cta: "Reserve Now", to: "storage" },
  { icon: Building2, title: "Connect with processor", text: "Local processor is buying tomatoes at KES 20/kg.", cta: "View Buyers", to: "market" },
  { icon: Truck, title: "Bundle transport capacity", text: "Combine with nearby farms to reduce transport costs by 28%.", cta: "Plan Transport", to: "transport" },
];

export const OUTLOOK = {
  labels: ["Oct 12", "Oct 19", "Oct 26", "Nov 02", "Nov 09", "Nov 16"],
  supply: [3.2, 4.8, 4.4, 6.5, 5.7, 5.0],
  demand: [2.5, 3.7, 3.1, 4.5, 3.4, 3.8],
};

export const ACTIVITY = [
  { icon: AlertTriangle, title: "AI risk detected", sub: "Tomatoes – surplus risk identified", ago: "2h ago", danger: true },
  { icon: Handshake, title: "Buyer matched", sub: "Local processor – KES 20/kg", ago: "4h ago" },
  { icon: Warehouse, title: "Storage reserved", sub: "Cold storage – 2,000 kg", ago: "6h ago" },
  { icon: Truck, title: "Transport request pending", sub: "Kutus Farm – 1,500 kg", ago: "8h ago" },
];

export const ENV = [
  [Leaf, "Produce saved", "7.2 t", "from post-harvest loss"],
  [Recycle, "Waste avoided", "4.3 t", "food waste prevented"],
  [Cloud, "CO₂e avoided", "12.6 t", "carbon footprint reduction"],
  [Droplets, "Water efficiency", "28%", "less water per kg"],
];