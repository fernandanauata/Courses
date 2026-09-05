import { loadStops, matchesQuery, isAccessible } from './stops.js';
import { createStore } from './store.js';
import { createMapView } from './map.js';
import { createFilterBar } from './ui/filterBar.js';
import { createStopList } from './ui/stopList.js';
import { createStopDetail } from './ui/stopDetail.js';
import { createMapLegend } from './ui/mapLegend.js';
import { createThemeToggle } from './ui/themeToggle.js';
import { createStoryModal } from './ui/storyModal.js';
import { createViewToggle } from './ui/viewToggle.js';
import { loadWeather } from './weather.js';
import { getCurrentPosition, haversineMeters } from './geo.js';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

async function main() {
  const store = createStore({
    query: '',
    accessibleOnly: true,
    selectedId: null,
    hoveredId: null,
    mobileView: 'map', // 'map' | 'list' — ignored above the 1024px split-view breakpoint
    nearMe: { status: 'idle', lat: null, lon: null, radiusM: 800, error: null },
  });

  const select = (id) => store.setState({ selectedId: id });
  const clearSelection = () => store.setState({ selectedId: null });

  const systemDarkQuery = window.matchMedia(DARK_MODE_QUERY);
  const mapView = createMapView(document.getElementById('map'), {
    onSelect: select,
    theme: systemDarkQuery.matches ? 'dark' : 'light',
  });

  createThemeToggle(document.getElementById('theme-toggle-root'), {
    systemQuery: systemDarkQuery,
    onChange: (theme) => mapView.setTheme(theme),
  });

  createMapLegend(document.getElementById('map-legend-root'));

  const storyModal = createStoryModal(document.getElementById('story-modal-root'));
  const storyCta = document.getElementById('story-cta');
  storyCta.addEventListener('click', () => storyModal.open(storyCta));

  const filterBar = createFilterBar(document.getElementById('filter-bar'), store);
  const stopList = createStopList(document.getElementById('stop-list'), {
    onSelect: select,
    onHover: (id) => store.setState({ hoveredId: id }),
  });
  const stopDetail = createStopDetail(document.getElementById('stop-detail'), { onClose: clearSelection });
  const viewToggle = createViewToggle(document.getElementById('view-toggle-root'), {
    onChange: (mode) => store.setState({ mobileView: mode }),
  });

  const statusEl = document.getElementById('load-status');
  const metaEl = document.getElementById('data-meta');

  let allStops = [];
  let stopsById = new Map();
  let initialFitDone = false;

  // Requests the browser's geolocation exactly once per "Find Near Me"
  // click, driven off the store's nearMe.status rather than the click
  // handler itself, so the button stays a plain state-setter (see
  // filterBar.js) and this is the only place that talks to the API.
  let lastNearMeStatus = null;
  function handleNearMeSideEffect(state) {
    const { status } = state.nearMe;
    if (status === 'locating' && lastNearMeStatus !== 'locating') {
      getCurrentPosition()
        .then(({ lat, lon }) => {
          if (store.getState().nearMe.status !== 'locating') return; // cleared while awaiting
          store.setState((s) => ({ nearMe: { ...s.nearMe, status: 'active', lat, lon, error: null } }));
        })
        .catch((err) => {
          if (store.getState().nearMe.status !== 'locating') return;
          store.setState((s) => ({ nearMe: { ...s.nearMe, status: 'error', error: err.message } }));
        });
    }
    lastNearMeStatus = status;
  }

  // render() re-runs on every state change, including ones that don't
  // touch filtering at all (selecting a stop, hovering a row) — without
  // this cache, that would re-filter all ~8,700 stops AND hand the map and
  // the virtualized list a brand-new array reference every time, which for
  // the map means clusterGroup rebuilding its entire layer set on a mere
  // selection change, and for the list means losing scroll position because
  // it can't tell "new search results" from "same results, different
  // selection". Keyed on the actual filter inputs, not on `state` itself.
  let lastFilterKey = null;
  let lastFilterResult = null;
  function visibleStopsWithDistance(state) {
    const { status, lat, lon, radiusM } = state.nearMe;
    const key = `${state.query} ${state.accessibleOnly} ${status} ${lat} ${lon} ${radiusM}`;
    if (key === lastFilterKey) return lastFilterResult;
    lastFilterKey = key;

    const filtered = allStops.filter(
      (stop) => (!state.accessibleOnly || isAccessible(stop)) && matchesQuery(stop, state.query)
    );

    if (status !== 'active' || lat == null) {
      lastFilterResult = { visible: filtered, distanceById: null };
      return lastFilterResult;
    }

    const distanceById = new Map();
    const withinRadius = [];
    for (const stop of filtered) {
      const meters = haversineMeters(lat, lon, stop.lat, stop.lon);
      if (meters <= radiusM) {
        distanceById.set(stop.id, meters);
        withinRadius.push(stop);
      }
    }
    withinRadius.sort((a, b) => distanceById.get(a.id) - distanceById.get(b.id));
    lastFilterResult = { visible: withinRadius, distanceById };
    return lastFilterResult;
  }

  let lastVisibleRendered = null;
  function render(state) {
    handleNearMeSideEffect(state);

    const { visible, distanceById } = visibleStopsWithDistance(state);
    const nearMeActive = state.nearMe.status === 'active';

    filterBar.sync(state);
    filterBar.setCount(visible.length, allStops.length, nearMeActive);
    stopList.render(visible, state.selectedId, { distanceById });
    // clusterGroup.clearLayers()+addLayers() over thousands of markers is
    // real work — skip it on renders that only changed selection/hover,
    // which the visibleStopsWithDistance cache surfaces as a stable
    // reference here.
    if (visible !== lastVisibleRendered) {
      mapView.setVisible(visible);
      lastVisibleRendered = visible;
    }
    mapView.select(state.selectedId);
    mapView.setHovered(state.hoveredId);
    stopDetail.render(
      state.selectedId ? stopsById.get(state.selectedId) : null,
      { distanceM: state.selectedId ? distanceById?.get(state.selectedId) : undefined }
    );

    // Covers both directions of Task 6's sync requirement: a list click
    // already has its row in view, so this only visibly moves anything
    // when the selection came from a map-pin click instead — scrollToId
    // is a no-op if the row's already on screen.
    if (state.selectedId) stopList.scrollToId(state.selectedId);

    mapView.setUserLocation(nearMeActive ? { lat: state.nearMe.lat, lon: state.nearMe.lon } : null, state.nearMe.radiusM);
    viewToggle.sync(state.mobileView);
    document.body.classList.toggle('is-list-view', state.mobileView === 'list');

    if (!initialFitDone && visible.length && !nearMeActive) {
      mapView.fitToStops(visible);
      initialFitDone = true;
    }
  }

  store.subscribe(render);

  try {
    statusEl.textContent = 'Loading Vancouver bus stop data…';
    const data = await loadStops();
    allStops = data.stops;
    stopsById = new Map(allStops.map((stop) => [stop.id, stop]));
    mapView.setStops(allStops);
    statusEl.textContent = '';
    render(store.getState());
    metaEl.textContent =
      `${data.count.toLocaleString()} stops · ${data.accessibleCount.toLocaleString()} wheelchair accessible ` +
      `· TransLink GTFS, generated ${data.generated}`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Could not load stop data. Please refresh the page and try again.';
    statusEl.classList.add('is-error');
  }

  loadWeather()
    .then((text) => {
      document.getElementById('weather-text').textContent = text;
      document.getElementById('weather-box').hidden = false;
    })
    .catch((err) => console.log('Weather widget unavailable:', err.message));
}

main();
