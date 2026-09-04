const STORAGE_KEY = 'neighborhood-map-theme'; // stored value: 'light' | 'dark'

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // private browsing / storage disabled — fall back to system
  }
}

function writeStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* non-fatal — the toggle still works for this session */
  }
}

const SUN_ICON =
  '<svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
  '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/>' +
  '<g stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
  '<line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>' +
  '<line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>' +
  '<line x1="4.9" y1="4.9" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.1" y2="19.1"/>' +
  '<line x1="4.9" y1="19.1" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.1" y2="4.9"/>' +
  '</g></svg>';

const MOON_ICON =
  '<svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">' +
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
  '</svg>';

/**
 * Sun/moon theme toggle. Resolution order for the initial theme: an
 * explicit stored choice, then the OS-level prefers-color-scheme, matching
 * how style.css's own media-query defaults already behave for anyone who's
 * never touched the toggle. `onChange(theme)` fires with the resolved
 * theme immediately (so callers don't need a separate "read initial state"
 * step) and again on every change thereafter.
 */
export function createThemeToggle(root, { systemQuery, onChange }) {
  root.innerHTML =
    '<button type="button" id="theme-toggle" class="theme-toggle" aria-label="Toggle light and dark theme" aria-pressed="false">' +
    SUN_ICON + MOON_ICON +
    '</button>';

  const button = root.querySelector('#theme-toggle');
  let theme = readStoredTheme() || (systemQuery.matches ? 'dark' : 'light');

  function apply(nextTheme) {
    theme = nextTheme;
    document.documentElement.setAttribute('data-theme', theme);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    onChange?.(theme);
  }

  button.addEventListener('click', () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    writeStoredTheme(next);
    apply(next);
  });

  // A stored choice always wins; without one, follow the OS live so someone
  // who switches their system theme mid-session sees the app follow along.
  systemQuery.addEventListener('change', (event) => {
    if (readStoredTheme()) return;
    apply(event.matches ? 'dark' : 'light');
  });

  apply(theme);

  return { getTheme: () => theme };
}
