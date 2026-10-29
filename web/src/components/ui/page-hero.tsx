import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type PageHeroProps = {
  kicker: string;
  heading: string;
  intro?: string | null;
  /** Extra content placed beside the heading block (e.g. a stats strip). */
  aside?: ReactNode;
  className?: string;
};

/** The kicker + H1 + intro pattern shared by Work, Notes, Journey, Experience and Skills. */
export function PageHero({ kicker, heading, intro, aside, className }: PageHeroProps) {
  return (
    <div
      className={cx(
        'mx-auto flex max-w-page flex-wrap items-end justify-between gap-10 px-4 pt-16 pb-9 lg:px-10',
        className,
      )}
    >
      <div className="flex min-w-70 flex-[1.4] flex-col gap-5">
        <span className="font-mono text-12 tracking-label text-signal uppercase">{kicker}</span>
        <h1 className="m-0 max-w-245 text-48 font-semibold tracking-title lg:text-72">{heading}</h1>
        {intro && <p className="m-0 max-w-170 text-17 leading-[1.6] text-body">{intro}</p>}
      </div>
      {aside}
    </div>
  );
}
