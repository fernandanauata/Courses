import { isAccessible, accessibilityLabel, splitStopName, scheduleUrl } from '../stops.js';
import { escapeHtml, accessibilityGlyph } from '../util.js';
import { formatDistance } from '../geo.js';
import { getUpcomingDepartures } from '../departures.js';

export function createStopDetail(root, { onClose }) {
  // Guards against a slow departures fetch for a stop the user has since
  // navigated away from landing its result in the (now different) panel.
  let renderToken = 0;
  // app.js calls render() on every state change, including ones with
  // nothing to do with the detail panel (e.g. hovering a different list
  // row while this stop stays selected) — without this guard, each of
  // those would rebuild the panel's innerHTML and steal focus back to
  // the close button mid-interaction.
  let lastStopId = null;

  root.addEventListener('click', (event) => {
    if (event.target.closest('#detail-close')) onClose();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') onClose();
  });

  function render(stop, { distanceM } = {}) {
    if ((stop?.id ?? null) === lastStopId) return;
    lastStopId = stop?.id ?? null;
    const token = ++renderToken;

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
        <span aria-hidden="true">${accessibilityGlyph(accessible)}</span> ${accessibilityLabel(stop)}
      </p>
      ${distanceM != null ? `<p class="detail-distance">${formatDistance(distanceM)} away</p>` : ''}
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
      <div class="detail-departures">
        <h3 class="detail-subhead">Next departures <span class="detail-departures__badge">Scheduled</span></h3>
        <p class="detail-departures__list is-loading">Loading today's schedule…</p>
      </div>
      <a class="detail-link" href="${scheduleUrl(stop)}" target="_blank" rel="noopener noreferrer">
        View live schedule on translink.ca <span aria-hidden="true">↗</span>
      </a>
    `;
    root.querySelector('#detail-close').focus();
    loadDepartures(stop, token);
  }

  async function loadDepartures(stop, token) {
    const listEl = root.querySelector('.detail-departures__list');
    try {
      const { departures, totalToday } = await getUpcomingDepartures(stop, { limit: 5 });
      if (token !== renderToken || !listEl) return;

      listEl.classList.remove('is-loading');
      if (!totalToday) {
        listEl.textContent = 'No scheduled service found for this stop today.';
      } else if (!departures.length) {
        listEl.textContent = "No more scheduled departures today — see the live schedule link below.";
      } else {
        listEl.outerHTML = `<ul class="detail-departures__list">${departures.map((d) => `
          <li class="departure-row">
            <span class="departure-row__route">${escapeHtml(d.route)}</span>
            <span class="departure-row__eta">${d.minutesFromNow <= 1 ? 'Due' : `${d.minutesFromNow} min`}</span>
            <span class="departure-row__time">${d.time}</span>
          </li>`).join('')}</ul>`;
      }
    } catch (err) {
      if (token !== renderToken || !listEl) return;
      listEl.classList.remove('is-loading');
      listEl.textContent = "Couldn't load the schedule for this stop.";
      console.error('Failed to load departures:', err);
    }
  }

  return { render };
}
