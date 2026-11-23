'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { openTerminal } from '@/lib/terminal-events';
import { cx } from '@/lib/utils';
import { NAV_LINK_CLASS } from './nav-link';

/**
 * "Terminal" in the desktop nav. A real link to /terminal (works without JavaScript, and with
 * Ctrl/⌘-click for a new tab); a plain click opens the terminal overlay from the nav instead.
 */
export function TerminalNavLink() {
  const current = usePathname() === '/terminal';
  return (
    <Link
      href="/terminal"
      aria-current={current ? 'page' : undefined}
      aria-keyshortcuts="Control+`"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        openTerminal(event.currentTarget);
      }}
      className={cx(
        NAV_LINK_CLASS,
        current && 'font-semibold text-ink shadow-[inset_0_-2px_0_var(--color-signal)]',
      )}
    >
      <span className="font-mono text-12 text-signal">&gt;_</span>Terminal
    </Link>
  );
}
