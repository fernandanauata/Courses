#!/usr/bin/env node
/**
 * build-data.mjs
 * -------------------------------------------------------------------------
 * Turns TransLink's GTFS Static feed into a compact `data/stops.json` file
 * that the browser app loads directly (the GTFS zip is ~40 MB and has no
 * CORS headers, so it can't be fetched client-side).
 *
 * Usage:
 *   node tools/build-data.mjs            # download the feed, then build
 *   node tools/build-data.mjs path/to/google_transit.zip
 *   node tools/build-data.mjs path/to/extracted-gtfs-dir/
 *
 * Requires: Node 18+ and the `unzip` CLI (only when given a .zip / downloading).
 *
 * Data: Route and stop data provided by permission of TransLink.
 * https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs
 * -------------------------------------------------------------------------
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { forEachRow, resolveGtfsDir, loadRouteNames, loadTripRoutes } from './gtfsUtil.mjs';

const OUT_FILE = path.resolve(import.meta.dirname, '..', 'data', 'stops.json');

async function main() {
  const { dir, cleanup } = await resolveGtfsDir(process.argv[2]);
  try {
    const routeName = await loadRouteNames(dir);
    console.log(`routes: ${routeName.size}`);

    const tripRoute = await loadTripRoutes(dir);
    console.log(`trips: ${tripRoute.size}`);

    // stops: keep boardable stops/platforms (location_type 0 or blank)
    const stops = new Map();
    await forEachRow(path.join(dir, 'stops.txt'), (r) => {
      if (r.location_type && r.location_type !== '0') return;
      const lat = Number(r.stop_lat);
      const lon = Number(r.stop_lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
      stops.set(r.stop_id, {
        id: r.stop_id,
        code: r.stop_code || r.stop_id,
        name: r.stop_name || '',
        lat: Math.round(lat * 1e5) / 1e5,
        lon: Math.round(lon * 1e5) / 1e5,
        // GTFS wheelchair_boarding: 1 = accessible, 2 = not accessible, 0/'' = unknown
        wheelchair: r.wheelchair_boarding === '1' ? 1 : r.wheelchair_boarding === '2' ? 2 : 0,
        zone: r.zone_id || '',
        rail: Boolean(r.parent_station),
        routes: new Set(),
      });
    });
    console.log(`stops (boardable): ${stops.size}`);

    // stop_times: attach the set of routes serving each stop
    let rows = 0;
    await forEachRow(path.join(dir, 'stop_times.txt'), (r) => {
      rows++;
      const s = stops.get(r.stop_id);
      if (!s) return;
      const rid = tripRoute.get(r.trip_id);
      const name = rid && routeName.get(rid);
      if (name) s.routes.add(name);
    });
    console.log(`stop_times rows scanned: ${rows}`);

    const sortRoute = (a, b) => (a.length - b.length) || a.localeCompare(b);
    const list = [...stops.values()]
      .map((s) => ({ ...s, routes: [...s.routes].sort(sortRoute) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    let feedInfo = {};
    try {
      const raw = await readFile(path.join(dir, 'feed_info.txt'), 'utf8');
      await forEachRow(path.join(dir, 'feed_info.txt'), (r) => { feedInfo = r; });
      void raw;
    } catch { /* feed_info.txt is optional */ }

    const accessible = list.filter((s) => s.wheelchair === 1).length;
    const payload = {
      source: 'TransLink GTFS Static',
      attribution: 'Route and stop data provided by permission of TransLink.',
      generated: new Date().toISOString().slice(0, 10),
      feedStart: feedInfo.feed_start_date || null,
      feedEnd: feedInfo.feed_end_date || null,
      count: list.length,
      accessibleCount: accessible,
      stops: list,
    };

    await mkdir(path.dirname(OUT_FILE), { recursive: true });
    await writeFile(OUT_FILE, JSON.stringify(payload));
    const kb = (Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(0);
    console.log(`\nWrote ${OUT_FILE}`);
    console.log(`  ${list.length} stops, ${accessible} accessible (${kb} KB)`);
  } finally {
    await cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
