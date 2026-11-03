import type { Fetched } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

export type SummaryCellData = NonNullable<
  Fetched<NonNullable<SETTINGS_QUERY_RESULT>['summaryCells']>
>[number];

/** One label/value pair in the summary strip under the hero. */
export function SummaryCell({ cell, className }: { cell: SummaryCellData; className?: string }) {
  return (
    <dl className={cx('m-0 flex min-w-0 flex-col gap-2 py-6 lg:py-9', className)}>
      <dt className="text-14 font-medium text-muted">{cell.label}</dt>
      <dd className="m-0 text-17 leading-[1.5] text-ink">{cell.value}</dd>
    </dl>
  );
}
