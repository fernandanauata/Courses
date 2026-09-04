import { trapFocus } from '../a11y.js';

/**
 * Accessible modal dialog for the "why this exists" origin story, triggered
 * by the info button in the header. `root` is an otherwise-empty container
 * this owns entirely (kept separate from #app-body so its stacking context
 * never has to compete with the map/sidebar/detail panel).
 *
 * NOTE: the story text below is genuine in shape (a real "I built this for
 * someone" motivation) but written generically — swap in the real details
 * before this goes anywhere public under your name.
 */
export function createStoryModal(root) {
  root.innerHTML = `
    <div class="modal-backdrop" id="story-backdrop" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="story-title" id="story-dialog">
        <button type="button" class="modal-close" id="story-close" aria-label="Close dialog">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          </svg>
        </button>
        <h2 id="story-title">Why this exists</h2>
        <div class="modal-body">
          <p>When my sister, who uses a wheelchair, needed to get around the city, the hardest part usually wasn't the bus ride itself — it was not knowing, until she was already at a stop, whether she could actually board there.</p>
          <p>TransLink publishes that information, but it's buried in a feed built for developers, not for someone standing at a corner deciding whether to risk the next block. This map turns that data into something usable: every stop TransLink tracks, clearly marked as accessible or not, searchable by name or route, before anyone leaves the house.</p>
          <p>It started as a favor for one person. If it saves someone else the same guesswork, it's done its job.</p>
        </div>
      </div>
    </div>
  `;

  const backdrop = root.querySelector('#story-backdrop');
  const dialog = root.querySelector('#story-dialog');
  const closeButton = root.querySelector('#story-close');

  let releaseTrap = null;
  let triggerEl = null;

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function close() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    releaseTrap?.();
    releaseTrap = null;
    document.removeEventListener('keydown', onKeydown);
    (triggerEl || document.body).focus();
    triggerEl = null;
  }

  function open(trigger) {
    triggerEl = trigger instanceof HTMLElement ? trigger : document.activeElement;
    backdrop.hidden = false;
    releaseTrap = trapFocus(dialog);
    document.addEventListener('keydown', onKeydown);
    closeButton.focus();
  }

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  closeButton.addEventListener('click', close);

  return { open, close };
}
