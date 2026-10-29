'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';
import { NAV_LINK_CLASS } from './nav-link';

const ABOUT_ITEMS = [
  { href: '/experience', title: 'Experience', detail: 'Roles, what I built, stack' },
  { href: '/skills', title: 'Skills', detail: 'Tiered, with evidence' },
  { href: '/journey', title: 'Journey', detail: 'Milestones, timeline' },
];

/** The "About" disclosure: Experience, Skills, Journey, then Résumé. Closes on Escape, blur, or a selection. */
export function AboutMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = ABOUT_ITEMS.some((item) => item.href === pathname) || pathname === '/resume';

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close(true);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) close(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="about-menu"
        onClick={() => setOpen((value) => !value)}
        className={cx(
          NAV_LINK_CLASS,
          'cursor-pointer',
          (open || current) && 'font-semibold text-ink shadow-[inset_0_-2px_0_var(--color-signal)]',
        )}
      >
        About
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={open ? 'rotate-180' : ''}
        >
          <path d="M3 4.5 6 7.5l3-3" />
        </svg>
      </button>
      {open && (
        <div
          id="about-menu"
          className="absolute top-17 left-0 z-10 w-70 border border-rule-strong bg-surface py-1.5 shadow-[0_16px_40px_rgba(10,15,28,0.18)]"
        >
          {ABOUT_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => close(false)}
              className="flex min-h-11 flex-col justify-center gap-0.5 px-4 py-2.5 text-ink no-underline hover:bg-ground hover:text-ink"
            >
              <span className="text-15 font-semibold">{item.title}</span>
              <span className="text-13 text-muted">{item.detail}</span>
            </Link>
          ))}
          <div className="my-1.5 border-t border-rule" />
          <Link
            href="/resume"
            onClick={() => close(false)}
            className="flex min-h-11 items-center justify-between px-4 py-2.5 text-ink no-underline hover:bg-ground hover:text-ink"
          >
            <span className="text-14 font-medium">Résumé</span>
            <span className="font-mono text-12 text-signal">one page →</span>
          </Link>
        </div>
      )}
    </div>
  );
}
