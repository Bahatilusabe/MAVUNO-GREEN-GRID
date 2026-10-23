import {
  Earth,
  CloudSun,
  LayoutDashboard,
  Leaf,
  Link2,
  MessageCircle,
  MessagesSquare,
  Settings,
  ShoppingCart,
  Sparkles,
  Tractor,
  Truck,
  Warehouse,
  Home,
  Sprout,
  Handshake,
  ShieldCheck,
} from "lucide-react";

export const FARMER_NAV = [
  ["overview", "Overview", LayoutDashboard],
  ["farms", "My Farms", Tractor],
  ["crops", "Crops & Harvests", Leaf],
  ["opportunities", "Green Grid Opportunities", Link2],
  ["recs", "AI Recommendations", Sparkles],
  ["market", "Market & Buyers", ShoppingCart],
  ["chat", "Buyer Chat", MessagesSquare],
  ["storage", "Storage", Warehouse],
  ["transport", "Transport", Truck],
  ["weather", "Weather", CloudSun],
  ["impact", "Impact", Earth],
  ["messages", "Messages", MessageCircle, 2],
  ["settings", "Settings", Settings],
];

export const FARMER_USER = { name: "Samuel Kamau", sub: "Kirinyaga County", initials: "SK" };

/**
 * The platforms a user can move between. The old "Switch view" link pointed
 * at "#/" and the floating switcher was a separate widget; both now resolve
 * from this one list, so the topbar switcher and the sidebar agree.
 */
export const VIEWS = [
  { path: "/", label: "Home", description: "Platform overview", icon: Home },
  { path: "/dashboard", label: "Farmer dashboard", description: "Signals and forecasts", icon: LayoutDashboard },
  { path: "/farmer", label: "Farmer portal", description: "Farms, crops and market", icon: Sprout },
  { path: "/partner", label: "Partner portal", description: "Requests, orders, capacity", icon: Handshake },
  { path: "/admin", label: "Admin console", description: "Users, partners, health", icon: ShieldCheck },
];

/** Hash routing helper shared by the shell, the switcher and the app shell. */
export function navigate(to) {
  if (window.location.hash.replace(/^#/, "") === to) return;
  window.location.hash = to;
}

/** The view that owns a given hash path, used to highlight the switcher. */
export function activeView(path) {
  const clean = (path || "/").split("/").filter(Boolean)[0];
  if (!clean) return "/";
  return `/${clean}`;
}
