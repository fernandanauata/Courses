import { isAccessible, splitStopName } from '../stops.js';
import { escapeHtml, accessibilityGlyph } from '../util.js';
import { formatDistance } from '../geo.js';

// Must match .stop-row's CSS `height` exactly — a hand-rolled virtualized
// list (no react-window here; this project has no bundler/framework)
// needs a known row height to do its position math, the same constraint
// every windowing library imposes via an explicit itemSize.
const ROW_HEIGHT = 58;
const OVERSCAN = 8; // extra rows mounted above/below the viewport

export function createStopList(root, { onSelect, onHover }) {
  root.setAttribute('role', 'listbox');
  root.setAttribute('aria-label', 'Bus stops');
  root.tabIndex = 0;
  root.innerHTML = '<div class="stop-list__spacer"><div class="stop-list__viewport"></div></div>';

  const spacer = root.querySelector('.stop-list__spacer');
  const viewport = root.querySelector('.stop-list__viewport');

  let stops = [];
  let selectedId = null;
  let distanceById = null;
  // Roving keyboard-focus index — NOT the same thing as `selectedId`. Only
  // a handful of rows exist in the DOM at once, so real per-row tabindex
  // would break the moment the active row scrolls out of the window;
  // aria-activedescendant only needs the referenced id to exist at the
  // moment it's set, which scrollIndexIntoView + renderVisible guarantee.
  let activeIndex = -1;
  let lastHoverIndex = -1;

  const rowDomId = (index) => `stop-row-${index}`;

  function renderRow(stop, index) {
    const { direction, place } = splitStopName(stop.name);
    const accessible = isAccessible(stop);
    const selected = stop.id === selectedId;
    const active = index === activeIndex;
    const routePreview = stop.routes.slice(0, 4).join(', ');
    const distanceM = distanceById?.get(stop.id);
    const distanceChip = distanceM != null ? `<span class="stop-row__distance">${formatDistance(distanceM)}</span>` : '';
    const classes = ['stop-row', selected && 'is-selected', active && 'is-active'].filter(Boolean).join(' ');
    return `
      <div class="${classes}" role="option" id="${rowDomId(index)}"
           data-index="${index}" data-stop-id="${stop.id}" aria-selected="${selected}"
           style="top:${index * ROW_HEIGHT}px">
        <span class="stop-row__badge ${accessible ? 'is-accessible' : 'is-limited'}" aria-hidden="true">${accessibilityGlyph(accessible)}</span>
        <span class="stop-row__text">
          <span class="stop-row__name">${direction ? `<em>${direction}</em> ` : ''}${escapeHtml(place)}</span>
          <span class="stop-row__meta">#${escapeHtml(stop.code)}${routePreview ? ` · ${escapeHtml(routePreview)}` : ''}</span>
        </span>
        ${distanceChip}
      </div>`;
  }

  function updateActiveDescendant() {
    if (activeIndex >= 0 && activeIndex < stops.length) {
      root.setAttribute('aria-activedescendant', rowDomId(activeIndex));
    } else {
      root.removeAttribute('aria-activedescendant');
    }
  }

  function renderVisible() {
    spacer.style.height = `${stops.length * ROW_HEIGHT}px`;
    const viewportHeight = root.clientHeight || 400;
    const first = Math.max(0, Math.floor(root.scrollTop / ROW_HEIGHT) - OVERSCAN);
    const last = Math.min(stops.length - 1, Math.ceil((root.scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN);
    let html = '';
    for (let i = first; i <= last; i++) html += renderRow(stops[i], i);
    viewport.innerHTML = html;
    updateActiveDescendant();
  }

  function scrollIndexIntoView(index) {
    const rowTop = index * ROW_HEIGHT;
    const rowBottom = rowTop + ROW_HEIGHT;
    const viewTop = root.scrollTop;
    const viewBottom = viewTop + root.clientHeight;
    if (rowTop < viewTop) root.scrollTop = rowTop;
    else if (rowBottom > viewBottom) root.scrollTop = rowBottom - root.clientHeight;
  }

  function moveActive(index) {
    if (index < 0 || index >= stops.length) return;
    activeIndex = index;
    scrollIndexIntoView(index);
    renderVisible();
    onHover?.(stops[index].id);
  }

  let scrollFrame = null;
  root.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      renderVisible();
    });
  });

  const rowIndexFromEvent = (event) => {
    const row = event.target.closest('[data-index]');
    return row ? Number(row.dataset.index) : -1;
  };

  root.addEventListener('click', (event) => {
    const index = rowIndexFromEvent(event);
    if (index < 0) return;
    activeIndex = index;
    onSelect(stops[index].id);
  });

  root.addEventListener('mouseover', (event) => {
    const index = rowIndexFromEvent(event);
    if (index < 0 || index === lastHoverIndex) return;
    lastHoverIndex = index;
    onHover?.(stops[index].id);
  });
  root.addEventListener('mouseleave', () => {
    lastHoverIndex = -1;
    onHover?.(null);
  });

  root.addEventListener('keydown', (event) => {
    if (!stops.length) return;
    const fallback = activeIndex < 0 ? 0 : activeIndex;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(Math.min(stops.length - 1, activeIndex < 0 ? 0 : activeIndex + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(Math.max(0, activeIndex < 0 ? 0 : activeIndex - 1));
        break;
      case 'Home':
        event.preventDefault();
        moveActive(0);
        break;
      case 'End':
        event.preventDefault();
        moveActive(stops.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(stops[fallback].id);
        break;
      default:
        break;
    }
  });

  function render(nextStops, nextSelectedId, { distanceById: nextDistanceById } = {}) {
    const listChanged = stops !== nextStops;
    stops = nextStops;
    selectedId = nextSelectedId;
    distanceById = nextDistanceById || null;

    if (listChanged) {
      // A genuinely new result set (search/filter changed) — start fresh
      // rather than preserving a scroll position or active row that may
      // no longer correspond to anything meaningful.
      root.scrollTop = 0;
      activeIndex = -1;
      lastHoverIndex = -1;
    }

    if (!stops.length) {
      spacer.style.height = 'auto';
      viewport.innerHTML = '<p class="empty-state">No stops match your search.</p>';
      root.removeAttribute('aria-activedescendant');
      return;
    }

    renderVisible();
  }

  /** Scrolls a stop into view (mounting it if virtualized out) without
   * touching keyboard-roving state — used when a selection originates
   * from the map, not the list itself. */
  function scrollToId(stopId) {
    const index = stops.findIndex((stop) => stop.id === stopId);
    if (index < 0) return;
    scrollIndexIntoView(index);
    renderVisible();
  }

  return { render, scrollToId };
}
