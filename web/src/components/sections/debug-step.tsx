import type { ReactNode } from 'react';
import { sectionNumber } from '@/lib/format';

/** One numbered step of the four-step debugging format. */
export function DebugStep({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-rule-strong pt-6">
      <h2 className="m-0 flex items-baseline gap-4 text-28 font-semibold tracking-heading">
        <span className="font-mono text-13 font-normal text-signal">{sectionNumber(index)}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
