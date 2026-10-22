import { titleStatus } from "../shared/status";

/**
 * The dashboard renders one shape, whatever the source.
 *
 * The API reports a crop on a farm ("Tomatoes" on "Kiambaina Farm"); the
 * sample fixtures report a farm that grows one crop. Both arrive here and
 * leave as a row the cards can draw.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-18" -> "18 Oct 2026". Unparseable dates are passed through. */
export function formatDate(value) {
  if (!value) return "TBD";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** The API's crop rows -> the rows the crop card draws. */
export function toCropRows(api) {
  if (!Array.isArray(api?.harvests) || !api.harvests.length) return null;

  return api.harvests.map((h) => ({
    id: h.farmId ?? h.id,
    cropId: h.id,
    name: h.farm || "Unnamed farm",
    crop: h.name || "Crop",
    stage: h.stage || "—",
    kg: Number(h.expectedKg || 0),
    harvest: formatDate(h.expectedHarvest),
    risk: titleStatus(h.risk || "low"),
  }));
}

/** The sample fixtures -> the same row shape, so the card never changes. */
export function toSampleRows(farms) {
  return farms.map((f) => ({
    id: f.id,
    cropId: f.id,
    name: f.name,
    crop: f.crop,
    stage: f.stage || "—",
    kg: Number(f.kg || 0),
    harvest: f.harvest,
    risk: f.risk,
    perf: f.perf,
  }));
}

/**
 * The alert banner picks the worst surplus alert.
 *
 * The old comparison was `alert.risk > highest.risk`, which compares two
 * numbers as strings: "0.9" beats "0.75" only by luck, and "0.95" loses to
 * "0.9". The risk is a 0-1 score, so it is compared as a number.
 */
export function worstAlert(alerts) {
  if (!Array.isArray(alerts) || !alerts.length) return null;

  return alerts.reduce((worst, alert) => {
    if (!worst) return alert;
    return Number(alert.risk || 0) > Number(worst.risk || 0) ? alert : worst;
  }, null);
}

/** The API's activity feed -> the rows the activity card draws. */
export function toActivityRows(activity) {
  if (!Array.isArray(activity) || !activity.length) return null;

  return activity.map((n) => ({
    key: n.id,
    title: n.title,
    sub: n.body,
    tone: n.tone,
    danger: n.kind === "alert",
    when: n.createdAt ? formatDate(n.createdAt) : "",
  }));
}
