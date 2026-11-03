import Link from 'next/link';
import { Tile } from '@/components/ui/tile';
import { stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';

type Node = { _id: string; kicker: string | null; name: string | null; category: string | null };

const BOX: Record<string, { box: string; kicker: string }> = {
  user: { box: 'border border-rule bg-surface', kicker: 'text-muted' },
  build: { box: 'bg-signal text-on-signal', kicker: 'text-on-signal-muted' },
  host: { box: 'bg-bar text-on-bar', kicker: 'text-on-bar-meta' },
};

/** The live parts of the site, in order, with a way into the interactive topology. */
export function HomeInfra({ nodes, className }: { nodes: Node[]; className?: string }) {
  if (nodes.length === 0) return null;
  return (
    <Tile
      as="section"
      labelledBy="home-infra"
      className={cx('flex flex-col gap-6 p-7 md:p-9', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="home-infra" className="m-0 text-28 leading-[1.1] font-semibold tracking-title">
          What this site runs on
        </h2>
        <Link href="/infrastructure" className="text-14 font-medium">
          Interactive topology
        </Link>
      </div>
      <ol className="m-0 my-auto flex list-none flex-wrap gap-2.5 p-0">
        {nodes.map((node) => {
          const tone = BOX[stegaClean(node.category) ?? ''] ?? BOX.user!;
          return (
            <li
              key={node._id}
              className={cx(
                'flex min-w-0 flex-[1_1_110px] flex-col gap-0.5 rounded-chip px-3.5 py-3 shadow-tile',
                tone.box,
              )}
            >
              <span className={cx('font-mono text-10 uppercase', tone.kicker)}>{node.kicker}</span>
              <span className="text-15 font-semibold">{node.name}</span>
            </li>
          );
        })}
      </ol>
    </Tile>
  );
}
