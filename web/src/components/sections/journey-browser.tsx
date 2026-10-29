'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterButton } from '@/components/ui/filter-button';
import { MILESTONE_CATEGORIES } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { MILESTONES_QUERY_RESULT } from '@/sanity/types';

type Milestone = Fetched<MILESTONES_QUERY_RESULT[number]>;

const categoryOf = (m: Milestone) => stegaClean(m.category) ?? '';

const chipTone: Record<string, string> = {
  career: 'border border-signal text-signal',
  project: 'border border-signal text-signal',
  site: 'border border-signal text-signal',
  education: 'border border-ink text-ink',
  learning: 'border border-lab text-lab',
};

/** Year groups, newest first, with the planned ones under "Next". */
function groupByYear(items: Milestone[]) {
  const groups = new Map<string, Milestone[]>();
  for (const item of items) {
    const key = item.planned ? 'next' : (item.sortDate?.slice(0, 4) ?? 'undated');
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const years = [...groups.keys()].filter((k) => k !== 'next').sort((a, b) => b.localeCompare(a));
  return [...(groups.has('next') ? ['next'] : []), ...years].map((key) => ({
    key,
    label: key === 'next' ? 'Next' : key,
    items: groups.get(key) ?? [],
  }));
}

export function JourneyBrowser({ milestones }: { milestones: Milestone[] }) {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? milestones : milestones.filter((m) => categoryOf(m) === filter);
  const groups = groupByYear(shown);
  const categories = Object.keys(MILESTONE_CATEGORIES).filter((c) =>
    milestones.some((m) => categoryOf(m) === c),
  );

  return (
    <>
      <div className="border-b border-rule-strong bg-surface">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-4 pb-6 lg:px-10">
          <div role="group" aria-label="Filter milestones by type" className="flex flex-wrap gap-2">
            <FilterButton
              label="All"
              count={milestones.length}
              pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {categories.map((category) => (
              <FilterButton
                key={category}
                label={MILESTONE_CATEGORIES[category] ?? category}
                count={milestones.filter((m) => categoryOf(m) === category).length}
                pressed={filter === category}
                onClick={() => setFilter(category)}
              />
            ))}
          </div>
          <nav aria-label="Jump to year" className="flex gap-1 font-mono text-13">
            {groups.map((group) => (
              <a
                key={group.key}
                href={`#y-${group.key}`}
                className="flex min-h-11 items-center px-2.5 text-body no-underline hover:text-ink"
              >
                {group.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <section
        aria-label="Timeline"
        className="mx-auto flex max-w-page flex-col gap-14 px-4 pt-14 pb-10 lg:px-10"
      >
        {groups.map((group) => (
          <div key={group.key} id={`y-${group.key}`} className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-[0_0_200px] flex-col gap-1.5">
              <h2
                className={cx(
                  'm-0 text-48 leading-none font-semibold tracking-title lg:text-56',
                  group.key === 'next' ? 'text-muted' : 'text-ink',
                )}
              >
                {group.label}
              </h2>
              <span className="font-mono text-12 text-muted">
                {group.items.length}{' '}
                {group.key === 'next'
                  ? 'planned'
                  : group.items.length === 1
                    ? 'milestone'
                    : 'milestones'}
              </span>
            </div>
            <ol className="m-0 min-w-0 flex-[1_1_560px] list-none border-l border-rule-strong p-0">
              {group.items.map((item) => (
                <li
                  key={item._id}
                  className="relative flex flex-wrap gap-x-5 gap-y-1.5 pr-0 pb-7 pl-8"
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      'absolute top-1 -left-1.75 box-border size-3.25',
                      item.planned
                        ? 'border border-dashed border-rule-dashed bg-ground'
                        : item.latest
                          ? 'bg-signal'
                          : 'border-2 border-ink bg-surface',
                    )}
                  />
                  {item.dateLabel && (
                    <span className="flex-[0_0_110px] pt-0.75 font-mono text-13 text-body">
                      {item.dateLabel}
                    </span>
                  )}
                  <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-2 border-b border-rule pb-5.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cx(
                          'px-2 py-0.75 font-mono text-11 font-semibold tracking-chip uppercase',
                          item.planned
                            ? 'border border-dashed border-rule-dashed text-planned'
                            : (chipTone[categoryOf(item)] ?? 'border border-ink text-ink'),
                        )}
                      >
                        {MILESTONE_CATEGORIES[categoryOf(item)] ?? item.category}
                      </span>
                      {item.latest && (
                        <span className="bg-signal px-2 py-0.75 font-mono text-11 font-semibold tracking-chip text-on-signal">
                          LATEST
                        </span>
                      )}
                    </div>
                    <h3 className="m-0 text-19 leading-[1.35] font-semibold">{item.title}</h3>
                    {item.link?.href && item.link.label && (
                      <Link
                        href={item.link.href}
                        className="flex min-h-8 items-center self-start text-14 font-medium no-underline"
                      >
                        {item.link.label}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
        {groups.length === 0 && (
          <EmptyState label="No results" title="No milestones of this type yet." />
        )}
      </section>
    </>
  );
}
