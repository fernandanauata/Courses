## Accessible Bus Stops — Vancouver, BC

An interactive, map-first Leaflet application showing every TransLink bus
and rail stop across Metro Vancouver, with wheelchair accessibility as the
primary lens: filter to accessible-only stops, search by name/number/route,
and open a stop for its accessibility status, routes served, fare zone, and
a link to its live TransLink schedule.

This is a rewrite of an earlier Google Maps + Knockout version of the same
project — see [What changed](#what-changed) below for why.

### Open the project

Live site: https://fernandanauata.github.io/Courses/frontend-nanodegree/09-Project-Neighborhood-Map/Project-Neighborhood-Map/

To run locally, this is a static site with no build step, but it does fetch
`data/stops.json` and load ES modules, so it needs to be served over HTTP
(not opened as a `file://` URL):

```bash
cd Project-Neighborhood-Map
python3 -m http.server 8080
# then open http://localhost:8080
```

### How it works

- The map is centered on Metro Vancouver and shows every boardable stop as
  a marker, clustered for performance. Clusters are tinted by how
  accessible their contents are (blue = mostly accessible, amber = mixed).
- **Accessible stops** are larger blue pins with a wheelchair glyph.
  **Stops without confirmed accessibility** are smaller, muted pins.
- Click a marker, or a row in the sidebar list, to open a detail panel with
  the stop's name, number, coordinates, accessibility status, fare zone,
  the routes that serve it, its next few **scheduled departures**, and a
  link to its live schedule on translink.ca.
- **Find Near Me** uses the browser's Geolocation API to center the map on
  you, show a radius circle (500 m – 3 km, adjustable), filter the sidebar
  list to stops inside it, and sort that list by actual distance.
- The "Wheelchair-accessible stops only" toggle (on by default) and the
  search box (by name, stop number, or route) both filter the map and list
  together, with a live result count.
- On narrow screens the sidebar becomes a bottom sheet, opened with the
  menu button; the map always fills the screen.
- A small weather chip shows current Vancouver conditions (non-essential —
  it just stays hidden if the request fails).

### Data source

Stop locations, names, and `wheelchair_boarding` status come from
[TransLink's public GTFS Static feed](https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs/gtfs-data)
(no API key required). Routes serving each stop are derived by joining
`stop_times.txt → trips.txt → routes.txt`.

The GTFS feed is a ~40 MB zip with no CORS headers, so it can't be fetched
from the browser — instead, [tools/build-data.mjs](tools/build-data.mjs)
downloads and processes it into the compact `data/stops.json` committed to
this repo (~1.4 MB, ~215 KB gzipped, covering all 8,755 boardable stops in
the feed). Regenerate it any time with:

```bash
node tools/build-data.mjs
```

Route and stop data used in this project is provided by permission of
TransLink.

**Scheduled departures** (shown in the stop detail panel) come from the same
feed, resolved for a representative weekday the same way any GTFS consumer
resolves "what's running today" — `calendar.txt`'s weekly pattern, adjusted
by `calendar_dates.txt`'s per-date exceptions (TransLink expresses most
service through exceptions rather than the weekly pattern). This is the
**published timetable, not live vehicle tracking** — TransLink's real-time
API (RTTI) needs a registered key and has no browser CORS, so it isn't
reachable from this static site without a server-side proxy; the "View live
schedule" link covers that instead. [tools/build-departures.mjs](tools/build-departures.mjs)
builds this dataset, sharded into 60 files by `stop_id % 60` under
`data/departures/` (~7 MB total) so the app only fetches the one shard for
a stop someone actually opens, rather than the whole system's schedule
upfront. Regenerate it any time with:

```bash
node tools/build-departures.mjs
```

### What changed

This project previously used the Google Maps JS API and pulled stop data
from a personal PHP proxy hosted on Heroku's free tier
(`neighborhoodmapproject.herokuapp.com`). Heroku retired free dynos in
2022, so that proxy — and with it, every marker on the map — had been dead
for years; the embedded Google Maps key had also stopped rendering a usable
map. Rather than resurrect a personal proxy or provision a new billed API
key, this rewrite:

- Replaced **Google Maps** with **Leaflet**, tiled with **Esri's free "Gray
  Canvas" basemap** (muted grayscale roads, no POI clutter, light/dark
  variants) — no API key, no billing, and better default
  accessibility/keyboard support. (An earlier pass tried CARTO's
  basemap tiles, also advertised as keyless — they turned out to
  rate-limit anonymous traffic to a watermarked "API key required" tile
  under real use, caught in testing before it shipped.)
- Replaced the **Heroku TransLink proxy** with a **static, pre-built
  dataset** sourced directly from TransLink's official GTFS feed (see
  above) — no server to keep alive, no key to expire.
- Replaced **Knockout + jQuery + a jQuery sidebar plugin** with small
  vanilla ES modules (an observable store, a Leaflet wrapper, and three UI
  components) — fewer dependencies for roughly the same amount of code.
- Replaced the **OpenWeatherMap** call (shipped a personal key over plain
  HTTP) with **Open-Meteo**, which is free, keyless, and CORS-enabled.
- Rebuilt the layout to scale from a single downtown neighborhood to all of
  Metro Vancouver: marker clustering, a searchable/filterable list capped
  at 200 rendered rows, and a responsive sidebar (docked panel on desktop,
  bottom sheet on mobile).

### Project structure

```
index.html
css/style.css
js/
  app.js          bootstraps state + wires the map/list/filter/detail views
  store.js        tiny observable store
  map.js          Leaflet + marker clustering + basemap theme, as a small API
  stops.js        stop data helpers (accessibility, search matching, URLs)
  geo.js          geolocation promise wrapper, haversine distance/formatting
  departures.js   lazy, sharded fetch of scheduled-departures data
  weather.js      Open-Meteo current-conditions fetch
  util.js         escapeHtml / debounce
  ui/
    filterBar.js  search box, accessibility toggle, Find Near Me, legend
    stopList.js   the sidebar stop list
    stopDetail.js the stop detail panel (facts + scheduled departures)
data/
  stops.json            generated stop dataset (see tools/build-data.mjs)
  departures/            generated scheduled-departures shards (see
                          tools/build-departures.mjs): manifest.json +
                          shard-0.json … shard-59.json
tools/
  gtfsUtil.mjs          shared GTFS download/parsing helpers
  build-data.mjs        regenerates data/stops.json
  build-departures.mjs  regenerates data/departures/
```

### Sources

- https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs
- https://leafletjs.com/
- https://github.com/Leaflet/Leaflet.markercluster
- https://open-meteo.com/
- https://www.openstreetmap.org/copyright
- https://www.esri.com/arcgis-blog/products/product/mapping/take-a-look-at-the-new-map-viewer-basemaps/ (Esri Gray Canvas basemap)
- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
