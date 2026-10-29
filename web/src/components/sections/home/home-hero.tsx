import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBuildInfo } from '@/lib/build-info';
import type { Fetched } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

type HomeHeroProps = {
  settings: Fetched<SETTINGS_QUERY_RESULT>;
  /** The project page that explains this pipeline, when one exists. */
  pipelineHref: string | null;
};

// The real pipeline behind this site (see .github/workflows/ship.yml, Phase 11).
const PIPELINE = [
  { step: 'Push', detail: 'git push main' },
  { step: 'Check', detail: 'tsc · eslint' },
  { step: 'Build', detail: 'next build' },
  { step: 'Audit', detail: 'axe' },
  { step: 'Deploy', detail: 'vercel' },
];

export function HomeHero({ settings, pipelineHref }: HomeHeroProps) {
  const { shortSha, builtLabel: builtAt } = getBuildInfo();
  const stamp = [
    shortSha && { label: 'Commit', value: shortSha },
    builtAt && { label: 'Built', value: builtAt },
  ].filter((cell): cell is { label: string; value: string } => Boolean(cell));

  return (
    <section className="border-b border-rule-strong">
      <div className="mx-auto max-w-page px-4 pt-10 lg:px-10 lg:pt-14">
        <div className="flex flex-wrap justify-between gap-2 font-mono text-12 tracking-data text-muted uppercase">
          <span>{settings?.headlineLabel}</span>
          <span>{settings?.location}</span>
        </div>
        <h1 className="m-0 mt-7 text-52 leading-[0.95] font-semibold tracking-display lg:text-104">
          {settings?.name}
        </h1>
      </div>

      <div className="mx-auto flex max-w-page flex-wrap gap-12 px-4 pt-8 pb-12 lg:px-10 lg:pt-12 lg:pb-18">
        <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-6 border-t border-rule-strong pt-8">
          <p className="m-0 text-22 leading-[1.22] font-medium tracking-lead lg:text-32">
            {settings?.heroLine}
          </p>
          {settings?.heroParagraph && (
            <p className="m-0 text-17 leading-[1.65] text-body">{settings.heroParagraph}</p>
          )}
          <div className="mt-1 flex flex-wrap gap-3">
            <Button href="/work">
              See the work <span aria-hidden="true">→</span>
            </Button>
            <Button href="/terminal" variant="secondary" className="font-mono text-14">
              <span aria-hidden="true" className="text-signal">
                &gt;_
              </span>{' '}
              Open terminal
            </Button>
            <Button href="/contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </div>

        <figure
          aria-labelledby="hero-pipeline"
          className="m-0 flex min-w-0 flex-[1.45_1_480px] flex-col border border-rule-strong bg-surface"
        >
          <div className="flex flex-wrap justify-between gap-2 bg-bar px-5.5 py-3.5 text-on-bar">
            <span id="hero-pipeline" className="font-mono text-12 tracking-data uppercase">
              This page was shipped by this pipeline
            </span>
            <Link
              href="/infrastructure"
              className="font-mono text-12 text-on-bar-meta no-underline hover:text-on-bar"
            >
              full topology →
            </Link>
          </div>
          <div className="border-b border-rule-strong bg-grid px-5.5 pt-8 pb-7">
            <ol className="m-0 flex list-none flex-wrap gap-y-6 p-0">
              {PIPELINE.map((item, index) => {
                const last = index === PIPELINE.length - 1;
                return (
                  <li key={item.step} className="flex min-w-25 flex-[1_1_100px] flex-col gap-2.5">
                    <div className="flex items-center">
                      <span
                        className={`flex size-8.5 shrink-0 items-center justify-center font-mono text-12 font-semibold ${last ? 'bg-contrast text-on-contrast' : 'bg-signal text-on-signal'}`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {!last && <span aria-hidden="true" className="h-0.5 flex-1 bg-signal" />}
                    </div>
                    <span className="text-15 font-semibold">{item.step}</span>
                    <span className="font-mono text-12 text-body">{item.detail}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          {(stamp.length > 0 || pipelineHref) && (
            <div className="flex flex-wrap font-mono text-12">
              {stamp.length > 0 && (
                <dl className="m-0 flex flex-[1_1_auto] flex-wrap">
                  {stamp.map((cell) => (
                    <div
                      key={cell.label}
                      className="min-w-30 flex-[1_1_120px] border-r border-rule px-5.5 py-3.5"
                    >
                      <dt className="tracking-chip text-muted uppercase">{cell.label}</dt>
                      <dd className="m-0 mt-1 text-13">{cell.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {pipelineHref && (
                <div className="flex min-w-40 flex-[1_1_160px] items-center px-5.5 py-1.5">
                  <Link
                    href={pipelineHref}
                    className="flex min-h-11 items-center text-13 font-medium no-underline"
                  >
                    How it ships →
                  </Link>
                </div>
              )}
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}
