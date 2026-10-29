import { CoverageMark } from '@/components/ui/coverage-mark';
import { coverageOf, type ProjectCardData } from './project-card';

/** Six-stage coverage strip: state mark, abbreviation and name per stage. */
export function CoverageStrip({ project }: { project: Pick<ProjectCardData, 'stageCoverage'> }) {
  return (
    <section aria-label="Stage coverage" className="border-y border-rule-strong bg-surface">
      <ul className="m-0 mx-auto flex max-w-page list-none flex-wrap p-0 lg:px-10">
        {coverageOf(project).map((stage) => (
          <li
            key={stage.key}
            className="flex min-w-1/3 flex-[1_1_0] items-center gap-3 border-b border-rule px-4 py-4 lg:min-w-0 lg:border-r lg:border-b-0 lg:py-5 lg:first:border-l max-lg:[&:nth-child(3n+1)]:pl-4"
          >
            <CoverageMark state={stage.state} />
            <span className="flex flex-col">
              <span className="font-mono text-11 tracking-label text-muted uppercase">
                {stage.abbr}
              </span>
              <span className="text-14 font-medium">{stage.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
