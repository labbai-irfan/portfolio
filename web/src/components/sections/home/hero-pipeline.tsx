import Link from 'next/link';
import { Tile } from '@/components/ui/tile';
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
  pipelineHref: string | null;
  className?: string;
};

/**
 * The pipeline tile: the five stages this page passed through. It is the one tile with real depth:
 * the steps sit on a plane tilted slightly away from the viewer (flat when motion is reduced).
 */
export function HeroPipeline({ pipelineHref, className }: HeroPipelineProps) {
  return (
    <Tile
      as="section"
      labelledBy="hero-pipeline"
      className={cx('flex flex-col overflow-hidden', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-7 pt-7 md:px-8">
        <h2 id="hero-pipeline" className="m-0 text-18 font-semibold">
          How this page reached you
        </h2>
        <Link href="/infrastructure" className="text-14 font-medium">
          Full topology
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center bg-grid px-7 py-8 [perspective:1100px] md:px-8">
        <ol className="m-0 flex w-full max-w-90 list-none flex-col gap-2.5 p-0 motion-safe:[transform-origin:50%_100%] motion-safe:[transform:rotateX(14deg)]">
          {STEPS.map((item, index) => (
            <li
              key={item.step}
              className="flex items-center gap-4 rounded-chip border border-rule bg-surface px-4 py-3 shadow-tile"
            >
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-chip bg-signal font-mono text-12 font-semibold text-on-signal"
              >
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-16 font-semibold">
                  <span className="sr-only">Step {index + 1}: </span>
                  {item.step}
                </span>
                <code className="font-mono text-13 text-body">{item.command}</code>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {pipelineHref && (
        <div className="border-t border-rule px-7 py-4 md:px-8">
          <Link href={pipelineHref} className="flex min-h-11 items-center text-14 font-medium">
            How it ships
          </Link>
        </div>
      )}
    </Tile>
  );
}
