'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

/** Shared look of the desktop nav's links and its About button. */
export const NAV_LINK_CLASS =
  'flex min-h-17 items-center gap-1.5 px-3.5 text-14 text-body no-underline hover:text-ink';

/** Marks the link for the current page with `aria-current` and the signal underline. */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const current = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className={cx(
        NAV_LINK_CLASS,
        current && 'font-semibold text-ink shadow-[inset_0_-2px_0_var(--color-signal)]',
      )}
    >
      {children}
    </Link>
  );
}
