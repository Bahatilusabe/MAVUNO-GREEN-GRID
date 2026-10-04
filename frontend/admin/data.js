export const USERS = [
  { id: 1, name: "Samuel Kamau", county: "Kirinyaga", farms: 3, tons: 9.8, status: "Active", joined: "2026-03-12" },
  { id: 2, name: "Grace Wanjiru", county: "Murang'a", farms: 2, tons: 5.1, status: "Active", joined: "2026-04-02" },
  { id: 3, name: "Peter Mwangi", county: "Nyeri", farms: 1, tons: 1.9, status: "Pending", joined: "2026-09-28" },
  { id: 4, name: "Mary Njeri", county: "Embu", farms: 4, tons: 12.4, status: "Active", joined: "2026-02-19" },
  { id: 5, name: "John Otieno", county: "Kirinyaga", farms: 1, tons: 0.9, status: "Suspended", joined: "2026-05-30" },
  { id: 6, name: "Faith Muthoni", county: "Machakos", farms: 2, tons: 3.3, status: "Pending", joined: "2026-10-01" },
  { id: 7, name: "David Kiprop", county: "Nyeri", farms: 3, tons: 7.2, status: "Active", joined: "2026-06-14" },
  { id: 8, name: "Lucy Achieng", county: "Embu", farms: 1, tons: 2.0, status: "Active", joined: "2026-08-08" },
];

export const PARTNERS = [
  { id: 1, name: "Kirieyaga Cold Storage", type: "Storage", county: "Kirinyaga", status: "Approved" },
  { id: 2, name: "Wakulima Transporters", type: "Transport", county: "Kirinyaga", status: "Approved" },
  { id: 3, name: "Mt. Kenya Fresh Co.", type: "Buyer", county: "Nyeri", status: "Pending" },
  { id: 4, name: "Kagio Juice Processors", type: "Processor", county: "Kirinyaga", status: "Approved" },
  { id: 5, name: "Savanna Haulers", type: "Transport", county: "Machakos", status: "Pending" },
];

export const COUNTY_RISK = [
  { county: "Kirinyaga", risk: 74 },
  { county: "Murang'a", risk: 58 },
  { county: "Nyeri", risk: 41 },
  { county: "Embu", risk: 33 },
  { county: "Machakos", risk: 19 },
];

export const WASTE = [
  { m: "Apr", t: 4.1 }, { m: "May", t: 6.3 }, { m: "Jun", t: 8.8 },
  { m: "Jul", t: 11.2 }, { m: "Aug", t: 14.6 }, { m: "Sep", t: 18.9 },
];

export const ALERTS_INIT = [
  { id: 1, level: "High", text: "Tomato surplus risk spiking in Kirinyaga (1,800 kg unmatched)" },
  { id: 2, level: "Medium", text: "Cold storage capacity above 85% in Kirinyaga" },
  { id: 3, level: "Medium", text: "2 partner applications waiting over 48 hours" },
  { id: 4, level: "Low", text: "Weather API latency above normal" },
];

export const HEALTH = [
  ["API", "Operational", "ok"],
  ["Database", "Operational", "ok"],
  ["SMS gateway", "Degraded", "warn"],
  ["AI engine", "Operational", "ok"],
];