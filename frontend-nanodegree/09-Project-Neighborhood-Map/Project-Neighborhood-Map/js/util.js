const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

export function debounce(fn, delayMs) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

// A plain inline SVG rather than the ♿ (U+267F) character: most platforms
// render that character with its own baked-in color emoji artwork
// (typically a blue ISA figure), which ignores CSS `color` entirely —
// invisible while this app's accent happened to also be blue, but wrong
// the moment the accent became a different color. `fill="currentColor"`
// here genuinely follows the badge's text color in every theme.
export const WHEELCHAIR_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">' +
  '<circle cx="16.5" cy="4.5" r="2.2"/>' +
  '<path d="M9.5 8a1.3 1.3 0 0 0 0 2.6h2.1l1 3-2.9 5a1.3 1.3 0 1 0 2.25 1.3l2.5-4.3.9 2.7a1.3 1.3 0 0 0 1.23.88h3.4a1.3 1.3 0 0 0 0-2.6h-2.47l-2.1-6.3a1.3 1.3 0 0 0-1.23-.88h-2.9l-.6-1.4H9.5z"/>' +
  '<path d="M8.6 12.2a5.3 5.3 0 1 0 5.02 7.03 1.3 1.3 0 1 0-2.46-.85 2.7 2.7 0 1 1-2.56-3.58 1.3 1.3 0 1 0 0-2.6z"/>' +
  '</svg>';

// The "unconfirmed accessibility" counterpart to WHEELCHAIR_ICON_SVG above —
// a plain "?" rather than another icon shape, so the two states read as
// distinct glyphs (not just distinct colors) per WCAG 1.4.1.
export const UNCONFIRMED_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">' +
  '<text x="12" y="17" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor" font-family="inherit">?</text>' +
  '</svg>';

export function accessibilityGlyph(accessible) {
  return accessible ? WHEELCHAIR_ICON_SVG : UNCONFIRMED_ICON_SVG;
}
