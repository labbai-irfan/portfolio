import type { Fetched } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

/** The 60-second read: up to four label/value cells under the hero. */
export function HomeSummary({
  cells,
}: {
  cells: Fetched<NonNullable<SETTINGS_QUERY_RESULT>['summaryCells']>;
}) {
  if (!cells || cells.length === 0) return null;
  return (
    <section aria-label="Summary" className="border-b border-rule-strong bg-surface">
      <div className="mx-auto flex max-w-page flex-wrap px-4 lg:px-10">
        {cells.map((cell) => (
          <div
            key={cell._key}
            className="flex min-w-0 flex-[1_1_260px] flex-col gap-2 border-rule py-7 not-last:border-r lg:px-7 lg:first:pl-0 lg:last:pr-0"
          >
            <span className="font-mono text-11 tracking-label text-signal uppercase">
              {cell.label}
            </span>
            <span className="text-16 leading-normal">{cell.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
