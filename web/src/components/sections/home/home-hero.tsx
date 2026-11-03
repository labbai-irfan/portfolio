import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tile } from '@/components/ui/tile';
import type { Fetched } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

type HomeHeroProps = {
  settings: Fetched<SETTINGS_QUERY_RESULT>;
  className?: string;
};

/** The first bento tile: who this is, the one-line pitch, and the two main ways in. */
export function HomeHero({ settings, className }: HomeHeroProps) {
  const meta = [settings?.headlineLabel, settings?.location].filter(Boolean);
  return (
    <Tile
      as="section"
      labelledBy="intro"
      className={cx('flex flex-col gap-8 p-7 md:p-9 lg:p-11', className)}
    >
      <div className="flex flex-col gap-4">
        <h1
          id="intro"
          className="m-0 text-48 leading-[0.95] font-semibold tracking-display text-balance md:text-64 xl:text-72"
        >
          {settings?.name}
        </h1>
        {meta.length > 0 && (
          <p className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-16 text-muted lg:text-17">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-rule pt-8">
        <p className="m-0 text-26 leading-[1.12] font-semibold tracking-heading text-balance lg:text-34">
          {settings?.heroLine}
        </p>
        {settings?.heroParagraph && (
          <p className="m-0 max-w-140 text-17 leading-[1.6] text-body">{settings.heroParagraph}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button href="/work">See the work</Button>
          <Button href="/terminal" variant="secondary">
            Open the terminal
          </Button>
          <Link href="/contact" className="flex min-h-11 items-center text-15 font-medium">
            Get in touch
          </Link>
        </div>
      </div>
    </Tile>
  );
}
