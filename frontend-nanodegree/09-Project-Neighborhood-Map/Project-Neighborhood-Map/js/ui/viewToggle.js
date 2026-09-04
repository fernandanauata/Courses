const MAP_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
  '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>' +
  '<line x1="9" y1="3" x2="9" y2="19" stroke="currentColor" stroke-width="2"/>' +
  '<line x1="15" y1="5" x2="15" y2="21" stroke="currentColor" stroke-width="2"/>' +
  '</svg>';

const LIST_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
  '<g stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
  '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>' +
  '<circle cx="3.5" cy="6" r="1.4" fill="currentColor" stroke="none"/>' +
  '<circle cx="3.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>' +
  '<circle cx="3.5" cy="18" r="1.4" fill="currentColor" stroke="none"/>' +
  '</g></svg>';

/**
 * Below the 1024px split-view breakpoint, the map and the stop list can't
 * both be comfortably usable at once — this is the explicit switch between
 * them (as opposed to the old partial peek-sheet drag, which clipped list
 * content and wasn't discoverable). Hidden outright at/above 1024px via
 * style.css, where both panes are simply visible together.
 */
export function createViewToggle(root, { onChange }) {
  root.innerHTML = `
    <div class="view-toggle" id="view-toggle" role="group" aria-label="Switch between map and list view">
      <button type="button" class="view-toggle__btn is-active" id="view-toggle-map" aria-pressed="true">
        ${MAP_ICON}<span>Map View</span>
      </button>
      <button type="button" class="view-toggle__btn" id="view-toggle-list" aria-pressed="false">
        ${LIST_ICON}<span>List View</span>
      </button>
    </div>
  `;

  const mapButton = root.querySelector('#view-toggle-map');
  const listButton = root.querySelector('#view-toggle-list');

  // `sync` reflects store state onto the buttons with no side effect;
  // only a real click reports a change back out. Without that split,
  // driving this from the store's render loop would immediately feed
  // back into the store and recurse.
  function sync(mode) {
    mapButton.classList.toggle('is-active', mode === 'map');
    mapButton.setAttribute('aria-pressed', String(mode === 'map'));
    listButton.classList.toggle('is-active', mode === 'list');
    listButton.setAttribute('aria-pressed', String(mode === 'list'));
  }

  mapButton.addEventListener('click', () => onChange?.('map'));
  listButton.addEventListener('click', () => onChange?.('list'));

  return { sync };
}
