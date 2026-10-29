import Link from 'next/link';
import { RichText } from '@/components/portable-text/rich-text';
import { EvidenceLedger } from '@/components/ui/evidence-ledger';
import { SpecStrip } from '@/components/ui/spec-strip';
import { StatusChip } from '@/components/ui/status-chip';
import { fullDate, monthYear, sectionNumber } from '@/lib/format';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx, isExternal } from '@/lib/utils';
import type { PROJECT_QUERY_RESULT } from '@/sanity/types';
import { CoverageStrip } from './coverage-strip';
import { NeighbourLink } from './neighbour-link';
import { layoutOf, statusOf } from './project-card';

export type ProjectDetailData = Fetched<NonNullable<PROJECT_QUERY_RESULT>>;

/** Evidence row hint: the host for external links, "read →" for pages on this site. */
function evidenceMeta(url: string): string {
  const clean = stegaClean(url);
  if (!isExternal(clean)) return 'read →';
  try {
    return new URL(clean).hostname;
  } catch {
    return 'link';
  }
}

/** Project detail page: `layout` picks case study, pipeline or lab framing of the same content. */
export function ProjectDetail({ project }: { project: ProjectDetailData }) {
  const layout = layoutOf(project);
  const status = statusOf(project);
  const sections = project.sections ?? [];
  const updated = project._updatedAt ? fullDate(project._updatedAt.slice(0, 10)) : null;
  const lab = layout === 'lab' || status === 'learningLab';
  const pipeline = layout === 'pipeline';

  return (
    <main id="main">
      <header className="bg-surface">
        <div className="mx-auto flex max-w-page flex-col gap-5 px-4 pt-6 pb-10 lg:px-10 lg:pt-10 lg:pb-12">
          <nav aria-label="Breadcrumb" className="font-mono text-12 text-muted">
            <Link href="/work" className="inline-flex min-h-11 items-center">
              ← All work
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-12 tracking-data text-muted">{project.code}</span>
            {status && <StatusChip status={status} />}
          </div>
          <h1 className="m-0 max-w-245 text-44 leading-[1.02] font-semibold tracking-title lg:text-72">
            {project.title}
          </h1>
          <p className="m-0 max-w-190 text-18 leading-[1.55] text-body lg:text-20">
            {project.summary}
          </p>
          <SpecStrip
            items={[
              { label: 'Role', value: project.role },
              { label: 'Started', value: project.started ? monthYear(project.started) : null },
              { label: 'Updated', value: updated },
              { label: 'Tools', value: project.tools?.join(' · ') },
            ]}
          />
        </div>
      </header>

      <CoverageStrip project={project} />

      {project.recruiterSummary && (
        <section
          aria-label="Summary for recruiters"
          className="border-b border-rule-strong bg-ground"
        >
          <div className="mx-auto flex max-w-page flex-wrap gap-x-10 gap-y-3 px-4 py-8 lg:px-10">
            <span className="min-w-40 font-mono text-11 tracking-label text-signal uppercase">
              In short
            </span>
            <p className="m-0 min-w-0 flex-[1_1_480px] text-18 leading-[1.6] font-medium text-ink">
              {project.recruiterSummary}
            </p>
          </div>
        </section>
      )}

      <div
        className={cx(
          'mx-auto flex max-w-page gap-x-12 gap-y-10 px-4 py-12 lg:px-10 lg:py-16',
          pipeline ? 'flex-col' : 'flex-wrap',
        )}
      >
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-12">
          {lab && (
            <p className="m-0 border border-dashed border-rule-dashed p-4 font-mono text-12 text-body">
              Learning lab: built to practise the workflow, not a production system.
            </p>
          )}
          <RichText value={project.body} />
          {sections.map((section, index) => (
            <section
              key={section._key}
              id={section._key}
              className="flex scroll-mt-6 flex-col gap-5"
            >
              <h2 className="m-0 flex items-baseline gap-4 border-b border-rule-strong pb-3 text-28 font-semibold tracking-heading">
                <span className="font-mono text-13 font-normal text-signal">
                  {sectionNumber(index)}
                </span>
                {section.heading}
              </h2>
              <RichText value={section.body} />
            </section>
          ))}
        </div>

        <aside className="flex min-w-0 flex-[0_1_340px] flex-col gap-6">
          {sections.length > 0 && (
            <nav aria-label="On this page" className="border border-rule-strong bg-surface">
              <p className="m-0 border-b border-rule-strong px-5 py-3.5 font-mono text-11 tracking-label text-muted uppercase">
                On this page
              </p>
              <ol className="m-0 list-none p-0">
                {sections.map((section, index) => (
                  <li key={section._key} className="border-rule not-last:border-b">
                    <a
                      href={`#${section._key}`}
                      className="flex min-h-12 items-center gap-3 px-5 py-2 text-15 text-ink no-underline hover:bg-ground"
                    >
                      <span className="font-mono text-12 text-muted">{sectionNumber(index)}</span>
                      {section.navLabel ?? section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <EvidenceLedger
            rows={(project.evidence ?? []).map((row) => ({
              label: row.label,
              href: row.url,
              meta: evidenceMeta(row.url),
            }))}
          />
        </aside>
      </div>

      <nav
        aria-label="More projects"
        className="mx-auto flex max-w-page flex-wrap gap-4 px-4 pb-22 lg:px-10"
      >
        <NeighbourLink project={project.previous} direction="prev" />
        <NeighbourLink project={project.next} direction="next" />
      </nav>
    </main>
  );
}
