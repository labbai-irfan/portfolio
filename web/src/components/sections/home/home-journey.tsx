import Link from 'next/link';
import { Tile } from '@/components/ui/tile';
import { cx } from '@/lib/utils';

type Recent = {
  _id: string;
  title: string | null;
  dateLabel: string | null;
  latest: boolean | null;
};

type HomeJourneyProps = {
  /** Newest first, as the query returns them. */
  recent: Recent[];
  next: { title: string | null } | null;
  className?: string;
};

/** The latest milestones, newest first, and what comes next. */
export function HomeJourney({ recent, next, className }: HomeJourneyProps) {
  const items = [
    ...recent.map((m) => ({
      key: m._id,
      date: m.dateLabel,
      title: m.title,
      latest: Boolean(m.latest),
      planned: false,
    })),
    ...(next?.title
      ? [{ key: 'next', date: 'Next', title: next.title, latest: false, planned: true }]
      : []),
  ];
  if (items.length === 0) return null;

  return (
    <Tile
      as="section"
      labelledBy="home-journey"
      className={cx('flex flex-col gap-6 p-7 md:p-9', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="home-journey" className="m-0 text-28 leading-[1.1] font-semibold tracking-title">
          Journey
        </h2>
        <Link href="/journey" className="text-14 font-medium">
          Full timeline
        </Link>
      </div>
      <ol className="m-0 flex list-none flex-col p-0">
        {items.map((item) => (
          <li
            key={item.key}
            className="relative flex gap-4 pb-5 pl-7 before:absolute before:top-2 before:bottom-0 before:left-1.25 before:w-px before:bg-rule last:pb-0 last:before:hidden"
          >
            <span
              aria-hidden="true"
              className={cx(
                'absolute top-1.5 left-0 box-border size-2.75 rounded-full',
                item.planned
                  ? 'border border-dashed border-rule-dashed bg-surface'
                  : item.latest
                    ? 'bg-signal'
                    : 'border-2 border-ink bg-surface',
              )}
            />
            <span className="flex min-w-0 flex-col gap-0.5">
              {item.date && (
                <span
                  className={cx('text-13 font-medium', item.latest ? 'text-signal' : 'text-muted')}
                >
                  {item.date}
                  {item.latest && ' · Latest'}
                </span>
              )}
              <span
                className={cx('text-16 leading-[1.4] font-semibold', item.planned && 'text-body')}
              >
                {item.title}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Tile>
  );
}
