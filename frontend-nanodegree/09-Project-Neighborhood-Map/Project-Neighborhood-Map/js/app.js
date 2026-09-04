import { loadStops, matchesQuery, isAccessible } from './stops.js';
import { createStore } from './store.js';
import { createMapView } from './map.js';
import { createFilterBar } from './ui/filterBar.js';
import { createStopList } from './ui/stopList.js';
import { createStopDetail } from './ui/stopDetail.js';
import { loadWeather } from './weather.js';

async function main() {
  const store = createStore({ query: '', accessibleOnly: true, selectedId: null });

  const select = (id) => store.setState({ selectedId: id });
  const clearSelection = () => store.setState({ selectedId: null });

  const mapView = createMapView(document.getElementById('map'), { onSelect: select });
  const filterBar = createFilterBar(document.getElementById('filter-bar'), store);
  const stopList = createStopList(document.getElementById('stop-list'), { onSelect: select });
  const stopDetail = createStopDetail(document.getElementById('stop-detail'), { onClose: clearSelection });

  const statusEl = document.getElementById('load-status');
  const metaEl = document.getElementById('data-meta');

  let allStops = [];
  let stopsById = new Map();
  let initialFitDone = false;

  function visibleStops(state) {
    return allStops.filter(
      (stop) => (!state.accessibleOnly || isAccessible(stop)) && matchesQuery(stop, state.query)
    );
  }

  function render(state) {
    const visible = visibleStops(state);
    filterBar.sync(state);
    filterBar.setCount(visible.length, allStops.length);
    stopList.render(visible, state.selectedId);
    mapView.setVisible(visible);
    mapView.select(state.selectedId);
    stopDetail.render(state.selectedId ? stopsById.get(state.selectedId) : null);

    if (!initialFitDone && visible.length) {
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
