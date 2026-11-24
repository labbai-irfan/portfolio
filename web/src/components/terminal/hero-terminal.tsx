'use client';

import { useEffect } from 'react';
import { TerminalWindow } from '@/components/ui/terminal-window';
import { openTerminal } from '@/lib/terminal-events';
import { cx } from '@/lib/utils';
import { BOOT_COMMAND, BOOT_KEY, BOOT_LINES } from './boot';
import { whoami, type TermLine } from './commands';
import { OpenTerminalButton } from './open-terminal-button';
import { useTerminalSession } from './terminal-context';
import { TerminalView } from './terminal-view';

const PANEL_ID = 'hero-terminal';

/**
 * The hero's live terminal: the site-wide session at a fixed size (so nothing below it moves while
 * it types). On a visitor's first arrival it plays a short start-up, then prints a one-time
 * workspace overview (not a re-run of `whoami` as a typed command). On a later load in the same
 * session — or with reduced motion — only the overview appears, instantly: no repeated boot text.
 * Fully usable on desktop; on phones it is a preview with a button that opens the full terminal.
 */
export function HeroTerminal({ className }: { className?: string }) {
  const { session, data } = useTerminalSession();
  const { prompt, print } = session;
  const empty = session.lines.length === 0;

  useEffect(() => {
    // Back on the home page in the same visit: the session already has its history.
    if (!empty) return;
    const overview = whoami(data);

    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOT_KEY) === '1';
      sessionStorage.setItem(BOOT_KEY, '1');
    } catch {
      // Storage blocked (private mode): play the start-up every time, which is harmless.
    }
    if (seen) {
      // Already booted this session: skip the narrative, show only the overview.
      print(overview);
      return;
    }

    const boot: TermLine[] = [{ kind: 'out', text: `${prompt} ${BOOT_COMMAND}` }, ...BOOT_LINES];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || document.hidden) {
      print([...boot, ...overview]);
      return;
    }

    let next = 0;
    let timer = 0;
    const step = () => {
      const line = boot[next];
      if (!line) {
        print(overview);
        return;
      }
      print([line]);
      next += 1;
      // A beat after the typed command, then a steady line rate.
      timer = window.setTimeout(step, next === 1 ? 320 : 140);
    };
    timer = window.setTimeout(step, 450);
    return () => window.clearTimeout(timer);
    // Runs once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <div id={PANEL_ID} className="relative isolate">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 -inset-y-10 -z-10 spotlight lg:-inset-10"
        />
        <TerminalWindow
          glass
          title={`${prompt.replace('$', '').replace(':~', ': ~')}`}
          className="h-80 shadow-window md:h-100 lg:h-110"
          bodyClassName="flex min-h-0 flex-1 flex-col"
          actions={
            <button
              type="button"
              aria-label="Open the terminal full screen"
              onClick={() => openTerminal(document.getElementById(PANEL_ID))}
              className="flex size-9 cursor-pointer items-center justify-center rounded-chip text-term-hint hover:bg-term-rule hover:text-term-head"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M8.5 1.5h4v4M5.5 12.5h-4v-4M12.5 1.5 8 6M1.5 12.5 6 8" />
              </svg>
            </button>
          }
        >
          <TerminalView session={session} variant="inline" inputRowClassName="max-md:hidden" />
        </TerminalWindow>
      </div>
      {/* Phones: the panel is a preview; typing happens in the full-screen terminal. */}
      <OpenTerminalButton growFrom={PANEL_ID} className="md:hidden">
        Open the terminal
      </OpenTerminalButton>
    </div>
  );
}
