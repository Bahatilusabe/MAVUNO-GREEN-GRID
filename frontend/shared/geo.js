// shared/geo.js
export function parseCoords(s) {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/.exec(s ?? "");
  return m ? { lat: +m[1], lng: +m[2] } : null;
}