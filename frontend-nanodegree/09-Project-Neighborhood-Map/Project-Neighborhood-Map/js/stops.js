// GTFS wheelchair_boarding values, per the spec:
// 0/unset = no info, 1 = accessible, 2 = not accessible.
export const ACCESSIBLE = 1;
export const NOT_ACCESSIBLE = 2;

export function isAccessible(stop) {
  return stop.wheelchair === ACCESSIBLE;
}

export function accessibilityLabel(stop) {
  if (stop.wheelchair === ACCESSIBLE) return 'Wheelchair accessible';
  if (stop.wheelchair === NOT_ACCESSIBLE) return 'Not wheelchair accessible';
  return 'Accessibility not reported';
}

// TransLink stop names look like "Southbound Howe St @ Davie St" or
// "Waterfront Station @ Platform 1" — split off the leading direction so
// it can be styled separately in the UI.
const DIRECTION_RE = /^(Northbound|Southbound|Eastbound|Westbound)\s+/i;

export function splitStopName(name) {
  const match = name.match(DIRECTION_RE);
  return match
    ? { direction: match[1], place: name.slice(match[0].length) }
    : { direction: null, place: name };
}

export function scheduleUrl(stop) {
  return `https://translink.ca/schedules-and-maps/stop/${encodeURIComponent(stop.code)}/schedule`;
}

export function matchesQuery(stop, rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  if (stop.name.toLowerCase().includes(query)) return true;
  // Prefix match on the stop code/route number (not substring) — otherwise
  // a route search like "99" also matches unrelated stop codes that merely
  // contain "99" somewhere in their five digits.
  if (stop.code.startsWith(query)) return true;
  return stop.routes.some((route) => route.toLowerCase().startsWith(query));
}

export async function loadStops() {
  const res = await fetch('data/stops.json');
  if (!res.ok) throw new Error(`Failed to load stop data (HTTP ${res.status})`);
  return res.json();
}
