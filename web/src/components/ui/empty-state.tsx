import Link from 'next/link';
import { cx } from '@/lib/utils';

type EmptyStateProps = {
  /** Kicker, e.g. "No results", "Not measured". */
  label: string;
  title: string;
  detail?: string;
  action?: { label: string; href: string };
  /** Mono title for data-like states ("Uptime · not measured yet"). */
  mono?: boolean;
  className?: string;
};

export function EmptyState({ label, title, detail, action, mono, className }: EmptyStateProps) {
  return (
    <div
      className={cx('flex flex-col gap-1 border border-dashed border-rule-dashed p-3.5', className)}
    >
      <span className="font-mono text-10 tracking-data text-muted uppercase">{label}</span>
      <span className={mono ? 'font-mono text-13' : 'text-14'}>{title}</span>
      {detail && <span className="text-12 text-muted">{detail}</span>}
      {action && (
        <Link href={action.href} className="text-13 no-underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
