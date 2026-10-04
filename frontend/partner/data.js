export const REQUESTS_INIT = [
  { id: 1, farmer: "Samuel Kamau", crop: "Tomatoes", kg: 900, county: "Kirinyaga", km: 12, price: 20, date: "Oct 18, 2026", status: "Pending" },
  { id: 2, farmer: "David Kiprop", crop: "Tomatoes", kg: 700, county: "Nyeri", km: 45, price: 20, date: "Oct 20, 2026", status: "Pending" },
  { id: 3, farmer: "Lucy Achieng", crop: "Tomatoes", kg: 1500, county: "Embu", km: 38, price: 20, date: "Oct 22, 2026", status: "Pending" },
  { id: 4, farmer: "Faith Muthoni", crop: "Tomatoes", kg: 300, county: "Machakos", km: 60, price: 20, date: "Oct 25, 2026", status: "Pending" },
];

export const ORDERS_INIT = [
  { id: 100, farmer: "Mary Njeri", crop: "Tomatoes", kg: 800, price: 19, date: "Oct 01, 2026", status: "Delivered" },
  { id: 101, farmer: "Samuel Kamau", crop: "Tomatoes", kg: 600, price: 20, date: "Oct 12, 2026", status: "In transit" },
  { id: 102, farmer: "Grace Wanjiru", crop: "Tomatoes", kg: 400, price: 20, date: "Oct 14, 2026", status: "Scheduled" },
];

export const STEPS = ["Scheduled", "In transit", "Delivered"];
export const NEXT_LABEL = { Scheduled: "Mark in transit", "In transit": "Mark delivered" };

export const WEEKLY = [
  { day: "Mon", kg: 420 }, { day: "Tue", kg: 560 }, { day: "Wed", kg: 380 },
  { day: "Thu", kg: 790 }, { day: "Fri", kg: 640 }, { day: "Sat", kg: 310 }, { day: "Sun", kg: 120 },
];