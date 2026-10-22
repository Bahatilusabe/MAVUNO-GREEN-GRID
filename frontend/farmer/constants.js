export const COUNTIES = ["Kirinyaga", "Embu", "Murang'a", "Nyeri"];

/** The counties a farmer can filter the portal by, plus the "no filter" entry. */
export const COUNTY_OPTIONS = ["All counties", ...COUNTIES];

/** Maps a risk level string (Low, Medium, High) to a Tailwind CSS class for badges. */
export function riskClass(risk) {
  switch (risk?.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "high":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
