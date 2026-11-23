import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type TerminalWindowProps = {
  /** Shown centred in the title bar, like a real terminal's tab title. */
  title: string;
  /** Window controls on the right of the title bar (expand, close…). */
  actions?: ReactNode;
  className?: string;
  /** Classes for the content area. Defaults to padded monospace text. */
  bodyClassName?: string;
  children: ReactNode;
};

/** A terminal window: title bar with the three window buttons, then the content. */
export function TerminalWindow({
  title,
  actions,
  className,
  bodyClassName = 'px-5 py-4 font-mono text-13 leading-[1.8]',
  children,
}: TerminalWindowProps) {
  return (
    <div
      className={cx(
        'flex flex-col overflow-hidden rounded-control border border-term-border bg-term text-term-out',
        className,
      )}
    >
      <div className="relative flex min-h-11 items-center gap-2 border-b border-term-rule bg-term-deep px-4">
        <span aria-hidden="true" className="flex gap-1.75 opacity-80">
          <span className="size-2.75 rounded-full bg-window-close" />
          <span className="size-2.75 rounded-full bg-window-min" />
          <span className="size-2.75 rounded-full bg-window-max" />
        </span>
        <span className="pointer-events-none absolute inset-x-24 truncate text-center font-mono text-12 text-term-hint">
          {title}
        </span>
        {actions && <span className="ml-auto flex items-center gap-1">{actions}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
