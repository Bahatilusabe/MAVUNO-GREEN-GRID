import {
  LayoutDashboard,
  Leaf,
  Link2,
  MessageCircle,
  Settings,
  ShoppingCart,
  Sparkles,
  Tractor,
  Truck,
  Warehouse,
  Earth,
} from "lucide-react";

export const NAV = [
  ["overview", "Overview", LayoutDashboard],
  ["farms", "My Farms", Tractor],
  ["crops", "Crops & Harvests", Leaf],
  ["opportunities", "Green Grid Opportunities", Link2],
  ["recs", "AI Recommendations", Sparkles],
  ["market", "Market & Buyers", ShoppingCart],
  ["storage", "Storage", Warehouse],
  ["transport", "Transport", Truck],
  ["impact", "Impact", Earth],
  ["messages", "Messages", MessageCircle, true],
  ["settings", "Settings", Settings],
];

export const COUNTIES = ["Kirinyaga", "Embu", "Murang'a", "Nyeri"];
export const riskClass = (r) => `pill pill-${r.toLowerCase()}`;