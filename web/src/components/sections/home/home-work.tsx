import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CoverageMark } from '@/components/ui/coverage-mark';
import { SectionBar } from '@/components/ui/section-bar';
import { StatusChip } from '@/components/ui/status-chip';
import { sectionNumber } from '@/lib/format';
import { PROJECT_LINK_LABEL } from '@/lib/labels';
import { coverageOf, layoutOf, statusOf, type ProjectCardData } from '../project-card';

type HomeWorkProps = {
  index: number;
  flagship: ProjectCardData | null;
  others: ProjectCardData[];
};

const DETAIL_LABEL: Record<string, string> = {
  caseStudy: 'Read the case study →',
  pipeline: 'See the pipeline →',
  lab: 'Lab write-up →',
};

export function HomeWork({ index, flagship, others }: HomeWorkProps) {
  if (!flagship && others.length === 0) return null;
  return (
    <section aria-labelledby="home-work">
      <SectionBar
        headingId="home-work"
        title={`${sectionNumber(index)} — Work`}
        meta={{ label: 'All projects →', href: '/work' }}
      />
      <div className="mx-auto flex max-w-page flex-col gap-6 px-4 pt-14 pb-22 lg:px-10">
        {flagship && (
          <article className="flex flex-wrap border border-rule-strong bg-surface">
            <div className="flex min-w-0 flex-[1.2_1_320px] flex-col gap-5 p-6 lg:flex-[1.2_1_480px] lg:p-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-12 tracking-data text-muted uppercase">
                  {flagship.code} · Flagship
                </span>
                {statusOf(flagship) && <StatusChip status={statusOf(flagship)!} />}
              </div>
              <h3 className="m-0 text-26 leading-[1.05] font-semibold tracking-title lg:text-44">
                {flagship.title}
              </h3>
              <p className="m-0 max-w-130 text-17 leading-[1.6] text-body lg:text-18">
                {flagship.summary}
              </p>
              {flagship.slug && (
                <div className="mt-auto flex flex-wrap gap-3">
                  <Button href={`/work/${flagship.slug}`} variant="dark" className="min-h-12">
                    {PROJECT_LINK_LABEL[layoutOf(flagship)]}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-[1_1_320px] flex-col justify-center gap-3 bg-term p-7 text-term-out lg:flex-[1_1_380px] lg:p-8">
              <span className="font-mono text-11 tracking-label text-term-hint uppercase">
                Stage coverage
              </span>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 font-mono text-14">
                {coverageOf(flagship).map((stage) => (
                  <li key={stage.key} className="flex items-center justify-between gap-4">
                    <span>{stage.label}</span>
                    <span className="flex items-center gap-2.5">
                      <CoverageMark state={stage.state} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
        {others.length > 0 && (
          <div className="flex flex-wrap gap-6">
            {others.map((project) => (
              <Link
                key={project._id}
                href={`/work/${project.slug}`}
                className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 border border-rule-strong bg-surface p-7 text-ink no-underline hover:text-ink"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-12 text-muted">{project.code}</span>
                  {statusOf(project) && <StatusChip status={statusOf(project)!} />}
                </div>
                <span className="text-22 font-semibold">{project.title}</span>
                <span className="text-15 leading-[1.55] text-body">{project.summary}</span>
                <span className="mt-auto text-14 font-medium text-signal">
                  {DETAIL_LABEL[layoutOf(project)]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
