'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '@/lib/utils';
import { complete, promptOf, runCommand, type TermLine, type TerminalData } from './commands';

const QUICK = ['whoami', 'projects', 'pipeline', 'skills', 'journey', 'contact'];

const lineStyle: Record<TermLine['kind'], string> = {
  out: 'text-term-out',
  dim: 'text-term-hint',
  head: 'font-semibold text-term-head',
  err: 'text-term-error',
  link: '',
};

const WELCOME: TermLine[] = [
  { kind: 'head', text: 'Portfolio shell · v1' },
  { kind: 'dim', text: 'Type `help` to see what is here. Tab autocompletes.' },
];

/** The terminal: input, scrolling output log, quick-command buttons. Logic is in commands.ts. */
export function Terminal({ data }: { data: TerminalData }) {
  const prompt = promptOf(data);
  const [lines, setLines] = useState<TermLine[]>(WELCOME);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [count, setCount] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function run(raw: string) {
    const command = raw.trim();
    const nextHistory = command ? [...history, command] : history;
    const result = runCommand(command, { data, history: nextHistory, now: new Date() });
    setHistory(nextHistory);
    setCursor(-1);
    setValue('');
    if (command) setCount((n) => n + 1);
    setLines((prev) =>
      result.clear
        ? []
        : [...prev, { kind: 'out', text: `${prompt} ${command}` } as TermLine, ...result.lines],
    );
    input.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      run(value);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const result = complete(value, data);
      if (result.value) setValue(result.value);
      else if (result.options) {
        setLines((prev) => [...prev, { kind: 'dim', text: result.options?.join('   ') ?? '' }]);
      }
    } else if (event.key === 'ArrowUp' && history.length > 0) {
      event.preventDefault();
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next] ?? '');
    } else if (event.key === 'ArrowDown' && cursor >= 0) {
      event.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue('');
      } else {
        setCursor(next);
        setValue(history[next] ?? '');
      }
    }
  }

  return (
    <div className="mx-auto flex max-w-page flex-wrap items-stretch gap-6 px-4 pb-22 lg:px-10">
      <div className="flex min-w-0 flex-[999_1_620px] flex-col border border-term bg-term text-term-out focus-within:outline-2 focus-within:outline-signal">
        <div className="flex items-center justify-between gap-3 border-b border-term-rule px-4.5 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2.5 rounded-full bg-term-control" />
            ))}
          </span>
          <span className="truncate font-mono text-12 text-term-hint">
            {prompt.replace('$', '').replace(':~', ': ~')}
          </span>
          <span className="font-mono text-11 text-term-hint">{count} cmds</span>
        </div>
        <div
          ref={log}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          tabIndex={0}
          className="max-h-130 min-h-105 flex-1 overflow-y-auto px-5.5 pt-5 pb-2 font-mono text-14 leading-[1.7]"
        >
          {lines.map((line, index) =>
            line.kind === 'link' && line.href ? (
              <div key={index}>
                <Link
                  href={line.href}
                  className="text-term-prompt underline underline-offset-3 hover:text-term-head"
                >
                  {line.text}
                </Link>
              </div>
            ) : (
              <div
                key={index}
                className={cx(
                  'whitespace-pre-wrap',
                  lineStyle[line.kind],
                  line.text.startsWith(prompt) && 'mt-1.5 text-term-prompt',
                )}
              >
                {line.text}
              </div>
            ),
          )}
        </div>
        <div className="flex items-center gap-2.5 border-t border-term-rule px-5.5 pt-3 pb-4.5">
          <label htmlFor="term-in" className="font-mono text-14 whitespace-nowrap text-term-prompt">
            {prompt}
            <span className="sr-only"> Type a command, then press Enter</span>
          </label>
          <input
            ref={input}
            id="term-in"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="type help"
            className="min-h-9 min-w-0 flex-1 border-0 bg-transparent font-mono text-14 text-term-head caret-term-prompt outline-none placeholder:text-term-label"
          />
          <button
            type="button"
            aria-label="Run command"
            onClick={() => run(value)}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center border border-term-control text-term-prompt lg:hidden"
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
      </div>

      <aside aria-label="Shortcuts" className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
        <div className="flex flex-col gap-2.5 border border-rule-strong bg-surface p-5">
          <span className="font-mono text-11 tracking-label text-muted uppercase">
            Try a command
          </span>
          {QUICK.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => run(command)}
              className="min-h-11 cursor-pointer border border-ink bg-surface px-3.5 text-left font-mono text-13 text-ink hover:bg-ground"
            >
              $ {command}
            </button>
          ))}
        </div>
        <dl className="m-0 border border-rule-strong bg-surface font-mono text-13">
          {[
            ['Enter', 'run'],
            ['Tab', 'autocomplete'],
            ['↑ ↓', 'history'],
            ['clear', 'reset screen'],
          ].map(([key, what]) => (
            <div key={key} className="flex justify-between border-rule px-5 py-3 not-last:border-b">
              <dt className="text-muted">{key}</dt>
              <dd className="m-0">{what}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
