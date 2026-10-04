export const STEPS = ["Scheduled", "Picked Up", "In Transit", "Delivered"];

// stage = index of the current step; requests without stage are not scheduled yet
export const REQUESTS = [
  { id: 1, crop: "Tomatoes", kg: 5000, from: "Kirinyaga", to: "Nairobi", by: "Oct 18, 2026", status: "Pending", atRisk: true },
  { id: 2, crop: "Beans", kg: 2000, from: "Kirinyaga", to: "Thika", by: "Oct 20, 2026", status: "Accepted", stage: 0, truck: "T-052", times: ["Oct 19, 09:00"] },
  { id: 3, crop: "Maize", kg: 3000, from: "Mwea", to: "Mombasa", by: "Oct 22, 2026", status: "In Transit", stage: 2, truck: "T-045", times: ["Oct 21, 08:00", "Oct 21, 11:30", "Oct 21, 15:10"] },
  { id: 4, crop: "Onions", kg: 1500, from: "Kirinyaga", to: "Nakuru", by: "Oct 25, 2026", status: "Pending" },
  { id: 5, crop: "Avocados", kg: 1000, from: "Embu", to: "Nairobi", by: "Oct 28, 2026", status: "Planned", stage: 0, truck: null, times: ["Oct 27, 07:00"] },
];

export const STATS = { capacity: "18.5 t", saved: "KES 42,600" };
export const TRENDS = { active: "2 vs. last week", capacity: "35% vs. last week", saved: "22% vs. last week", risk: "67% vs. last week" };