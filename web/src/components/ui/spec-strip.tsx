import { cx } from '@/lib/utils';

export type SpecItem = { label: string; value?: string | null };

type SpecStripProps = {
  items: SpecItem[];
  /** "facts" = prose values (requirements, constraints); "stamp" = mono data (build stamp). */
  variant?: 'facts' | 'stamp';
  className?: string;
};

/** Labelled cells in a 1px frame. Cells without a value are not rendered. */
export function SpecStrip({ items, variant = 'facts', className }: SpecStripProps) {
  const filled = items.filter((item) => item.value);
  if (filled.length === 0) return null;
  const stamp = variant === 'stamp';

  return (
    <dl
      className={cx(
        'm-0 flex flex-wrap border border-rule-strong bg-surface',
        stamp && 'font-mono text-11',
        className,
      )}
    >
      {filled.map((item) => (
        <div
          key={item.label}
          className={cx(
            'flex flex-col border-rule [&:not(:last-child)]:border-r',
            stamp ? 'flex-1 px-3.5 py-3' : 'flex-[1_1_180px] gap-2 p-5',
          )}
        >
          <dt className={cx('text-muted', !stamp && 'font-mono text-11 tracking-label uppercase')}>
            {item.label}
          </dt>
          <dd className={cx('m-0', stamp ? 'mt-1' : 'text-15 leading-[1.55] text-body')}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
