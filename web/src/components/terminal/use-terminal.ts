'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { complete, promptOf, runCommand, type TermLine, type TerminalData } from './commands';

export type TerminalSession = {
  prompt: string;
  lines: TermLine[];
  value: string;
  setValue: (value: string) => void;
  /** How many commands the visitor has run. */
  count: number;
  /** Bumped each time a command asks the window to shake. */
  shake: number;
  /** Run one line of input, as if typed and Enter pressed. */
  run: (raw: string) => void;
  /** Append lines without running anything (boot sequence, welcome message). */
  print: (lines: TermLine[]) => void;
  /** Enter runs, Tab completes, ↑ ↓ walk history. */
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * One terminal session: output lines, the input value and command history. The commands
 * themselves live in commands.ts; this hook only keeps state, so the same session can be drawn
 * in the hero, the overlay and the /terminal page at once.
 */
export function useTerminal(
  data: TerminalData,
  {
    onExit,
    onScrollTo,
  }: {
    onExit?: () => void;
    /** A command asked to scroll the page to the element with this id. */
    onScrollTo?: (target: string) => void;
  } = {},
): TerminalSession {
  const prompt = promptOf(data);
  const [lines, setLines] = useState<TermLine[]>([]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [count, setCount] = useState(0);
  const [shake, setShake] = useState(0);
  // Read at call time, so new callbacks from the provider never re-create the session.
  const exitRef = useRef(onExit);
  const scrollRef = useRef(onScrollTo);
  useEffect(() => {
    exitRef.current = onExit;
    scrollRef.current = onScrollTo;
  });

  const print = useCallback((more: TermLine[]) => setLines((prev) => [...prev, ...more]), []);

  const run = useCallback(
    (raw: string) => {
      const command = raw.trim();
      const nextHistory = command ? [...history, command] : history;
      const result = runCommand(command, { data, history: nextHistory, now: new Date() });
      setHistory(nextHistory);
      setCursor(-1);
      setValue('');
      if (command) setCount((n) => n + 1);
      const failed = result.lines.some((l) => l.kind === 'err');
      const echo: TermLine = {
        kind: 'out',
        text: `${prompt} ${command}`,
        status: command ? (failed ? 'fail' : 'ok') : undefined,
      };
      setLines((prev) => (result.clear ? [] : [...prev, echo, ...result.lines]));
      if (result.exit) exitRef.current?.();
      const action = result.action;
      if (action) {
        switch (action.kind) {
          case 'scroll':
            scrollRef.current?.(action.target);
            break;
          case 'shake':
            setShake((n) => n + 1);
            break;
          default: {
            const unhandled: never = action;
            throw new Error(`Unhandled terminal action: ${JSON.stringify(unhandled)}`);
          }
        }
      }
    },
    [data, history, prompt],
  );

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      run(value);
    } else if (event.key === 'Tab' && !event.shiftKey && value) {
      // Tab completes while there is something to complete; on an empty line it moves focus on.
      event.preventDefault();
      const result = complete(value, data);
      if (result.value) setValue(result.value);
      else if (result.options) print([{ kind: 'dim', text: result.options.join('   ') }]);
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

  return { prompt, lines, value, setValue, count, shake, run, print, onKeyDown };
}
