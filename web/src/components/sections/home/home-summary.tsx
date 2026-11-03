import type { Fetched } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';
import { SummaryCell } from './summary-cell';

/**
 * The 60-second read under the hero. It sits on the hero's 12-column grid: the first cell takes
 * the hero text's five columns and the rest share the pipeline panel's seven, so the divider lines
 * up with the panel's left edge.
 */
export function HomeSummary({
  cells,
}: {
  cells: Fetched<NonNullable<SETTINGS_QUERY_RESULT>['summaryCells']>;
}) {
  if (!cells || cells.length === 0) return null;
  const [first, ...rest] = cells;
  return (
    <section aria-label="Summary" className="border-b border-rule-strong bg-surface">
      <div className="mx-auto grid max-w-page px-4 lg:grid-cols-12 lg:gap-x-10 lg:px-10">
        {first && <SummaryCell cell={first} className="lg:col-span-5" />}
        {rest.length > 0 && (
          <div className="lg:col-span-7 lg:grid lg:auto-cols-fr lg:grid-flow-col">
            {rest.map((cell) => (
              <SummaryCell
                key={cell._key}
                cell={cell}
                className="border-t border-rule lg:border-t-0 lg:border-l lg:px-8 lg:last:pr-0"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
