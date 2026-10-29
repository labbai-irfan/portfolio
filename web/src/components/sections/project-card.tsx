import Link from 'next/link';
import { CoverageMark, type CoverageState } from '@/components/ui/coverage-mark';
import { StatusChip, type ProjectStatus } from '@/components/ui/status-chip';
import { PROJECT_LINK_LABEL, STAGES } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { PROJECTS_QUERY_RESULT } from '@/sanity/types';

export type ProjectCardData = Fetched<PROJECTS_QUERY_RESULT[number]>;

/** The project's status as a plain value, safe to compare and to look up. */
export function statusOf(project: Pick<ProjectCardData, 'status'>): ProjectStatus | null {
  return (stegaClean(project.status) as ProjectStatus | null) ?? null;
}

/** The project's detail-page layout as a plain value. */
export function layoutOf(project: Pick<ProjectCardData, 'layout'>): string {
  return stegaClean(project.layout) ?? 'caseStudy';
}

/** The stage-coverage row of a project, as typed marks. */
export function coverageOf(project: Pick<ProjectCardData, 'stageCoverage'>) {
  return STAGES.map((stage) => ({
    ...stage,
    state: (stegaClean(project.stageCoverage?.[stage.key]) ?? 'none') as CoverageState,
  }));
}

/** A project on the Work page: status, summary, tools, six-stage coverage, and its detail link. */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const status = statusOf(project);
  const planned = status === 'planned';
  return (
    <article
      className={cx(
        'flex min-w-0 flex-[1_1_320px] flex-col gap-4 p-6 lg:flex-[1_1_520px] lg:p-8',
        planned
          ? 'border border-dashed border-rule-dashed'
          : 'border border-rule-strong bg-surface',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-12 tracking-data text-muted">{project.code}</span>
        {status && <StatusChip status={status} />}
      </div>
      <h2 className="m-0 text-28 leading-[1.1] font-semibold tracking-heading">{project.title}</h2>
      <p className="m-0 text-16 leading-[1.6] text-body">{project.summary}</p>
      {project.tools && project.tools.length > 0 && (
        <p className="m-0 font-mono text-12 text-body">{project.tools.join(' · ')}</p>
      )}
      <div className="flex flex-col gap-2 border-t border-rule pt-4">
        <span className="font-mono text-10 tracking-label text-muted uppercase">
          Stage coverage
        </span>
        <ul className="m-0 flex list-none gap-1.5 p-0">
          {coverageOf(project).map((stage) => (
            <li key={stage.key} className="flex flex-1 flex-col items-start gap-1.5">
              <span className="sr-only">{stage.label}: </span>
              <CoverageMark state={stage.state} shape="bar" />
              <span aria-hidden="true" className="font-mono text-10 text-muted">
                {stage.short}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-4.5 gap-y-1">
        {planned ? (
          <span className="flex min-h-11 items-center font-mono text-12 text-muted">
            Detail page once real work exists
          </span>
        ) : (
          project.slug && (
            <Link
              href={`/work/${project.slug}`}
              className="flex min-h-11 items-center text-15 font-medium no-underline"
            >
              {PROJECT_LINK_LABEL[layoutOf(project)]}
            </Link>
          )
        )}
      </div>
    </article>
  );
}
