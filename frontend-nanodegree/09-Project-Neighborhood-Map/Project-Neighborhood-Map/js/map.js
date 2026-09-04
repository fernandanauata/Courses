import { isAccessible } from './stops.js';

// Metro Vancouver, roughly Tsawwassen to Maple Ridge — matches the extent
// of stops in data/stops.json, with a little padding.
const METRO_BOUNDS = [
  [48.95, -123.55],
  [49.55, -122.25],
];
const DEFAULT_CENTER = [49.2578, -123.121];
const DEFAULT_ZOOM = 12;

function stopIcon(stop, { selected = false } = {}) {
  const accessible = isAccessible(stop);
  const classes = ['stop-pin', accessible ? 'stop-pin--accessible' : 'stop-pin--limited'];
  if (selected) classes.push('is-selected');
  const size = accessible ? 26 : 16;
  return L.divIcon({
    className: 'stop-marker',
    html: `<span class="${classes.join(' ')}">${accessible ? '♿' : ''}</span>`,
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

/**
 * Wraps Leaflet + Leaflet.markercluster behind a small imperative API so the
 * rest of the app never touches the mapping library directly.
 */
export function createMapView(container, { onSelect } = {}) {
  const map = L.map(container, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: 10,
    maxZoom: 19,
    maxBounds: METRO_BOUNDS,
    maxBoundsViscosity: 0.6,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
  map.attributionControl.addAttribution('Transit data &copy; <a href="https://www.translink.ca/">TransLink</a>');
  map.zoomControl.setPosition('bottomright');

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

  function fitToStops(stops) {
    if (!stops.length) return;
    map.fitBounds(L.latLngBounds(stops.map((s) => [s.lat, s.lon])).pad(0.05));
  }

  return { map, setStops, setVisible, select, fitToStops };
}
