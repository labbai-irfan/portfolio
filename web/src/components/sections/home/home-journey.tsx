import { SectionBar } from '@/components/ui/section-bar';
import { sectionNumber } from '@/lib/format';
import { cx } from '@/lib/utils';

type Recent = {
  _id: string;
  title: string | null;
  dateLabel: string | null;
  latest: boolean | null;
};

type HomeJourneyProps = {
  index: number;
  /** Newest first, as the query returns them. */
  recent: Recent[];
  next: { title: string | null } | null;
};

export function HomeJourney({ index, recent, next }: HomeJourneyProps) {
  const items = [
    ...[...recent].reverse().map((m) => ({
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
    <section aria-labelledby="home-journey" className="border-t border-rule-strong bg-surface">
      <SectionBar
        headingId="home-journey"
        title={`${sectionNumber(index)} — Journey`}
        meta={{ label: 'Full timeline →', href: '/journey' }}
      />
      <div className="mx-auto flex max-w-page flex-col gap-7 px-4 pt-14 pb-22 lg:px-10">
        <h3 className="m-0 text-34 font-semibold tracking-heading lg:text-40">
          The most recent milestones, oldest first.
        </h3>
        <ol className="m-0 flex list-none flex-wrap border-t-2 border-rule-strong p-0">
          {items.map((item) => (
            <li
              key={item.key}
              className="relative flex min-w-0 flex-[1_1_220px] flex-col gap-2 pt-5.5 pr-5.5"
            >
              <span
                aria-hidden="true"
                className={cx(
                  'absolute -top-2 left-0 box-border size-3.25',
                  item.planned
                    ? 'border border-dashed border-rule-dashed bg-ground'
                    : item.latest
                      ? 'bg-signal'
                      : 'border-2 border-ink bg-surface',
                )}
              />
              {item.date && (
                <span
                  className={cx(
                    'font-mono text-12 uppercase',
                    item.latest ? 'text-signal' : 'text-muted',
                  )}
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
