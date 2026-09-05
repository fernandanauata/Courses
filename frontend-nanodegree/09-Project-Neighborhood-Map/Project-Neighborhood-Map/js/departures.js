// Loads the sharded "scheduled departures" dataset built by
// tools/build-departures.mjs — lazily, and only for stops the user actually
// opens, since the full dataset (~7 MB) is too large to fetch upfront.
//
// This is TransLink's *published timetable*, not a live vehicle feed: true
// real-time predictions need TransLink's RTTI API, which requires a
// registered key and has no browser CORS, so it isn't reachable from this
// static site without a server-side proxy.

let manifestPromise;
const shardPromises = new Map();

function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('data/departures/manifest.json').then((res) => {
      if (!res.ok) throw new Error(`Failed to load departures manifest (HTTP ${res.status})`);
      return res.json();
    });
  }
  return manifestPromise;
}

function loadShard(shardIndex) {
  if (!shardPromises.has(shardIndex)) {
    shardPromises.set(shardIndex, fetch(`data/departures/shard-${shardIndex}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load departures shard ${shardIndex} (HTTP ${res.status})`);
      return res.json();
    }));
  }
  return shardPromises.get(shardIndex);
}

function formatClock(minutes) {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Returns { serviceLabel, serviceDate, departures: [{ route, time, minutesFromNow }] }
 * for the next `limit` scheduled departures at `stop` from the current time
 * of day. Throws if the dataset can't be loaded.
 */
export async function getUpcomingDepartures(stop, { limit = 5, now = new Date() } = {}) {
  const manifest = await loadManifest();
  const shardIndex = Number(stop.id) % manifest.shardCount;
  const shard = await loadShard(shardIndex);
  const entries = shard[stop.id] || [];

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const upcoming = entries
    .filter(([, minutes]) => minutes >= nowMinutes)
    .slice(0, limit)
    .map(([routeIdx, minutes]) => ({
      route: manifest.routes[routeIdx],
      time: formatClock(minutes),
      minutesFromNow: minutes - nowMinutes,
    }));

  return {
    serviceLabel: manifest.serviceLabel,
    serviceDate: manifest.serviceDate,
    totalToday: entries.length,
    departures: upcoming,
  };
}
