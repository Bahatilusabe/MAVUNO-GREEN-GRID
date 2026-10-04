import {
  Earth,
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
} from "lucide-react";

export const FARMER_NAV = [
  ["overview", "Overview", LayoutDashboard],
  ["farms", "My Farms", Tractor],
  ["crops", "Crops & Harvests", Leaf],
  ["opportunities", "Green Grid Opportunities", Link2],
  ["recs", "AI Recommendations", Sparkles],
  ["market", "Market & Buyers", ShoppingCart],
  ["storage", "Storage", Warehouse],
  ["transport", "Transport", Truck],
  ["impact", "Impact", Earth],
  ["messages", "Messages", MessageCircle, 2],
  ["settings", "Settings", Settings],
];

export const FARMER_USER = { name: "Samuel Kamau", sub: "Kirinyaga County", initials: "SK" };