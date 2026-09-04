import { isAccessible, accessibilityLabel, splitStopName, scheduleUrl } from '../stops.js';
import { escapeHtml } from '../util.js';

export function createStopDetail(root, { onClose }) {
  root.addEventListener('click', (event) => {
    if (event.target.closest('#detail-close')) onClose();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') onClose();
  });

  function render(stop) {
    if (!stop) {
      root.hidden = true;
      root.innerHTML = '';
      return;
    }

    const { direction, place } = splitStopName(stop.name);
    const accessible = isAccessible(stop);

    root.hidden = false;
    root.innerHTML = `
      <button type="button" id="detail-close" class="detail-close" aria-label="Close stop details">&times;</button>
      <h2 class="detail-title">${direction ? `<span class="detail-direction">${direction}</span> ` : ''}${escapeHtml(place)}</h2>
      <p class="detail-badge ${accessible ? 'is-accessible' : 'is-limited'}">
        <span aria-hidden="true">${accessible ? '♿' : '—'}</span> ${accessibilityLabel(stop)}
      </p>
      <dl class="detail-facts">
        <div><dt>Stop number</dt><dd>${escapeHtml(stop.code)}</dd></div>
        <div><dt>Location</dt><dd>${stop.lat.toFixed(5)}, ${stop.lon.toFixed(5)}</dd></div>
        ${stop.zone ? `<div><dt>Fare zone</dt><dd>${escapeHtml(stop.zone)}</dd></div>` : ''}
        <div><dt>Type</dt><dd>${stop.rail ? 'Rail platform' : 'Bus stop'}</dd></div>
      </dl>
      ${stop.routes.length ? `
        <h3 class="detail-subhead">Routes served</h3>
        <ul class="detail-routes">${stop.routes.map((route) => `<li>${escapeHtml(route)}</li>`).join('')}</ul>
      ` : ''}
      <a class="detail-link" href="${scheduleUrl(stop)}" target="_blank" rel="noopener noreferrer">
        View live schedule on translink.ca <span aria-hidden="true">↗</span>
      </a>
    `;
    root.querySelector('#detail-close').focus();
  }

  return { render };
}
