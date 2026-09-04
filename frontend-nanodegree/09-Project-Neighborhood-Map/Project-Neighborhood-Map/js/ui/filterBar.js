import { debounce } from '../util.js';

export function createFilterBar(root, store) {
  root.innerHTML = `
    <div class="legend">
      <span class="legend-item"><span class="stop-pin stop-pin--accessible" aria-hidden="true">♿</span> Accessible</span>
      <span class="legend-item"><span class="stop-pin stop-pin--limited" aria-hidden="true"></span> Not confirmed accessible</span>
    </div>
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

  const commitQuery = debounce((value) => store.setState({ query: value }), 150);
  searchInput.addEventListener('input', () => commitQuery(searchInput.value));
  accessibleToggle.addEventListener('change', () => {
    store.setState({ accessibleOnly: accessibleToggle.checked });
  });

  return {
    sync(state) {
      accessibleToggle.checked = state.accessibleOnly;
    },
    setCount(visibleCount, totalCount) {
      resultCount.textContent = `Showing ${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()} stops`;
    },
  };
}
