import Link from 'next/link';
import { cx } from '@/lib/utils';

// The real pipeline behind this site (see .github/workflows/ship.yml). A genuine sequence, so
// the steps are numbered and joined by one track.
const STEPS = [
  { step: 'Push', command: 'git push main' },
  { step: 'Check', command: 'tsc, eslint' },
  { step: 'Build', command: 'next build' },
  { step: 'Audit', command: 'axe' },
  { step: 'Deploy', command: 'vercel' },
];

type HeroPipelineProps = {
  commit: string | null;
  built: string | null;
  pipelineHref: string | null;
  className?: string;
};

/** The hero's side panel: the five pipeline stages and the stamp of the build you are reading. */
export function HeroPipeline({ commit, built, pipelineHref, className }: HeroPipelineProps) {
  return (
    <figure
      aria-labelledby="hero-pipeline"
      className={cx('m-0 flex min-w-0 flex-col border border-rule-strong bg-surface', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule px-6 py-4 lg:px-8">
        <h2 id="hero-pipeline" className="m-0 text-16 font-semibold">
          How this page reached you
        </h2>
        <Link href="/infrastructure" className="text-14 font-medium">
          Full topology
        </Link>
      </div>

      <ol className="m-0 flex flex-1 list-none flex-col justify-center bg-grid p-0 px-6 py-8 lg:flex-row lg:items-start lg:px-8 lg:py-12">
        {STEPS.map((item, index) => {
          const last = index === STEPS.length - 1;
          return (
            // The last step takes only its own width, so the track spans the whole panel.
            <li
              key={item.step}
              className={cx('flex gap-4 lg:flex-col lg:gap-4', last ? 'lg:flex-none' : 'lg:flex-1')}
            >
              {/* Node and the track to the next node: vertical on phones, horizontal on desktop. */}
              <div aria-hidden="true" className="flex flex-col items-center lg:flex-row">
                <span className="flex size-9 shrink-0 items-center justify-center bg-signal font-mono text-12 font-semibold text-on-signal">
                  {index + 1}
                </span>
                <span
                  className={cx(
                    'w-0.5 flex-1 lg:h-0.5 lg:w-auto',
                    last ? 'bg-transparent' : 'bg-signal',
                  )}
                />
              </div>
              <div className={cx('flex flex-col gap-1 lg:pr-3', !last && 'pb-6 lg:pb-0')}>
                <span className="text-16 font-semibold">
                  <span className="sr-only">Step {index + 1}: </span>
                  {item.step}
                </span>
                <code className="font-mono text-13 text-body">{item.command}</code>
              </div>
            </li>
          );
        })}
      </ol>

      {(commit || built || pipelineHref) && (
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-rule px-6 py-4 lg:px-8">
          {(commit || built) && (
            <dl className="m-0 flex flex-wrap gap-x-8 gap-y-1 text-14">
              {built && (
                <div className="flex gap-2">
                  <dt className="text-muted">Built</dt>
                  <dd className="m-0 font-mono text-13 leading-[1.6]">{built}</dd>
                </div>
              )}
              {commit && (
                <div className="flex gap-2">
                  <dt className="text-muted">Commit</dt>
                  <dd className="m-0 font-mono text-13 leading-[1.6]">{commit}</dd>
                </div>
              )}
            </dl>
          )}
          {pipelineHref && (
            <Link
              href={pipelineHref}
              className="flex min-h-11 items-center text-14 font-medium lg:min-h-0"
            >
              How it ships
            </Link>
          )}
        </div>
      )}
    </figure>
  );
}
