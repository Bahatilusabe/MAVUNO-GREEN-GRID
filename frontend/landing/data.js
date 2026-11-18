import {
  Banknote,
  Boxes,
  BrainCircuit,
  CircleDollarSign,
  Clock3,
  Gauge,
  Leaf,
  LineChart,
  MapPin,
  PackageCheck,
  Route,
  Satellite,
  Scale,
  Sprout,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

/**
 * The landing page copy.
 *
 * The page answers five questions in order: what this is, what goes wrong
 * without it, why it exists, how the grid actually runs, and how it differs
 * from the chain a farmer already uses. Keeping the words here — rather
 * than inline in the components — makes the argument easy to review and
 * keeps the components about layout and motion.
 */

/* -------------------------------------------------------------------------- */
/*  What — the one-line definition                                             */
/* -------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: "The AI-driven agri value chain",
  title: "Move the food Kenya already grows",
  titleAccent: "to the people who need it.",
  body:
    "MAVUNO Green Grid connects every farm to every buyer, cold store, processor and truck on one shared network — sensing each plot, forecasting each harvest, and matching supply to demand before a single kilo is loaded.",
  primary: { label: "Explore the grid", href: "#how" },
  secondary: { label: "Open the app", href: "#/dashboard" },
  markers: [
    { icon: Satellite, label: "Satellite + soil sensing" },
    { icon: BrainCircuit, label: "Yield and risk forecasting" },
    { icon: Route, label: "Coordinated logistics" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Problem — what goes wrong without a grid                                   */
/* -------------------------------------------------------------------------- */

export const PROBLEMS = [
  {
    id: "loss",
    icon: Boxes,
    tone: "red",
    stat: "30–40%",
    statLabel: "of harvested weight lost between field and buyer",
    title: "Produce rots before it is ever sold",
    body:
      "Tomatoes sit for days waiting for a buyer that never comes. Nobody watching the store can see what is inside it, so the loss is discovered when it is already a loss.",
  },
  {
    id: "price",
    icon: Scale,
    tone: "amber",
    stat: "5–7 layers",
    statLabel: "between the farmer and the shelf",
    title: "The price is set by whoever shows up",
    body:
      "A farmer learns what their crop is worth only after it is loaded. The number comes from a middleman's phone call, not from what the market is actually paying that week.",
  },
  {
    id: "access",
    icon: MapPin,
    tone: "blue",
    stat: "40 km",
    statLabel: "the distance a smallholder cannot reach across",
    title: "A good buyer is often out of reach",
    body:
      "The processor needs 2,000 kg a week and the farm has 2,100 kg. The two never meet, because there is no shared place where that conversation happens.",
  },
  {
    id: "transport",
    icon: Truck,
    tone: "purple",
    stat: "≈50%",
    statLabel: "of a truck's capacity running empty",
    title: "Trucks run half empty, twice",
    body:
      "Transport is planned one farm at a time, so the return leg is wasted every single trip. The same diesel moves a third of the load it could have moved.",
  },
  {
    id: "storage",
    icon: Warehouse,
    tone: "teal",
    stat: "KES 12/day",
    statLabel: "charged to store a kilo you cannot see",
    title: "Cold storage is a landlord, not a partner",
    body:
      "You pay per day per kilo, and you still do not know the temperature, the occupancy or whether your crate is still there. Storage is a cost centre, not a decision.",
  },
  {
    id: "memory",
    icon: Clock3,
    tone: "gray",
    stat: "0",
    statLabel: "seasons of experience carried forward",
    title: "Every season starts from zero",
    body:
      "What the buyer paid last season, which route worked, which crate went bad — none of it is written down anywhere. The same mistakes are made at full cost every year.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Why — the reason the grid exists                                           */
/* -------------------------------------------------------------------------- */

export const MISSION = {
  eyebrow: "Why it exists",
  title: "Not another place to post. A network that moves food.",
  body:
    "Kenya does not have a production problem. It has a coordination problem: the crops exist, the buyers exist, the cold rooms exist, and they are not talking to each other. The grid is the layer that makes them talk — and it earns its keep by removing the friction that currently eats the margin between a field and a plate.",
  pillars: [
    {
      icon: Sprout,
      tone: "green",
      title: "Food security",
      body:
        "The same land feeds more people when less of what it grows is lost. Recovering a third of the spoilage is new food without a new farm.",
    },
    {
      icon: CircleDollarSign,
      tone: "amber",
      title: "Farmer income",
      body:
        "A farmer who can see live demand and today's clearing price is not negotiating from a position of ignorance. The price stops being whoever-arrived-first.",
    },
    {
      icon: Leaf,
      tone: "teal",
      title: "Climate and emissions",
      body:
        "Spoiled food is wasted water, land and fuel. Every tonne diverted from the bin and every empty kilometre removed is carbon that never had to be emitted.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  How — the operating loop                                                   */
/* -------------------------------------------------------------------------- */

export const STAGES = [
  {
    id: "sense",
    icon: Satellite,
    tone: "green",
    title: "Sense",
    lede: "The grid sees every plot, every day.",
    body:
      "Satellite NDVI, soil baseline, weather, storage telemetry and market signals feed one picture of the region. Nothing is reported by hand; the farm reports itself.",
    points: ["Satellite vegetation index", "Soil and water baseline", "Store telemetry and occupancy", "Live market signals"],
  },
  {
    id: "plan",
    icon: BrainCircuit,
    tone: "blue",
    title: "Plan",
    lede: "The forecast is the product.",
    body:
      "The model forecasts yield per plot, dates the harvest window, prices the risk and names the most valuable route to market. Farmers act on the forecast, not on a rumour.",
    points: ["Per-plot yield forecast", "Harvest window dating", "Risk and spoilage scoring", "Recommended action per farm"],
  },
  {
    id: "match",
    icon: Users,
    tone: "purple",
    title: "Match",
    lede: "Supply meets demand in one place.",
    body:
      "Buyers, processors, cold stores and transporters are matched to supply by volume, distance, price and capacity — and to the farmer as a named, direct conversation.",
    points: ["Volume, distance and price", "Cold storage and haulage", "Named counterparties", "Direct chat and agreement"],
  },
  {
    id: "move",
    icon: PackageCheck,
    tone: "amber",
    title: "Move",
    lede: "The logistics are planned together.",
    body:
      "Collections are pooled so trucks load both ways, storage is booked against a real harvest date, and every handover is timed. Less spoilage, fewer empty kilometres.",
    points: ["Pooled collections", "Booked storage capacity", "Timed handovers", "Live delivery tracking"],
  },
  {
    id: "learn",
    icon: LineChart,
    tone: "teal",
    title: "Learn",
    lede: "The grid remembers, and gets sharper.",
    body:
      "Every deal, price, delay and loss goes back into the model. Next season the grid starts where this one finished — and it loops straight back into sensing.",
    points: ["Price and yield history", "Loss attribution", "Route performance", "Model retraining each season"],
    loop: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Difference — how it compares with the chain a farmer already uses          */
/* -------------------------------------------------------------------------- */

export const COMPARISONS = [
  {
    dimension: "Who sets the price",
    usual: "A middleman, from a phone call, on the day",
    grid: "The market, from live demand and posted bids",
  },
  {
    dimension: "What you know",
    usual: "Your own harvest, and your own guess at the rest",
    grid: "Supply, demand, price and risk, in one picture",
  },
  {
    dimension: "Information freshness",
    usual: "Seasonal, local and verbal",
    grid: "Per plot, per day, from satellite and sensors",
  },
  {
    dimension: "Transport",
    usual: "Planned one farm at a time, half the leg empty",
    grid: "Pooled across the grid and loaded in both directions",
  },
  {
    dimension: "Storage",
    usual: "Whatever space you can pay for, blind",
    grid: "Matched to the crop and the date it must move",
  },
  {
    dimension: "Buying and selling",
    usual: "A broker, a commission and no direct line",
    grid: "Named counterparty, chat, agreed price, no middleman",
  },
  {
    dimension: "Memory",
    usual: "Every season starts from zero",
    grid: "Every deal and loss is recorded and reused",
  },
  {
    dimension: "How failure shows up",
    usual: "As spoilage, discovered far too late",
    grid: "As a diverted load, caught while it is still a load",
  },
];

export const DIFFERENCES = [
  {
    icon: Gauge,
    tone: "green",
    title: "It is a network, not a marketplace",
    body:
      "The value is in the links between farms, stores, buyers and trucks — not in the listings. Two farms with a shared cold room and a shared truck are worth more together than either is alone.",
  },
  {
    icon: BrainCircuit,
    tone: "purple",
    title: "It plans before it reacts",
    body:
      "Most systems respond to a shortage after it has started. The grid forecasts the harvest window first, so the truck, the store and the buyer are ready before the produce exists.",
  },
  {
    icon: LineChart,
    tone: "blue",
    title: "It remembers",
    body:
      "Price history, loss patterns and route performance compound into next season's advantage. The third year of the grid is a different product from the first.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Impact — the numbers the grid is judged on                                */
/* -------------------------------------------------------------------------- */

export const IMPACT_STATS = [
  { value: 32, suffix: "%", label: "of post-harvest loss avoided", hint: "Diverted before it spoils" },
  { value: 4.5, suffix: "x", label: "more income per tonne", decimals: 1, hint: "Direct buyer, agreed price" },
  { value: 41, suffix: "%", label: "less empty running", hint: "Pooled, two-way collections" },
  { value: 12.6, suffix: " t", label: "CO₂e avoided per season", decimals: 1, hint: "Across the demo cohort" },
];

export const IMPACT_SOURCES = [
  { name: "Avoided spoilage", value: 32, color: "blue" },
  { name: "Optimised transport", value: 24, color: "green" },
  { name: "Storage", value: 18, color: "amber" },
  { name: "Processing", value: 15, color: "purple" },
  { name: "Recovery", value: 11, color: "indigo" },
];

/* -------------------------------------------------------------------------- */
/*  Portals — the four working areas                                          */
/* -------------------------------------------------------------------------- */

export const PORTALS = [
  {
    href: "#/dashboard",
    icon: Gauge,
    tone: "green",
    title: "Farmer dashboard",
    body: "Signals, forecasts, crop stage and the day's recommendations at a glance.",
    points: ["At-a-glance KPIs", "Harvest outlook", "Weather and risk", "Today's actions"],
  },
  {
    href: "#/farmer",
    icon: Sprout,
    tone: "blue",
    title: "Farmer portal",
    body: "Farms, crops, market, storage, transport and impact — the whole working life of a farm.",
    points: ["Farm and crop records", "Market and buyers", "Storage and transport", "Impact reporting"],
  },
  {
    href: "#/admin",
    icon: Banknote,
    tone: "purple",
    title: "Admin console",
    body: "Users, partners, alerts and the health of the grid itself.",
    points: ["User and partner management", "Alerts and anomalies", "System health", "Activity log"],
  },
  {
    href: "#/partner",
    icon: Truck,
    tone: "amber",
    title: "Partner portal",
    body: "Requests, orders, capacity and pricing for buyers, stores and transporters.",
    points: ["Incoming requests", "Order pipeline", "Capacity and pricing", "Listings and fulfilment"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Footer                                                                     */
/* -------------------------------------------------------------------------- */

export const FOOTER_LINKS = [
  {
    heading: "The platform",
    links: [
      { label: "Farmer dashboard", href: "#/dashboard" },
      { label: "Farmer portal", href: "#/farmer" },
      { label: "Partner portal", href: "#/partner" },
      { label: "Admin console", href: "#/admin" },
    ],
  },
  {
    heading: "On this page",
    links: [
      { label: "The problem", href: "#problem" },
      { label: "Why it exists", href: "#why" },
      { label: "How the grid runs", href: "#how" },
      { label: "What makes it different", href: "#different" },
    ],
  },
];
