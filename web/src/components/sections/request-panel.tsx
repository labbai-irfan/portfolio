'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Where a lost visitor can go instead: fixed navigation labels, not content.
const SUGGESTIONS = [
  { href: '/', label: 'home' },
  { href: '/work', label: 'all projects' },
  { href: '/notes', label: 'how I debug' },
];

/** The "request" card on the 404 page: shows the path that failed, as a terminal-style log. */
export function RequestPanel() {
  const pathname = usePathname();
  return (
    <div className="flex min-w-0 flex-[1_1_360px] flex-col border border-rule-strong bg-surface">
      <div className="flex items-center justify-between bg-bar px-5 py-3 font-mono text-12 text-on-bar">
        <span className="tracking-data uppercase">request</span>
        <span>404</span>
      </div>
      <div className="flex flex-col gap-1 px-5 py-6 font-mono text-13 leading-[1.8]">
        <p className="m-0 break-all">
          <span className="font-semibold text-signal">GET</span> {pathname}
        </p>
        <p className="m-0 text-muted">→ no route matches</p>
        <p className="m-0 mt-3 text-muted">try:</p>
        <ul className="m-0 list-none p-0">
          {SUGGESTIONS.map((item) => (
            <li key={item.href} className="flex flex-wrap items-baseline gap-x-6">
              <Link href={item.href} className="inline-flex min-h-11 min-w-24 items-center">
                {item.href}
              </Link>
              <span className="text-muted">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
