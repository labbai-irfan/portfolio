import Link from 'next/link';
import type { ReactNode } from 'react';
import { isExternal } from '@/lib/utils';

export function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const external = isExternal(href);
  return (
    <Link
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="flex min-h-9 items-center text-14 text-body no-underline hover:text-ink"
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </Link>
  );
}
