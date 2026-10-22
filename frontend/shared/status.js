/**
 * One status vocabulary for the whole platform.
 *
 * The four portals each had their own badge map, and several of them did not
 * match the values actually stored (a "Scheduled" order rendered grey, every
 * recommendation rendered grey). These maps are keyed by the normalised
 * status, so a value that the API produces and a value the fixtures produce
 * land on the same colour.
 */

/** "In_transit", "in transit" and "In Transit" all become "in transit". */
export const normalizeStatus = (value) =>
  String(value ?? "")
    .replace(/_/g, " ")
    .trim()
    .toLowerCase();

/** "in transit" -> "In transit", for display. */
export const titleStatus = (value) => {
  const flat = normalizeStatus(value);
  return flat ? flat.charAt(0).toUpperCase() + flat.slice(1) : "";
};

const REQUEST_TONES = {
  pending: "warning",
  scheduled: "info",
  "in transit": "info",
  delivered: "success",
  declined: "danger",
  cancelled: "neutral",
  completed: "success",
  confirmed: "success",
  accepted: "success",
  planned: "info",
  "in progress": "info",
  active: "success",
  suspended: "danger",
};

const RISK_TONES = { high: "danger", medium: "warning", low: "success" };
const PARTNER_TONES = { approved: "success", pending: "warning", rejected: "danger" };
const ALERT_TONES = { high: "danger", medium: "warning", low: "info" };

/** Match request / order status -> badge tone. */
export const statusTone = (value) => REQUEST_TONES[normalizeStatus(value)] ?? "neutral";

/** User account status -> badge tone. */
export const userStatusTone = (value) => REQUEST_TONES[normalizeStatus(value)] ?? "neutral";

/** Partner approval status -> badge tone. */
export const partnerStatusTone = (value) => PARTNER_TONES[normalizeStatus(value)] ?? "neutral";

/** Crop risk level -> badge tone. */
export const riskTone = (value) => RISK_TONES[normalizeStatus(value)] ?? "neutral";

/** Alert severity -> badge tone. */
export const alertTone = (value) => ALERT_TONES[normalizeStatus(value)] ?? "neutral";

/** The tone a recommendation should use, from its own `tone` field. */
export const recommendationTone = (value) => {
  const flat = normalizeStatus(value);
  if (flat === "danger" || flat === "high") return "danger";
  if (flat === "warning" || flat === "amber" || flat === "medium") return "warning";
  if (flat === "info" || flat === "blue") return "info";
  if (flat === "success" || flat === "green" || flat === "low") return "success";
  return "neutral";
};
