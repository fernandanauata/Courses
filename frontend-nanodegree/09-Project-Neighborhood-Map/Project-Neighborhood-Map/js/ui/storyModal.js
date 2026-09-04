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
          <p>Nearly a decade ago, I built this tool so my sister—who is a wheelchair user—could navigate Vancouver safely when visiting me.</p>
          <p>TransLink publishes stop accessibility data, but it’s buried in developer feeds rather than built for someone making real-time decisions on a street corner. This map turns that raw data into something usable: every tracked stop, clearly marked as accessible or not, searchable by name or route before anyone leaves the house.</p>
          <p>Recently, I came back to give the app a long-overdue checkup—fixing broken API connections and bringing its digital accessibility up to modern standards. It started as a personal project for one person, but if it saves someone else the same guesswork, it’s done its job.</p>
        </div>
        <footer class="modal-footer">
          <p class="modal-footer__copyright">&copy; 2026 Fernanda Nauata</p>
          <nav class="modal-footer__links" aria-label="Fernanda Nauata's website and social profiles">
            <a href="https://fernandanauata.com/" target="_blank" rel="noopener noreferrer">Website</a>
            <a href="https://www.linkedin.com/in/fernanda-nauata/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/fernandanauata" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.artstation.com/fernandanauata" target="_blank" rel="noopener noreferrer">ArtStation</a>
            <a href="https://www.instagram.com/fernauata" target="_blank" rel="noopener noreferrer">Instagram</a>
          </nav>
        </footer>
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
