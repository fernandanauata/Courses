import { debounce, WHEELCHAIR_ICON_SVG } from '../util.js';
import { formatDistance } from '../geo.js';

const RADIUS_OPTIONS = [500, 800, 1500, 3000];

export function createFilterBar(root, store) {
  root.innerHTML = `
    <div class="legend">
      <span class="legend-item"><span class="stop-pin stop-pin--accessible" aria-hidden="true">${WHEELCHAIR_ICON_SVG}</span> Accessible</span>
      <span class="legend-item"><span class="stop-pin stop-pin--limited" aria-hidden="true"></span> Not confirmed accessible</span>
    </div>

    <div class="near-me">
      <button type="button" id="near-me-button" class="near-me-button">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
        <span id="near-me-label">Find Near Me</span>
      </button>
      <label class="field field--inline">
        <span class="field__label">Within</span>
        <select id="near-me-radius">
          ${RADIUS_OPTIONS.map((m) => `<option value="${m}">${formatDistance(m)}</option>`).join('')}
        </select>
      </label>
    </div>
    <p id="near-me-status" class="near-me-status" role="status"></p>

    <label class="field">
      <span class="field__label">Search</span>
      <input type="search" id="stop-search" placeholder="Stop name, number, or route (e.g. 99, Broadway)" autocomplete="off">
    </label>
    <label class="toggle-field">
      <input type="checkbox" id="accessible-only" checked>
      <span>Wheelchair-accessible stops only</span>
    </label>
    <p id="result-count" class="result-count" aria-live="polite"></p>
  `;

  const searchInput = root.querySelector('#stop-search');
  const accessibleToggle = root.querySelector('#accessible-only');
  const resultCount = root.querySelector('#result-count');
  const nearMeButton = root.querySelector('#near-me-button');
  const nearMeLabel = root.querySelector('#near-me-label');
  const nearMeStatus = root.querySelector('#near-me-status');
  const radiusSelect = root.querySelector('#near-me-radius');

  const commitQuery = debounce((value) => store.setState({ query: value }), 150);
  searchInput.addEventListener('input', () => commitQuery(searchInput.value));
  accessibleToggle.addEventListener('change', () => {
    store.setState({ accessibleOnly: accessibleToggle.checked });
  });

  nearMeButton.addEventListener('click', () => {
    const { nearMe } = store.getState();
    if (nearMe.status === 'active') {
      // Only an active lookup toggles off — "idle" and "error" both mean
      // there's no location yet, so the button's job there is to (re)try.
      store.setState({ nearMe: { ...nearMe, status: 'idle', lat: null, lon: null, error: null } });
    } else {
      store.setState({ nearMe: { ...nearMe, status: 'locating', error: null } });
    }
  });

  radiusSelect.addEventListener('change', () => {
    store.setState((state) => ({ nearMe: { ...state.nearMe, radiusM: Number(radiusSelect.value) } }));
  });

  return {
    sync(state) {
      accessibleToggle.checked = state.accessibleOnly;
      radiusSelect.value = String(state.nearMe.radiusM);

      nearMeButton.classList.toggle('is-active', state.nearMe.status === 'active');
      nearMeButton.setAttribute('aria-pressed', String(state.nearMe.status === 'active'));

      if (state.nearMe.status === 'locating') {
        nearMeLabel.textContent = 'Locating…';
        nearMeStatus.textContent = 'Requesting your location…';
      } else if (state.nearMe.status === 'active') {
        nearMeLabel.textContent = 'Clear';
        nearMeStatus.textContent = '';
      } else if (state.nearMe.status === 'error') {
        nearMeLabel.textContent = 'Try Again';
        nearMeStatus.textContent = state.nearMe.error || 'Could not get your location.';
      } else {
        nearMeLabel.textContent = 'Find Near Me';
        nearMeStatus.textContent = '';
      }
    },
    setCount(visibleCount, totalCount, nearMeActive) {
      resultCount.textContent = nearMeActive
        ? `${visibleCount.toLocaleString()} stop${visibleCount === 1 ? '' : 's'} nearby`
        : `Showing ${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()} stops`;
    },
  };
}
