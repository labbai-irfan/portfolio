import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type FigureProps = {
  /** Kicker, e.g. "Fig. 1 — How a command travels". */
  label: string;
  /** Required text equivalent of the diagram ("In words: …"). */
  caption: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Figure({ label, caption, badge, children, className }: FigureProps) {
  return (
    <figure className={cx('m-0 border border-rule-strong bg-surface', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule-strong px-5 py-3">
        <span className="font-mono text-12 tracking-data uppercase">{label}</span>
        {badge}
      </div>
      <div className="bg-grid px-6 py-10">{children}</div>
      <figcaption className="border-t border-rule px-5 py-3.5 text-13 leading-[1.55] text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
