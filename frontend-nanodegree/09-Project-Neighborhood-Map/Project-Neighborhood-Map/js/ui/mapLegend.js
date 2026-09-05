import { WHEELCHAIR_ICON_SVG, UNCONFIRMED_ICON_SVG } from '../util.js';

/**
 * Floating map key, not a filter control — lives over the map itself
 * (bottom-left) rather than in the sidebar, and never intercepts a drag
 * that starts outside its own toggle/body (see .map-legend's
 * pointer-events:none in style.css). Expanded by default above ~640px,
 * collapsed to a tap-to-expand badge below it; either way it's a real
 * toggle, not two different components, so there's one behavior to reason
 * about at any width.
 */
export function createMapLegend(root) {
  root.innerHTML = `
    <div class="map-legend" id="map-legend">
      <div class="map-legend__body" id="map-legend-body">
        <span class="legend-item"><span class="stop-pin stop-pin--accessible" aria-hidden="true">${WHEELCHAIR_ICON_SVG}</span> Accessible</span>
        <span class="legend-item"><span class="stop-pin stop-pin--limited" aria-hidden="true">${UNCONFIRMED_ICON_SVG}</span> Not confirmed accessible</span>
      </div>
      <button type="button" class="map-legend__toggle" id="map-legend-toggle" aria-expanded="true" aria-controls="map-legend-body">
        <span class="stop-pin stop-pin--accessible map-legend__badge" aria-hidden="true">${WHEELCHAIR_ICON_SVG}</span>
        <span class="visually-hidden">Toggle map key</span>
      </button>
    </div>
  `;

  const legend = root.querySelector('#map-legend');
  const toggle = root.querySelector('#map-legend-toggle');

  function setExpanded(expanded) {
    legend.classList.toggle('is-collapsed', !expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  const narrowQuery = window.matchMedia('(max-width: 640px)');
  setExpanded(!narrowQuery.matches);
  narrowQuery.addEventListener('change', (event) => setExpanded(!event.matches));

  toggle.addEventListener('click', () => setExpanded(legend.classList.contains('is-collapsed')));

  return {};
}
