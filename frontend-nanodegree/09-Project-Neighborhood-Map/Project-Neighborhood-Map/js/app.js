import { loadStops, matchesQuery, isAccessible } from './stops.js';
import { createStore } from './store.js';
import { createMapView } from './map.js';
import { createFilterBar } from './ui/filterBar.js';
import { createStopList } from './ui/stopList.js';
import { createStopDetail } from './ui/stopDetail.js';
import { loadWeather } from './weather.js';
import { getCurrentPosition, haversineMeters } from './geo.js';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

async function main() {
  const store = createStore({
    query: '',
    accessibleOnly: true,
    selectedId: null,
    nearMe: { status: 'idle', lat: null, lon: null, radiusM: 800, error: null },
  });

  const select = (id) => store.setState({ selectedId: id });
  const clearSelection = () => store.setState({ selectedId: null });

  const darkModeQuery = window.matchMedia(DARK_MODE_QUERY);
  const mapView = createMapView(document.getElementById('map'), {
    onSelect: select,
    theme: darkModeQuery.matches ? 'dark' : 'light',
  });
  darkModeQuery.addEventListener('change', (e) => mapView.setTheme(e.matches ? 'dark' : 'light'));

  const filterBar = createFilterBar(document.getElementById('filter-bar'), store);
  const stopList = createStopList(document.getElementById('stop-list'), { onSelect: select });
  const stopDetail = createStopDetail(document.getElementById('stop-detail'), { onClose: clearSelection });

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

  function visibleStopsWithDistance(state) {
    const filtered = allStops.filter(
      (stop) => (!state.accessibleOnly || isAccessible(stop)) && matchesQuery(stop, state.query)
    );

    const { status, lat, lon, radiusM } = state.nearMe;
    if (status !== 'active' || lat == null) {
      return { visible: filtered, distanceById: null };
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
    return { visible: withinRadius, distanceById };
  }

  function render(state) {
    handleNearMeSideEffect(state);

    const { visible, distanceById } = visibleStopsWithDistance(state);
    const nearMeActive = state.nearMe.status === 'active';

    filterBar.sync(state);
    filterBar.setCount(visible.length, allStops.length, nearMeActive);
    stopList.render(visible, state.selectedId, { distanceById });
    mapView.setVisible(visible);
    mapView.select(state.selectedId);
    stopDetail.render(
      state.selectedId ? stopsById.get(state.selectedId) : null,
      { distanceM: state.selectedId ? distanceById?.get(state.selectedId) : undefined }
    );

    mapView.setUserLocation(nearMeActive ? { lat: state.nearMe.lat, lon: state.nearMe.lon } : null, state.nearMe.radiusM);

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

  const menuButton = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  menuButton.addEventListener('click', () => {
    const open = sidebar.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

main();
