import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBuildInfo } from '@/lib/build-info';
import type { Fetched } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';
import { HeroPipeline } from './hero-pipeline';

type HomeHeroProps = {
  settings: Fetched<SETTINGS_QUERY_RESULT>;
  /** The project page that explains this pipeline, when one exists. */
  pipelineHref: string | null;
};

export function HomeHero({ settings, pipelineHref }: HomeHeroProps) {
  const { shortSha, builtLabel } = getBuildInfo();
  const meta = [settings?.headlineLabel, settings?.location].filter(Boolean);

  return (
    <section className="border-b border-rule-strong">
      <div className="mx-auto max-w-page px-4 pt-12 pb-14 lg:px-10 lg:pt-20 lg:pb-20">
        <h1 className="m-0 text-display font-semibold tracking-display text-balance">
          {settings?.name}
        </h1>
        {meta.length > 0 && (
          <p className="m-0 mt-5 flex flex-wrap gap-x-6 gap-y-1 text-16 text-muted lg:mt-6 lg:text-18">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        )}

        <div className="mt-10 grid gap-10 border-t border-rule-strong pt-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-10 lg:pt-12">
          <div className="flex flex-col lg:col-span-5">
            <p className="m-0 text-28 leading-[1.12] font-semibold tracking-heading text-balance lg:text-40">
              {settings?.heroLine}
            </p>
            {settings?.heroParagraph && (
              <p className="m-0 mt-5 max-w-120 text-17 leading-[1.6] text-body lg:text-18">
                {settings.heroParagraph}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
              <Button href="/work">See the work</Button>
              <Button href="/terminal" variant="secondary">
                Open the terminal
              </Button>
            </div>
            <p className="m-0 mt-4 text-15 text-body">
              Or{' '}
              <Link href="/contact" className="font-medium">
                get in touch
              </Link>
              .
            </p>
          </div>

          <HeroPipeline
            className="lg:col-span-7"
            commit={shortSha}
            built={builtLabel}
            pipelineHref={pipelineHref}
          />
        </div>
      </div>
    </section>
  );
}
