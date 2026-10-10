export const STATS = { produce: "7.2 t", value: "KES 184,000", co2: "12.6 t", water: "28%" };
export const TRENDS = { produce: "18% vs. last month", value: "26% vs. last month", co2: "32% vs. last month", water: "14% vs. last month" };
export const TOTAL_IMPACT = "7.2 t";

// produce: t saved, value: KES 100k, co2: t avoided (sample data, oldest first)
export const SERIES = [
  { month: "Nov", produce: 1.2, value: 2.1, co2: 2.0 },
  { month: "Dec", produce: 1.8, value: 2.8, co2: 3.1 },
  { month: "Jan", produce: 2.4, value: 3.9, co2: 4.4 },
  { month: "Feb", produce: 3.0, value: 4.6, co2: 5.2 },
  { month: "Mar", produce: 3.6, value: 6.1, co2: 6.0 },
  { month: "Apr", produce: 4.4, value: 7.4, co2: 7.9 },
  { month: "May", produce: 5.0, value: 8.8, co2: 10.5 },
  { month: "Jun", produce: 5.8, value: 9.9, co2: 11.2 },
  { month: "Jul", produce: 10.0, value: 12.9, co2: 14.0 },
  { month: "Aug", produce: 7.0, value: 11.2, co2: 12.2 },
  { month: "Sep", produce: 8.0, value: 12.6, co2: 13.8 },
  { month: "Oct", produce: 12.5, value: 17.5, co2: 14.5 },
];

import { COLORS } from "../../../shared/chartColors";

export const SOURCES = [
  { name: "Avoided Spoilage", value: 32, color: COLORS.blue },
  { name: "Optimized Transport", value: 24, color: COLORS.green },
  { name: "Storage", value: 18, color: COLORS.amber },
  { name: "Processing", value: 15, color: COLORS.purple },
  { name: "Recovery", value: 11, color: "var(--color-indigo)" },
];

export const FLOW = { produce: "7.2 t saved", market: "4.3 t sold", processing: "1.8 t processed", recovery: "1.1 t compost / biogas" };

export const REPORTS = [
  { id: 1, title: "Monthly Impact Report", sub: "September 2026", size: "PDF · 2.4 MB" },
  { id: 2, title: "Carbon Footprint Report", sub: "Q3 2026", size: "PDF · 1.8 MB" },
];

export const INTERVENTIONS = [
  { id: 1, date: "Oct 16, 2026", title: "Tomatoes – 3,600 kg", sub: "Redirected to Processor B", status: "Completed" },
  { id: 2, date: "Oct 14, 2026", title: "Maize – 2,000 kg", sub: "Transported to Nairobi", status: "Completed" },
  { id: 3, date: "Oct 12, 2026", title: "Beans – 1,500 kg", sub: "Stored at Facility C", status: "In Progress" },
];