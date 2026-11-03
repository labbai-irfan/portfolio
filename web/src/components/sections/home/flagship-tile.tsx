import { Button } from '@/components/ui/button';
import { CoverageMark } from '@/components/ui/coverage-mark';
import { StatusChip } from '@/components/ui/status-chip';
import { Tile } from '@/components/ui/tile';
import { PROJECT_LINK_LABEL } from '@/lib/labels';
import { cx } from '@/lib/utils';
import { coverageOf, layoutOf, statusOf, type ProjectCardData } from '../project-card';

/** The featured project: what it is, how far it goes through the six delivery stages, and a way in. */
export function FlagshipTile({
  project,
  className,
}: {
  project: ProjectCardData;
  className?: string;
}) {
  const status = statusOf(project);
  return (
    <Tile
      as="article"
      labelledBy="flagship"
      interactive={Boolean(project.slug)}
      className={cx('flex flex-col overflow-hidden md:flex-row', className)}
    >
      <div className="flex min-w-0 flex-[1.4] flex-col gap-4 p-7 md:p-9">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-14 font-medium text-muted">Featured project · {project.code}</span>
          {status && <StatusChip status={status} />}
        </div>
        <h2
          id="flagship"
          className="m-0 text-28 leading-[1.08] font-semibold tracking-title lg:text-40"
        >
          {project.title}
        </h2>
        <p className="m-0 max-w-130 text-17 leading-[1.6] text-body">{project.summary}</p>
        {project.slug && (
          <div className="mt-auto pt-2">
            <Button href={`/work/${project.slug}`} variant="dark">
              {PROJECT_LINK_LABEL[layoutOf(project)]?.replace(/\s*→$/, '')}
            </Button>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 bg-term p-7 text-term-out md:p-8">
        <h3 className="m-0 text-14 font-medium text-term-hint">Stage coverage</h3>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-15">
          {coverageOf(project).map((stage) => (
            <li key={stage.key} className="flex items-center justify-between gap-4">
              <span>{stage.label}</span>
              <CoverageMark state={stage.state} />
            </li>
          ))}
        </ul>
      </div>
    </Tile>
  );
}
