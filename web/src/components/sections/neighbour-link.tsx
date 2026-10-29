import Link from 'next/link';
import { cx } from '@/lib/utils';

type Neighbour = { code: string; title: string; slug: string } | null;

/** Previous/next project link at the bottom of a project page. Renders a spacer when there is none. */
export function NeighbourLink({
  project,
  direction,
}: {
  project: Neighbour;
  direction: 'prev' | 'next';
}) {
  if (!project) return <span className="flex-1" />;
  const next = direction === 'next';
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cx(
        'flex min-h-11 min-w-60 flex-1 flex-col gap-1.5 border border-rule-strong bg-surface p-5 no-underline hover:bg-ground',
        next && 'items-end text-right',
      )}
    >
      <span className="font-mono text-11 tracking-label text-muted uppercase">
        {next ? 'Next project →' : '← Previous project'}
      </span>
      <span className="text-17 font-semibold text-ink">
        <span className="font-mono text-12 font-normal text-muted">{project.code}</span>{' '}
        {project.title}
      </span>
    </Link>
  );
}
