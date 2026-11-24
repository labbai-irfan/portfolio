import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type TerminalWindowProps = {
  /** Shown centred in the title bar, like a real terminal's tab title. */
  title: string;
  /** Window controls on the right of the title bar (expand, close…). */
  actions?: ReactNode;
  /**
   * Frosted glass: lets light behind the window show through and lights its top edge. Stays 90%
   * opaque so terminal text keeps its contrast on the light theme.
   */
  glass?: boolean;
  className?: string;
  /** Classes for the content area. Defaults to padded monospace text. */
  bodyClassName?: string;
  children: ReactNode;
};

/** A terminal window: title bar with the three window buttons, then the content. */
export function TerminalWindow({
  title,
  actions,
  glass,
  className,
  bodyClassName = 'px-5 py-4 font-mono text-13 leading-[1.8]',
  children,
}: TerminalWindowProps) {
  return (
    <div
      className={cx(
        'relative flex flex-col overflow-hidden rounded-control border border-term-border text-term-out',
        glass ? 'bg-term/90 backdrop-blur-xl backdrop-saturate-150' : 'bg-term',
        className,
      )}
    >
      {glass && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-term-prompt/60 to-transparent"
        />
      )}
      <div
        className={cx(
          'relative flex min-h-11 items-center gap-2 border-b border-term-rule px-4',
          glass ? 'bg-term-deep/60' : 'bg-term-deep',
        )}
      >
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
