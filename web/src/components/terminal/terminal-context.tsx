'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { OPEN_TERMINAL_EVENT, type TerminalOrigin } from '@/lib/terminal-events';
import type { TerminalData } from './commands';
import { TerminalOverlay } from './terminal-overlay';
import { useTerminal, type TerminalSession } from './use-terminal';

type TerminalContextValue = {
  session: TerminalSession;
  data: TerminalData;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

/** The site-wide terminal session (hero, overlay and /terminal page all draw this one). */
export function useTerminalSession(): TerminalContextValue {
  const value = useContext(TerminalContext);
  if (!value) throw new Error('useTerminalSession must be used inside <TerminalProvider>');
  return value;
}

/**
 * Holds one terminal session for the whole site and mounts the overlay. Anything can open it by
 * calling `openTerminal()` (lib/terminal-events.ts); Ctrl+` opens it from anywhere.
 */
export function TerminalProvider({ data, children }: { data: TerminalData; children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<TerminalOrigin | null>(null);

  const close = useCallback(() => setOpen(false), []);
  // `exit` closes the overlay; typed on the /terminal page (no overlay), it goes home.
  const onExit = useCallback(() => (open ? setOpen(false) : router.push('/')), [open, router]);
  const session = useTerminal(data, { onExit });

  useEffect(() => {
    function onOpen(event: Event) {
      setOrigin((event as CustomEvent<{ origin?: TerminalOrigin }>).detail?.origin ?? null);
      setOpen(true);
    }
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === '`') {
        event.preventDefault();
        setOrigin(null);
        setOpen(true);
      }
    }
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_TERMINAL_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const value = useMemo(() => ({ session, data }), [session, data]);

  return (
    <TerminalContext.Provider value={value}>
      {children}
      <TerminalOverlay
        open={open}
        origin={origin}
        onClose={close}
        session={session}
        name={data.name}
      />
    </TerminalContext.Provider>
  );
}
