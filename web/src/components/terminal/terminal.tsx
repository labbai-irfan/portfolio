'use client';

import { useEffect } from 'react';
import { TerminalWindow } from '@/components/ui/terminal-window';
import { useTerminalSession } from './terminal-context';
import { TerminalView } from './terminal-view';

const QUICK = ['about', 'projects', 'pipeline', 'skills', 'docker', 'contact'];

const KEYS = [
  ['Enter', 'run'],
  ['Tab', 'autocomplete'],
  ['↑ ↓', 'history'],
  ['clear', 'reset screen'],
  ['exit', 'leave the terminal'],
];

/** The /terminal page: the site-wide session at full size, with shortcuts beside it. */
export function Terminal() {
  const { session } = useTerminalSession();
  const empty = session.lines.length === 0;
  const { print } = session;

  useEffect(() => {
    if (empty) {
      print([
        { kind: 'head', text: 'Portfolio shell' },
        { kind: 'dim', text: 'Type `help` to see what is here. Tab autocompletes.' },
      ]);
    }
    // Only on arrival: an emptied screen (`clear`) stays empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-page flex-wrap items-stretch gap-6 px-4 pb-22 lg:px-10">
      <TerminalWindow
        title={`${session.prompt.replace('$', '').replace(':~', ': ~')}  ·  ${session.count} cmds`}
        className="min-w-0 flex-[999_1_620px] shadow-tile focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-signal"
        bodyClassName="flex min-h-0 flex-1 flex-col"
      >
        <TerminalView session={session} variant="page" autoFocus />
      </TerminalWindow>

      <aside aria-label="Shortcuts" className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
        <div className="flex flex-col gap-2.5 tile p-5">
          <h2 className="m-0 text-14 font-medium text-muted">Try a command</h2>
          {QUICK.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => session.run(command)}
              className="min-h-11 cursor-pointer rounded-control border border-rule-strong bg-surface px-3.5 text-left font-mono text-13 text-ink hover:bg-ground"
            >
              $ {command}
            </button>
          ))}
        </div>
        <dl className="m-0 overflow-hidden tile font-mono text-13">
          {KEYS.map(([key, what]) => (
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
