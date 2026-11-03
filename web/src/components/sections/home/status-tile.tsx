import { Tile } from '@/components/ui/tile';
import { getBuildInfo } from '@/lib/build-info';
import { stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';

type Status = { status: string | null; uptime: number | null } | null;

/** Live facts about this site: the probe result, measured uptime and the build being served. */
export function StatusTile({ status, className }: { status: Status; className?: string }) {
  const { shortSha, builtLabel } = getBuildInfo();
  const up = stegaClean(status?.status) === 'up';
  // Never a made-up number: no probe result yet reads as "not measured yet".
  const rows = [
    { label: 'Uptime', value: status?.uptime != null ? `${status.uptime}%` : 'not measured yet' },
    builtLabel && { label: 'Built', value: builtLabel },
    shortSha && { label: 'Commit', value: shortSha },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <Tile
      as="section"
      labelledBy="site-status"
      className={cx('flex flex-col gap-5 p-7', className)}
    >
      <h2 id="site-status" className="m-0 text-14 font-medium text-muted">
        Site status
      </h2>
      <p className="m-0 flex items-center gap-2.5 text-22 font-semibold">
        <span
          aria-hidden="true"
          className={cx('size-2.5 rounded-full', up ? 'bg-live' : 'bg-rule-dashed')}
        />
        {status?.status ? (up ? 'Up' : 'Down') : 'Not measured yet'}
      </p>
      <dl className="m-0 mt-auto flex flex-col gap-1.5 text-14">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap justify-between gap-x-3">
            <dt className="text-muted">{row.label}</dt>
            <dd className="m-0 font-mono text-13 leading-[1.6]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Tile>
  );
}
