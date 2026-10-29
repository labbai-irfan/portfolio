import { cx } from '@/lib/utils';

export type CoverageState = 'implemented' | 'lab' | 'planned' | 'none';

const squares: Record<CoverageState, { label: string; className: string }> = {
  implemented: { label: 'Implemented', className: 'size-4.5 bg-signal' },
  lab: { label: 'Learning lab', className: 'size-4.5 border-2 border-signal' },
  planned: { label: 'Planned', className: 'size-4.5 border border-dashed border-rule-dashed' },
  none: { label: 'Not covered', className: 'font-mono text-muted' },
};

// The Work cards use a wider, flatter mark so six of them fit a card.
const bars: Record<CoverageState, string> = {
  implemented: 'h-3.5 w-full max-w-10 bg-signal',
  lab: 'h-3.5 w-full max-w-10 border-2 border-signal',
  planned: 'h-3.5 w-full max-w-10 border border-dashed border-rule-dashed',
  none: 'h-3.5 w-full max-w-10 bg-rule',
};

type CoverageMarkProps = { state: CoverageState; shape?: 'square' | 'bar'; className?: string };

/** One stage cell: filled = implemented, outline = lab, dashed = planned, dash/grey = none. */
export function CoverageMark({ state, shape = 'square', className }: CoverageMarkProps) {
  const label = squares[state].label;
  if (shape === 'bar') {
    return (
      <span className={cx('inline-flex w-full', className)}>
        <span aria-hidden="true" className={cx('box-border', bars[state])} />
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  return (
    <span
      className={cx('inline-flex items-center justify-center', squares[state].className, className)}
    >
      {state === 'none' && <span aria-hidden="true">—</span>}
      <span className="sr-only">{label}</span>
    </span>
  );
}
