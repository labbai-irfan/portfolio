'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { OPEN_SEARCH_EVENT } from '@/lib/search-events';
import { filterIndex, GROUP_ORDER, type SearchItem } from '@/lib/search-index';
import { cx } from '@/lib/utils';

/**
 * Global search palette. A native <dialog>, so focus is trapped, Esc closes it and focus returns
 * to whatever opened it. Opened by Ctrl/Cmd K or the header's Search buttons.
 */
export function SearchPalette({ items }: { items: SearchItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const results = useMemo(() => filterIndex(items, query), [items, query]);
  const active = Math.min(selected, Math.max(results.length - 1, 0));

  useEffect(() => {
    function open() {
      if (dialog.current?.open) return;
      setQuery('');
      setSelected(0);
      dialog.current?.showModal();
    }
    function onKey(event: globalThis.KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
    };
  }, []);

  useEffect(() => {
    document.getElementById(`search-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  function choose(item: SearchItem | undefined) {
    if (!item) return;
    dialog.current?.close();
    if (item.action === 'theme') {
      document.querySelector<HTMLButtonElement>('button[aria-label^="Switch to"]')?.click();
    } else if (item.href) {
      router.push(item.href);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected(Math.min(active + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected(Math.max(active - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[active]);
    }
  }

  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: results.filter((item) => item.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <dialog
      ref={dialog}
      aria-label="Search the site"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
      className="m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-170 border border-ink bg-surface p-0 text-ink backdrop:bg-bar/60"
    >
      <div className="flex items-center gap-3 border-b border-rule-strong px-5">
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="8" cy="8" r="5.5" />
          <path d="M12.2 12.2 16 16" />
        </svg>
        <label htmlFor="search-q" className="sr-only">
          Search pages, projects, notes and actions
        </label>
        <input
          ref={input}
          id="search-q"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-activedescendant={results.length > 0 ? `search-opt-${active}` : undefined}
          autoComplete="off"
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search pages, projects, notes…"
          className="min-h-14 min-w-0 flex-1 border-0 bg-transparent text-17 outline-none placeholder:text-muted"
        />
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="min-h-11 cursor-pointer border border-rule-control px-2 font-mono text-11 text-body"
        >
          <span className="sr-only">Close search, </span>Esc
        </button>
      </div>

      <div
        id="search-results"
        role="listbox"
        aria-label="Results"
        className="max-h-[56vh] overflow-y-auto"
      >
        {groups.map(({ group, items: groupItems }) => (
          <div key={group} role="group" aria-label={group}>
            <p className="m-0 px-5 pt-3 pb-1.5 font-mono text-10 tracking-label text-muted uppercase">
              {group}
            </p>
            {groupItems.map((item) => {
              const index = results.indexOf(item);
              const on = index === active;
              return (
                <Link
                  key={item.id}
                  id={`search-opt-${index}`}
                  role="option"
                  aria-selected={on}
                  href={item.href ?? '#'}
                  onMouseEnter={() => setSelected(index)}
                  onClick={(event) => {
                    event.preventDefault();
                    choose(item);
                  }}
                  className={cx(
                    'flex min-h-14 items-center justify-between gap-4 px-5 py-2.5 no-underline',
                    on ? 'bg-signal text-on-signal' : 'text-ink',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3.5">
                    <span
                      aria-hidden="true"
                      className={cx(
                        'flex size-8 shrink-0 items-center justify-center font-mono text-11',
                        on ? 'bg-surface text-signal' : 'border border-rule bg-ground',
                      )}
                    >
                      {item.badge}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-15 font-medium">{item.title}</span>
                      <span
                        className={cx(
                          'truncate text-13',
                          on ? 'text-on-signal-muted' : 'text-muted',
                        )}
                      >
                        {item.sub}
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className={cx('font-mono text-13', !on && 'invisible')}>
                    ↵
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
        {results.length === 0 && (
          <div className="flex flex-col items-start gap-2 px-5 py-8">
            <span className="text-16 font-medium">No results for “{query}”</span>
            <Link
              href="/terminal"
              onClick={() => dialog.current?.close()}
              className="inline-flex min-h-11 items-center"
            >
              Try the terminal instead →
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-rule-strong px-5 py-3 font-mono text-11 text-muted">
        <span>↑ ↓ move · ↵ open · Esc close</span>
        <span role="status">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </span>
      </div>
    </dialog>
  );
}
