// kind: alert | message | system. Newest first, id ascending = recency.
export const NOTIFICATIONS = [
  { id: 1, kind: "alert", icon: "risk", tone: "amber", title: "High surplus risk detected", text: "Tomatoes, Kiambaina Farm. Act within 72 hours.", ago: "2h ago", unread: true, action: { label: "View plan", to: "recs" } },
  { id: 2, kind: "message", icon: "deal", tone: "green", title: "Buyer A accepted your offer", text: "1,200 kg tomatoes", ago: "3h ago", unread: true, action: { label: "View buyers", to: "market" } },
  { id: 3, kind: "message", icon: "truck", tone: "green", title: "Transporter assigned", text: "KCC 342A for 1,500 kg", ago: "5h ago", unread: false, action: { label: "Track", to: "transport" } },
  { id: 4, kind: "message", icon: "storage", tone: "blue", title: "Storage reservation confirmed", text: "Kirinyaga Cold Storage", ago: "6h ago", unread: false, action: { label: "View", to: "storage" } },
  { id: 5, kind: "system", icon: "price", tone: "amber", title: "Market price update", text: "Tomatoes up 12% in Nairobi", ago: "1d ago", unread: false, action: { label: "Market", to: "market" } },
  { id: 6, kind: "alert", icon: "weather", tone: "red", title: "Weather alert", text: "Heavy rain expected in Kirinyaga", ago: "1d ago", unread: false },
];