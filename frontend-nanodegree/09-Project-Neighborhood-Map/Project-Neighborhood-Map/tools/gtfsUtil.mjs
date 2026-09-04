// Shared helpers for downloading/parsing TransLink's GTFS Static feed.
// Used by both build-data.mjs (stops) and build-departures.mjs (schedules).

import { createReadStream } from 'node:fs';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const GTFS_URL = 'https://gtfs-static.translink.ca/gtfs/google_transit.zip';

/** Parse one CSV line, respecting quoted fields (GTFS is RFC 4180-ish). */
export function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

/** Stream a GTFS text file, invoking `onRow(recordObject)` for each data row. */
export async function forEachRow(filePath, onRow) {
  const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });
  let header = null;
  for await (const line of rl) {
    if (!line) continue;
    const fields = parseCsvLine(line);
    if (!header) {
      header = fields.map((f) => f.replace(/^﻿/, '').trim());
      continue;
    }
    const rec = {};
    for (let i = 0; i < header.length; i++) rec[header[i]] = fields[i];
    onRow(rec);
  }
}

/**
 * Resolves a directory of extracted GTFS text files from a CLI arg that may
 * be: a path to an already-extracted dir, a path to a .zip, or omitted
 * (downloads the live feed). Returns { dir, cleanup() }.
 */
export async function resolveGtfsDir(arg) {
  if (arg && !arg.endsWith('.zip')) return { dir: arg, cleanup: async () => {} };

  const work = await mkdtemp(path.join(tmpdir(), 'translink-gtfs-'));
  let zipPath = arg;
  if (!zipPath) {
    zipPath = path.join(work, 'google_transit.zip');
    console.log(`Downloading ${GTFS_URL} ...`);
    const res = await fetch(GTFS_URL);
    if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
    await writeFile(zipPath, Buffer.from(await res.arrayBuffer()));
  }
  console.log(`Extracting ${zipPath} ...`);
  execFileSync('unzip', ['-o', zipPath, '-d', work], { stdio: 'ignore' });
  return { dir: work, cleanup: () => rm(work, { recursive: true, force: true }) };
}

/** route_id -> short display name (e.g. "099", "N9"). */
export async function loadRouteNames(dir) {
  const routeName = new Map();
  await forEachRow(path.join(dir, 'routes.txt'), (r) => {
    const name = (r.route_short_name || r.route_long_name || r.route_id).trim();
    routeName.set(r.route_id, name);
  });
  return routeName;
}

/** trip_id -> route_id. */
export async function loadTripRoutes(dir) {
  const tripRoute = new Map();
  await forEachRow(path.join(dir, 'trips.txt'), (r) => {
    tripRoute.set(r.trip_id, r.route_id);
  });
  return tripRoute;
}

/** Set of boardable stop_ids (location_type 0/blank; excludes stations/entrances). */
export async function loadBoardableStopIds(dir) {
  const ids = new Set();
  await forEachRow(path.join(dir, 'stops.txt'), (r) => {
    if (r.location_type && r.location_type !== '0') return;
    ids.add(r.stop_id);
  });
  return ids;
}
