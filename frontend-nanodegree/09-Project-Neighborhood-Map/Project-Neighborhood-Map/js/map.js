import { isAccessible } from './stops.js';
import { WHEELCHAIR_ICON_SVG } from './util.js';

// Metro Vancouver, roughly Tsawwassen to Maple Ridge — matches the extent
// of stops in data/stops.json, with a little padding.
const METRO_BOUNDS = [
  [48.95, -123.55],
  [49.55, -122.25],
];
const DEFAULT_CENTER = [49.2578, -123.121];
const DEFAULT_ZOOM = 12;

// Esri's free "Gray Canvas" basemap: no API key, and deliberately
// minimalist — muted grayscale roads with points of interest omitted, a
// separate thin "reference" layer overlays just road/place labels so the
// map stays legible without the usual clutter. Light and dark variants
// exist, so the map follows the app's light/dark split.
// https://www.arcgis.com/home/item.html?id=8b3d38c0819547faa83f7b7aca80bd76 (light)
const ESRI_BASE = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';
const TILE_URLS = {
  light: {
    base: `${ESRI_BASE}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    reference: `${ESRI_BASE}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  },
  dark: {
    base: `${ESRI_BASE}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    reference: `${ESRI_BASE}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  },
};
const TILE_ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Esri, HERE, Garmin, ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, and the GIS community';

function stopIcon(stop, { selected = false } = {}) {
  const accessible = isAccessible(stop);
  const classes = ['stop-pin', accessible ? 'stop-pin--accessible' : 'stop-pin--limited'];
  if (selected) classes.push('is-selected');
  const size = accessible ? 26 : 16;
  return L.divIcon({
    className: 'stop-marker',
    html: `<span class="${classes.join(' ')}">${accessible ? WHEELCHAIR_ICON_SVG : ''}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function clusterIcon(cluster) {
  const markers = cluster.getAllChildMarkers();
  const accessibleCount = markers.filter((m) => isAccessible(m.__stop)).length;
  const ratio = accessibleCount / markers.length;
  const tier = ratio >= 0.85 ? 'high' : ratio >= 0.4 ? 'mid' : 'low';
  return L.divIcon({
    className: 'stop-cluster',
    html: `<span class="cluster-badge cluster-badge--${tier}">${cluster.getChildCount()}</span>`,
    iconSize: [40, 40],
  });
}

function userLocationIcon() {
  return L.divIcon({
    className: 'user-marker',
    html: '<span class="user-dot"><span class="user-dot__pulse" aria-hidden="true"></span></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

/**
 * Wraps Leaflet + Leaflet.markercluster behind a small imperative API so the
 * rest of the app never touches the mapping library directly.
 */
export function createMapView(container, { onSelect, theme = 'light' } = {}) {
  const map = L.map(container, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: 10,
    maxZoom: 19,
    maxBounds: METRO_BOUNDS,
    maxBoundsViscosity: 0.6,
  });

  function makeTileLayers(themeName) {
    const urls = TILE_URLS[themeName] || TILE_URLS.light;
    const opts = { maxZoom: 19, maxNativeZoom: 16 };
    return [
      L.tileLayer(urls.base, { ...opts, attribution: TILE_ATTRIBUTION }),
      L.tileLayer(urls.reference, opts), // labels-only overlay, no separate attribution needed
    ];
  }

  let currentTheme = theme;
  let tileLayers = makeTileLayers(currentTheme);
  tileLayers.forEach((layer) => layer.addTo(map));
  map.attributionControl.addAttribution('Transit data &copy; <a href="https://www.translink.ca/">TransLink</a>');
  map.zoomControl.setPosition('bottomright');

  function setTheme(nextTheme) {
    if (nextTheme === currentTheme) return;
    currentTheme = nextTheme;
    const next = makeTileLayers(nextTheme);
    next.forEach((layer) => layer.addTo(map));
    const previous = tileLayers;
    next[0].once('load', () => previous.forEach((layer) => map.removeLayer(layer)));
    tileLayers = next;
  }

  const clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    chunkedLoading: true,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: clusterIcon,
  });
  map.addLayer(clusterGroup);

  const markersById = new Map();
  let selectedId = null;

  function setStops(stops) {
    markersById.clear();
    stops.forEach((stop) => {
      const marker = L.marker([stop.lat, stop.lon], {
        icon: stopIcon(stop),
        keyboard: true,
        alt: `${stop.name} — ${isAccessible(stop) ? 'wheelchair accessible' : 'accessibility not confirmed'}`,
      });
      marker.__stop = stop;
      marker.bindTooltip(stop.name, { direction: 'top', offset: [0, -8] });
      marker.on('click', () => onSelect?.(stop.id));
      markersById.set(stop.id, marker);
    });
  }

  function setVisible(stops) {
    clusterGroup.clearLayers();
    clusterGroup.addLayers(stops.map((stop) => markersById.get(stop.id)).filter(Boolean));
  }

  function select(stopId) {
    if (selectedId && markersById.has(selectedId)) {
      const prev = markersById.get(selectedId);
      prev.setIcon(stopIcon(prev.__stop));
    }
    selectedId = stopId;
    const marker = stopId && markersById.get(stopId);
    if (!marker) return;
    marker.setIcon(stopIcon(marker.__stop, { selected: true }));
    // The marker may have been filtered out of the cluster group (e.g. a
    // stop selected before a search/filter change hid it) — only pan to it
    // if it's actually part of the current layer, otherwise zoomToShowLayer
    // throws trying to read its (nonexistent) cluster position.
    if (clusterGroup.hasLayer(marker)) {
      clusterGroup.zoomToShowLayer(marker, () => map.panTo(marker.getLatLng(), { animate: true }));
    }
  }

  let userMarker = null;
  let userCircle = null;
  let userLocationKey = null;

  /**
   * Places (or updates) a "you are here" marker and a radius circle. Only
   * recenters the map the first time a given location is set — the app
   * calls this on every render (filter/search changes included), and
   * re-panning the map out from under someone who's exploring it while
   * Near Me is active would be a worse experience than a stale center.
   * Pass loc: null to clear both.
   */
  function setUserLocation(loc, radiusM) {
    if (!loc) {
      if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
      if (userCircle) { map.removeLayer(userCircle); userCircle = null; }
      userLocationKey = null;
      return;
    }

    const key = `${loc.lat},${loc.lon}`;
    if (key === userLocationKey) {
      userCircle?.setRadius(radiusM);
      return;
    }
    userLocationKey = key;

    if (userMarker) map.removeLayer(userMarker);
    if (userCircle) map.removeLayer(userCircle);
    userMarker = L.marker([loc.lat, loc.lon], {
      icon: userLocationIcon(),
      keyboard: false,
      zIndexOffset: 1000,
      alt: 'Your location',
    }).addTo(map);
    userCircle = L.circle([loc.lat, loc.lon], {
      radius: radiusM,
      className: 'user-radius',
      weight: 1,
    }).addTo(map);
    map.setView([loc.lat, loc.lon], Math.max(map.getZoom(), 15));
  }

  function fitToStops(stops) {
    if (!stops.length) return;
    map.fitBounds(L.latLngBounds(stops.map((s) => [s.lat, s.lon])).pad(0.05));
  }

  return { map, setStops, setVisible, select, fitToStops, setTheme, setUserLocation };
}
