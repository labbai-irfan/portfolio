import Link from 'next/link';
import { StatusChip } from '@/components/ui/status-chip';
import { Tile, TILE_LINK } from '@/components/ui/tile';
import { cx } from '@/lib/utils';
import { statusOf, type ProjectCardData } from '../project-card';

/** Another featured project. The whole tile opens the project's page. */
export function ProjectTile({
  project,
  className,
}: {
  project: ProjectCardData;
  className?: string;
}) {
  const status = statusOf(project);
  return (
    <Tile as="article" interactive className={cx('flex flex-col gap-3 p-7', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-14 font-medium text-muted">{project.code}</span>
        {status && <StatusChip status={status} />}
      </div>
      <h2 className="m-0 text-22 leading-[1.2] font-semibold">
        <Link href={`/work/${project.slug}`} className={cx('text-ink no-underline', TILE_LINK)}>
          {project.title}
        </Link>
      </h2>
      <p className="m-0 text-15 leading-[1.55] text-body">{project.summary}</p>
    </Tile>
  );
}
