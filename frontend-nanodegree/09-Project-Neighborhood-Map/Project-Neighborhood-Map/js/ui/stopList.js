import { isAccessible, splitStopName } from '../stops.js';
import { escapeHtml } from '../util.js';

// Rendering every match as a DOM row doesn't scale to thousands of results —
// cap the list and point people at the search box to narrow it down.
const MAX_ROWS = 200;

export function createStopList(root, { onSelect }) {
  root.setAttribute('role', 'listbox');
  root.setAttribute('aria-label', 'Bus stops');

  root.addEventListener('click', (event) => {
    const row = event.target.closest('[data-stop-id]');
    if (row) onSelect(row.dataset.stopId);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('[data-stop-id]');
    if (!row) return;
    event.preventDefault();
    onSelect(row.dataset.stopId);
  });

  function render(stops, selectedId) {
    if (!stops.length) {
      root.innerHTML = '<p class="empty-state">No stops match your search.</p>';
      return;
    }

    const rows = stops.slice(0, MAX_ROWS).map((stop) => {
      const { direction, place } = splitStopName(stop.name);
      const accessible = isAccessible(stop);
      const selected = stop.id === selectedId;
      const routePreview = stop.routes.slice(0, 4).join(', ');
      return `
        <div class="stop-row${selected ? ' is-selected' : ''}" role="option" tabindex="0"
             data-stop-id="${stop.id}" aria-selected="${selected}">
          <span class="stop-row__badge ${accessible ? 'is-accessible' : 'is-limited'}" aria-hidden="true">${accessible ? '♿' : ''}</span>
          <span class="stop-row__text">
            <span class="stop-row__name">${direction ? `<em>${direction}</em> ` : ''}${escapeHtml(place)}</span>
            <span class="stop-row__meta">#${escapeHtml(stop.code)}${routePreview ? ` · ${escapeHtml(routePreview)}` : ''}</span>
          </span>
        </div>`;
    });

    const overflow = stops.length - MAX_ROWS;
    if (overflow > 0) {
      rows.push(`<p class="list-hint">+ ${overflow.toLocaleString()} more — narrow your search to see them.</p>`);
    }

    root.innerHTML = rows.join('');
  }

  return { render };
}
