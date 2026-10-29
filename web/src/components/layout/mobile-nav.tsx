'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { getBuildInfo } from '@/lib/build-info';
import { openSearch } from '@/lib/search-events';
import { cx } from '@/lib/utils';

const ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/notes', label: 'How I debug' },
  { href: '/journey', label: 'Journey' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/infrastructure', label: 'Infrastructure' },
  { href: '/terminal', label: 'Terminal' },
  { href: '/contact', label: 'Contact' },
];

type MobileNavProps = {
  name?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

/**
 * The <lg header bar (logo, search, hamburger) plus the full-screen menu it opens.
 * The menu is a native <dialog>, so focus trapping, Escape-to-close and the backdrop
 * come from the browser instead of hand-rolled JS.
 */
export function MobileNav({ name, githubUrl, linkedinUrl }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const { shortSha, builtLabel: builtAt } = getBuildInfo();

  return (
    <>
      <div className="flex items-center gap-1.5 lg:hidden">
        <button
          type="button"
          aria-label="Search"
          onClick={openSearch}
          className="flex size-11 items-center justify-center border border-rule-control text-ink"
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="8" cy="8" r="5.5" />
            <path d="M12.2 12.2 16 16" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => dialogRef.current?.showModal()}
          className="flex size-11 items-center justify-center border border-rule-strong text-ink"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M2 5h14M2 9h14M2 13h14" />
          </svg>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-bar p-0 text-on-bar backdrop:bg-ink/60"
      >
        <div className="flex h-full flex-col">
          <header className="flex h-15 shrink-0 items-center justify-between border-b border-rule px-4">
            <span className="font-mono text-12 font-semibold">{name}</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => dialogRef.current?.close()}
              className="flex size-11 items-center justify-center border border-term-control text-on-bar"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 4l10 10M14 4 4 14" />
              </svg>
            </button>
          </header>

          <nav aria-label="Primary" className="flex flex-1 flex-col overflow-y-auto px-4 pt-6">
            <span className="mb-2 font-mono text-11 tracking-label text-on-bar-meta uppercase">
              Menu
            </span>
            {ITEMS.map((item, index) => {
              const current = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => dialogRef.current?.close()}
                  className={cx(
                    'flex min-h-16 items-center justify-between border-b border-rule text-28 font-semibold tracking-tight text-on-bar no-underline',
                    index === 0 && 'border-t',
                  )}
                >
                  {item.label}
                  <span className="font-mono text-12 text-on-bar-meta">
                    {String(index).padStart(2, '0')}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 flex-col gap-3.5 px-4 pt-5 pb-6">
            <Link
              href="/resume"
              onClick={() => dialogRef.current?.close()}
              className="flex min-h-13 items-center justify-center bg-signal text-16 font-medium text-on-signal no-underline"
            >
              Résumé ↓
            </Link>
            {(githubUrl || linkedinUrl) && (
              <div className="flex gap-2.5">
                {githubUrl && (
                  <Link
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 flex-1 items-center justify-center border border-term-control text-14 text-on-bar no-underline"
                  >
                    GitHub <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Link>
                )}
                {linkedinUrl && (
                  <Link
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 flex-1 items-center justify-center border border-term-control text-14 text-on-bar no-underline"
                  >
                    LinkedIn <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Link>
                )}
              </div>
            )}
            {(shortSha || builtAt) && (
              <span className="text-center font-mono text-11 text-on-bar-meta">
                {[shortSha && `Commit ${shortSha}`, builtAt && `Built ${builtAt}`]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
