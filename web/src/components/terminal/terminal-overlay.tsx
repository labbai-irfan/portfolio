'use client';

import { useEffect, useRef } from 'react';
import { TerminalWindow } from '@/components/ui/terminal-window';
import type { TerminalOrigin } from '@/lib/terminal-events';
import { userOf, type TermLine } from './commands';
import type { TerminalSession } from './use-terminal';
import { TerminalView } from './terminal-view';

const QUICK = ['help', 'about', 'projects', 'pipeline', 'docker', 'contact'];

/** Printed once, the first time the overlay opens in a visit. */
function welcome(name: string | null): TermLine[] {
  const first = name?.split(/\s+/)[0];
  return [
    {
      kind: 'head',
      text: first ? `Welcome to ${first}'s engineering workspace.` : 'Welcome.',
    },
    {
      kind: 'out',
      text: 'Explore projects, skills, infrastructure and the engineering journey from here.',
    },
    { kind: 'dim', text: 'Type `help` to get started. `exit` or Esc closes the terminal.' },
  ];
}

type TerminalOverlayProps = {
  open: boolean;
  /** The element the terminal grows out of, if any. */
  origin: TerminalOrigin | null;
  onClose: () => void;
  session: TerminalSession;
  name: string | null;
};

/**
 * The full terminal, over the page. A native <dialog>: focus stays inside, Esc closes it, and
 * focus returns to whatever opened it. It expands out of the button or panel that opened it
 * (skipped when reduced motion is requested).
 */
export function TerminalOverlay({ open, origin, onClose, session, name }: TerminalOverlayProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const welcomed = useRef(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      if (!welcomed.current) {
        welcomed.current = true;
        session.print(welcome(name));
      }
      el.showModal();
      el.querySelector<HTMLInputElement>('input')?.focus();

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const box = panel.current?.getBoundingClientRect();
      if (origin && box && !reduce) {
        panel.current?.animate(
          [
            {
              transformOrigin: 'top left',
              transform: `translate(${origin.x - box.x}px, ${origin.y - box.y}px) scale(${origin.width / box.width}, ${origin.height / box.height})`,
              opacity: 0.4,
            },
            { transformOrigin: 'top left', transform: 'none', opacity: 1 },
          ],
          { duration: 280, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
        );
      }
    } else if (!open && el.open) {
      el.close();
    }
  }, [open, origin, session, name]);

  return (
    <dialog
      ref={dialog}
      aria-label="Terminal"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      className="m-auto h-[min(680px,calc(100dvh-3rem))] w-[min(980px,calc(100%-2rem))] max-w-none border-0 bg-transparent p-0 backdrop:bg-ink/55 max-md:h-dvh max-md:max-h-none max-md:w-dvw"
    >
      <div ref={panel} className="h-full">
        <TerminalWindow
          title={`${userOf({ name })}@portfolio: ~`}
          className="h-full shadow-window max-md:rounded-none"
          bodyClassName="flex min-h-0 flex-1 flex-col"
          actions={
            <button
              type="button"
              onClick={onClose}
              aria-label="Close terminal"
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
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          }
        >
          <TerminalView session={session} variant="overlay" quick={QUICK} onNavigate={onClose} />
        </TerminalWindow>
      </div>
    </dialog>
  );
}
