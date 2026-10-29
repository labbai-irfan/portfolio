import Link from 'next/link';
import { cx, isExternal } from '@/lib/utils';

export type EvidenceRow = {
  label: string;
  href?: string | null;
  /** Right-hand hint, e.g. "github.com", "read →", "§07 ↓". */
  meta: string;
};

type EvidenceLedgerProps = { title?: string; rows: EvidenceRow[]; className?: string };

/** Evidence links. A row without a link is hidden; with no rows, nothing renders. */
export function EvidenceLedger({ title = 'Evidence', rows, className }: EvidenceLedgerProps) {
  const real = rows.filter((row): row is EvidenceRow & { href: string } => Boolean(row.href));
  if (real.length === 0) return null;

  return (
    <div className={cx('border border-rule-strong bg-surface', className)}>
      <p className="m-0 border-b border-rule-strong px-5 py-3.5 font-mono text-11 tracking-label text-muted uppercase">
        {title}
      </p>
      <ul className="m-0 list-none p-0">
        {real.map((row) => {
          const external = isExternal(row.href);
          return (
            <li key={row.label} className="border-rule [&:not(:last-child)]:border-b">
              <Link
                href={row.href}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="flex min-h-13 items-center justify-between gap-4 px-5 text-15 text-ink no-underline hover:bg-ground hover:text-ink"
              >
                {row.label}
                <span className={cx('font-mono text-12', external ? 'text-muted' : 'text-signal')}>
                  {row.meta}
                  {external && <span aria-hidden="true"> ↗</span>}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
