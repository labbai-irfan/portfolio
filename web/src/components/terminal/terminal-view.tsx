'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import { cx } from '@/lib/utils';
import type { TermLine } from './commands';
import type { TerminalSession } from './use-terminal';

const lineStyle: Record<TermLine['kind'], string> = {
  out: 'text-term-out',
  dim: 'text-term-hint',
  head: 'font-semibold text-term-head',
  err: 'text-term-error',
  link: '',
};

type TerminalViewProps = {
  session: TerminalSession;
  /** Commands offered as one-tap buttons above the input (useful on touch screens). */
  quick?: string[];
  /** Height and density: the hero panel, the overlay, or the full page. */
  variant: 'inline' | 'overlay' | 'page';
  /** Called when a link in the output is followed (the overlay closes itself). */
  onNavigate?: () => void;
  autoFocus?: boolean;
  /** Hide the input (a read-only preview on small screens). */
  readOnly?: boolean;
  /** Extra classes for the input row, e.g. to hide it below a breakpoint. */
  inputRowClassName?: string;
};

/** Draws a terminal session: the scrolling output log, then the prompt and input. */
export function TerminalView({
  session,
  quick,
  variant,
  onNavigate,
  autoFocus,
  readOnly,
  inputRowClassName,
}: TerminalViewProps) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [session.lines]);

  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);

  function runAndFocus(command: string) {
    session.run(command);
    input.current?.focus();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={log}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        tabIndex={0}
        className={cx(
          'term-scroll flex-1 overflow-y-auto px-5 pt-4 pb-2 font-mono leading-[1.7] text-term-out',
          variant === 'inline' ? 'text-13' : 'text-14',
          variant === 'page' && 'max-h-130 min-h-105',
        )}
      >
        {session.lines.map((line, index) =>
          line.kind === 'link' && line.href ? (
            <div key={index}>
              <Link
                href={line.href}
                onClick={onNavigate}
                className="text-term-prompt underline underline-offset-3 hover:text-term-head"
              >
                {line.text}
              </Link>
            </div>
          ) : (
            <div
              key={index}
              className={cx(
                'break-words whitespace-pre-wrap',
                lineStyle[line.kind],
                line.text.startsWith(session.prompt) && 'mt-1.5 text-term-prompt',
              )}
            >
              {line.text}
            </div>
          ),
        )}
      </div>

      {quick && quick.length > 0 && !readOnly && (
        <div
          role="group"
          aria-label="Quick commands"
          className="flex gap-2 overflow-x-auto border-t border-term-rule px-5 py-2.5"
        >
          {quick.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => runAndFocus(command)}
              className="min-h-9 shrink-0 cursor-pointer rounded-chip border border-term-control px-3 font-mono text-13 text-term-out hover:border-term-prompt hover:text-term-head"
            >
              {command}
            </button>
          ))}
        </div>
      )}

      {!readOnly && (
        <div
          className={cx(
            'flex items-center gap-2.5 border-t border-term-rule px-5 py-3',
            inputRowClassName,
          )}
        >
          <label
            htmlFor={inputId}
            className="font-mono text-14 whitespace-nowrap text-term-prompt max-sm:text-13"
          >
            {session.prompt}
            <span className="sr-only"> Type a command, then press Enter</span>
          </label>
          <input
            ref={input}
            id={inputId}
            type="text"
            value={session.value}
            onChange={(event) => session.setValue(event.target.value)}
            onKeyDown={session.onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="type help"
            // 16px on phones so iOS does not zoom into the field.
            className="min-h-9 min-w-0 flex-1 border-0 bg-transparent font-mono text-16 text-term-head caret-term-prompt outline-none placeholder:text-term-label sm:text-14"
          />
          <button
            type="button"
            aria-label="Run command"
            onClick={() => runAndFocus(session.value)}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-chip border border-term-control text-term-prompt lg:hidden"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
