export const RESERVE_KG = 1800;

export const FACILITIES = [
  { id: 1, name: "Kirinyaga Coop Store", type: "Cold Store", available: 12.5, reserved: 5.1, km: 8.3, cost: 12000, crops: "Tomato, Beans, Fruits", score: 92, x: 30, y: 45 },
  { id: 2, name: "Green Valley Cold Store", type: "Refrigerated", available: 10.2, reserved: 3.6, km: 12.5, cost: 10500, crops: "Tomato, Fruits, Veg", score: 84, x: 56, y: 22 },
  { id: 3, name: "Mwea Storage", type: "Warehouse", available: 8.7, reserved: 4.2, km: 24.7, cost: 8000, crops: "Maize, Beans, Rice", score: 76, x: 70, y: 70 },
  { id: 4, name: "Embu Agri Store", type: "Cold Store", available: 6.4, reserved: 2.8, km: 36.2, cost: 9500, crops: "Tomato, Avocado", score: 68, x: 82, y: 40 },
  { id: 5, name: "Nairobi Central", type: "Warehouse", available: 5.8, reserved: 2.5, km: 52.6, cost: 7500, crops: "All crops", score: 61, x: 18, y: 80 },
];

export const RESERVATIONS_INIT = [
  { id: 1, facility: "Kirinyaga Coop Store", crop: "Tomatoes", kg: 2000, status: "Confirmed", date: "Oct 18, 2026" },
  { id: 2, facility: "Green Valley Cold Store", crop: "Tomatoes", kg: 1500, status: "Pending", date: "Oct 20, 2026" },
  { id: 3, facility: "Mwea Storage", crop: "Beans", kg: 1000, status: "Confirmed", date: "Oct 22, 2026" },
];

export const STAT_TRENDS = {
  facilities: "1 vs. last week",
  available: "16% vs. last week",
  reserved: "32% vs. last week",
  risk: "50% vs. last week",
};