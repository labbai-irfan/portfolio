import { Tile } from '@/components/ui/tile';
import type { Fetched } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

export type SummaryCellData = NonNullable<
  Fetched<NonNullable<SETTINGS_QUERY_RESULT>['summaryCells']>
>[number];

/** One label/value fact from Site settings → Summary cells (the 60-second read). */
export function SummaryTile({ cell, className }: { cell: SummaryCellData; className?: string }) {
  return (
    <Tile className={cx('p-7', className)}>
      <dl className="m-0 flex h-full flex-col gap-3">
        <dt className="text-14 font-medium text-muted">{cell.label}</dt>
        <dd className="m-0 text-18 leading-[1.45] font-medium text-ink">{cell.value}</dd>
      </dl>
    </Tile>
  );
}
