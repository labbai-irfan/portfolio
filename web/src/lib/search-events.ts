export const OPEN_SEARCH_EVENT = 'open-search';

/** Ask the search palette (mounted once in the root layout) to open. */
export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
