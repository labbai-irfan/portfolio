'use client';

import { openSearch } from '@/lib/search-events';

/** The header's Search button (desktop). Ctrl/Cmd K does the same from anywhere. */
export function SearchButton() {
  return (
    <button
      type="button"
      aria-keyshortcuts="Control+K Meta+K"
      onClick={openSearch}
      className="ml-2 flex min-h-11 cursor-pointer items-center gap-2.5 border border-rule-control px-3 font-mono text-12 text-body"
    >
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="8" cy="8" r="5.5" />
        <path d="M12.2 12.2 16 16" />
      </svg>
      Search <kbd className="border border-rule-control px-1.25 py-0.5 font-sans">Ctrl K</kbd>
    </button>
  );
}
