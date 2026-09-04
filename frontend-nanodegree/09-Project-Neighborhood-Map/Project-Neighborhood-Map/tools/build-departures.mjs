#!/usr/bin/env node
/**
 * build-departures.mjs
 * -------------------------------------------------------------------------
 * Builds a *scheduled* (not live) "next departures" dataset from TransLink's
 * GTFS Static feed: for every boardable stop, every departure time on a
 * representative weekday, resolved the same way a GTFS consumer resolves
 * "what runs today" — calendar.txt's weekly pattern, adjusted by
 * calendar_dates.txt's per-date exceptions (TransLink expresses most of its
 * service through exceptions, not the weekly pattern, so both are required).
 *
 * TransLink's real-time arrivals API (RTTI) needs a registered key and has
 * no browser CORS, so it can't be called from this static site without a
 * server-side proxy. This is the honest client-side alternative: the actual
 * published timetable, clearly labeled as scheduled rather than live.
 *
 * All stops' full-day schedules together run ~11 MB — too large to ship
 * upfront — so the output is sharded by `stop_id % SHARD_COUNT` and the app
 * fetches only the shard for a stop the user actually opens.
 *
 * Usage: same arguments as build-data.mjs (zip path / extracted dir / none).
 * -------------------------------------------------------------------------
 */

import { writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import {
  forEachRow, resolveGtfsDir, loadRouteNames, loadBoardableStopIds,
} from './gtfsUtil.mjs';

const OUT_DIR = path.resolve(import.meta.dirname, '..', 'data', 'departures');
const SHARD_COUNT = 60;
const DOW = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** Today if it's a weekday, otherwise the coming Monday — keeps the build
 *  deterministic and always resolves to genuine weekday service. */
function pickWeekdayDate() {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  if (day === 0) d.setDate(d.getDate() + 1);
  else if (day === 6) d.setDate(d.getDate() + 2);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day2 = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day2}`;
}

async function activeServiceIds(dir, dateStr) {
  const dow = DOW[new Date(`${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T00:00:00`).getDay()];
  const active = new Set();
  await forEachRow(path.join(dir, 'calendar.txt'), (r) => {
    if (r.start_date <= dateStr && dateStr <= r.end_date && r[dow] === '1') active.add(r.service_id);
  });
  try {
    await forEachRow(path.join(dir, 'calendar_dates.txt'), (r) => {
      if (r.date !== dateStr) return;
      if (r.exception_type === '1') active.add(r.service_id);
      else active.delete(r.service_id);
    });
  } catch { /* calendar_dates.txt is optional per spec */ }
  return active;
}

function parseTimeToMinutes(hms) {
  const [h, m] = hms.split(':');
  const hours = Number(h);
  const minutes = Number(m);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes; // GTFS allows hours >= 24 for post-midnight trips — kept as-is
}

async function main() {
  const { dir, cleanup } = await resolveGtfsDir(process.argv[2]);
  try {
    const dateStr = pickWeekdayDate();
    console.log(`Building scheduled departures for ${dateStr} (weekday)`);

    const routeName = await loadRouteNames(dir);
    const boardable = await loadBoardableStopIds(dir);
    const services = await activeServiceIds(dir, dateStr);
    console.log(`active services: ${services.size}`);

    // route dictionary: assign a small integer index to each route name
    const routeIndex = new Map();
    function indexOf(name) {
      let i = routeIndex.get(name);
      if (i === undefined) { i = routeIndex.size; routeIndex.set(name, i); }
      return i;
    }

    // trip_id -> route index, but only for trips running on the target date
    const tripRouteIdx = new Map();
    await forEachRow(path.join(dir, 'trips.txt'), (r) => {
      if (!services.has(r.service_id)) return;
      const name = routeName.get(r.route_id) || r.route_id;
      tripRouteIdx.set(r.trip_id, indexOf(name));
    });
    console.log(`trips running: ${tripRouteIdx.size}`);

    const perStop = new Map(); // stop_id -> [ [routeIdx, minutes], ... ]
    let rows = 0;
    await forEachRow(path.join(dir, 'stop_times.txt'), (r) => {
      rows++;
      if (!boardable.has(r.stop_id)) return;
      const rIdx = tripRouteIdx.get(r.trip_id);
      if (rIdx === undefined) return;
      const minutes = parseTimeToMinutes(r.departure_time || r.arrival_time || '');
      if (minutes === null) return;
      let list = perStop.get(r.stop_id);
      if (!list) { list = []; perStop.set(r.stop_id, list); }
      list.push([rIdx, minutes]);
    });
    console.log(`stop_times rows scanned: ${rows}, stops with departures: ${perStop.size}`);

    for (const list of perStop.values()) list.sort((a, b) => a[1] - b[1]);

    await rm(OUT_DIR, { recursive: true, force: true });
    await mkdir(OUT_DIR, { recursive: true });

    const shards = Array.from({ length: SHARD_COUNT }, () => ({}));
    for (const [stopId, list] of perStop) {
      shards[Number(stopId) % SHARD_COUNT][stopId] = list;
    }

    let totalBytes = 0;
    for (let i = 0; i < SHARD_COUNT; i++) {
      const json = JSON.stringify(shards[i]);
      totalBytes += Buffer.byteLength(json);
      await writeFile(path.join(OUT_DIR, `shard-${i}.json`), json);
    }

    const routes = [...routeIndex.keys()];
    const manifest = {
      source: 'TransLink GTFS Static',
      note: 'Scheduled departures from the published timetable — not live/real-time arrivals.',
      serviceDate: dateStr,
      serviceLabel: 'weekday',
      shardCount: SHARD_COUNT,
      stopCount: perStop.size,
      routes,
    };
    await writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest));

    console.log(`\nWrote ${SHARD_COUNT} shards + manifest.json to ${OUT_DIR}`);
    console.log(`  ${perStop.size} stops, ${routes.length} routes, ${(totalBytes / 1024).toFixed(0)} KB total (~${(totalBytes / SHARD_COUNT / 1024).toFixed(0)} KB/shard)`);
  } finally {
    await cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
