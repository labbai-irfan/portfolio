import { Fragment } from 'react';
import { getBuildInfo } from '@/lib/build-info';
import { sectionNumber } from '@/lib/format';
import { cx } from '@/lib/utils';
import { SectionBar } from '@/components/ui/section-bar';

type Node = { _id: string; kicker: string | null; name: string | null; category: string | null };
type Status = { status: string | null; uptime: number | null } | null;

const BOX: Record<string, { box: string; kicker: string }> = {
  user: { box: 'border border-rule-strong bg-surface', kicker: 'text-muted' },
  build: { box: 'bg-signal text-on-signal', kicker: 'text-on-signal-muted' },
  host: { box: 'bg-bar text-on-bar', kicker: 'text-on-bar-meta' },
};

export function HomeInfra({
  index,
  nodes,
  status,
}: {
  index: number;
  nodes: Node[];
  status: Status;
}) {
  if (nodes.length === 0) return null;
  const { builtLabel: builtAt } = getBuildInfo();
  // Never a made-up number: no probe result yet reads as "not measured yet".
  const rows = [
    { label: 'Status', value: status?.status ?? 'not measured yet', muted: !status?.status },
    ...(builtAt ? [{ label: 'Last deploy', value: builtAt, muted: false }] : []),
    {
      label: 'Uptime',
      value: status?.uptime != null ? `${status.uptime}%` : 'not measured yet',
      muted: status?.uptime == null,
    },
  ];

  return (
    <section aria-labelledby="home-infra">
      <SectionBar
        headingId="home-infra"
        title={`${sectionNumber(index)} — Infrastructure`}
        meta={{ label: 'Interactive topology →', href: '/infrastructure' }}
      />
      <div className="mx-auto flex max-w-page flex-wrap items-stretch gap-8 px-4 pt-14 pb-22 lg:px-10">
        <div className="flex min-w-0 flex-[999_1_320px] flex-col gap-5 lg:flex-[999_1_640px]">
          <h3 className="m-0 text-34 font-semibold tracking-heading lg:text-40">
            What this site is made of, and how it ships.
          </h3>
          <ol className="m-0 flex list-none flex-wrap items-center gap-2.5 border border-rule-strong bg-surface bg-grid p-6 lg:py-8">
            {nodes.map((node, i) => {
              const tone = BOX[node.category ?? ''] ?? BOX.user!;
              return (
                <Fragment key={node._id}>
                  {i > 0 && (
                    <li aria-hidden="true" className="text-arrow">
                      →
                    </li>
                  )}
                  <li
                    className={cx('flex min-w-18 flex-[1_1_72px] flex-col gap-0.5 p-3', tone.box)}
                  >
                    <span className={cx('font-mono text-10 uppercase', tone.kicker)}>
                      {node.kicker}
                    </span>
                    <span className="text-14 font-semibold">{node.name}</span>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </div>
        <dl className="m-0 min-w-0 flex-[1_1_300px] self-end border border-rule-strong bg-surface font-mono text-13">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={cx(
                'flex justify-between gap-4 px-4.5 py-3',
                i === 0 ? 'bg-bar text-on-bar' : 'border-rule not-last:border-b',
              )}
            >
              <dt className={cx(i === 0 ? 'text-12 tracking-data uppercase' : 'text-muted')}>
                {row.label}
              </dt>
              <dd className={cx('m-0', i === 0 ? 'text-on-bar-meta' : row.muted && 'text-muted')}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
