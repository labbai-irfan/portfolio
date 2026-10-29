'use client';

import { useLayoutEffect, useSyncExternalStore } from 'react';
import { cx } from '@/lib/utils';

type Theme = 'light' | 'dark';

const THEME_CHANGE_EVENT = 'theme-change';

function subscribe(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    media.removeEventListener('change', callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): Theme {
  const stored = document.documentElement.dataset.theme;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// The server can't know the client's stored choice or OS preference, so it renders the
// light-mode icon as a default. useSyncExternalStore corrects this on the client's first
// render — only the icon can be briefly wrong, never the page's actual theme (that's set
// by pure CSS + the no-flash script in the root layout before this component even mounts).
function getServerSnapshot(): Theme {
  return 'light';
}

/** Toggles data-theme on <html> and persists the choice. */
export function ThemeToggle({ className }: { className?: string } = {}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Dev-only: React Strict Mode remounts <html> and clears attributes the inline
  // no-flash script set outside what this tree manages. Re-apply so dev matches
  // production. No-op in production (Strict Mode doesn't remount there) and a no-op
  // here whenever there's no stored choice to begin with.
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') document.documentElement.dataset.theme = stored;
    } catch {
      // Private browsing or storage disabled: nothing to re-apply.
    }
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private browsing or storage disabled: theme still applies, just won't persist.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const switchingTo = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${switchingTo} theme`}
      className={cx(
        'flex size-11 items-center justify-center border border-rule-control text-ink',
        className,
      )}
    >
      {theme === 'dark' ? (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" />
        </svg>
      )}
    </button>
  );
}
