export const OPEN_TERMINAL_EVENT = 'open-terminal';

/** Where the terminal should grow from when it opens (the button or panel that opened it). */
export type TerminalOrigin = { x: number; y: number; width: number; height: number };

/**
 * Ask the global terminal (mounted once in the root layout) to open. Pass the element that was
 * clicked so the overlay can expand out of it.
 */
export function openTerminal(from?: Element | null) {
  const box = from?.getBoundingClientRect();
  const origin: TerminalOrigin | undefined = box
    ? { x: box.x, y: box.y, width: box.width, height: box.height }
    : undefined;
  window.dispatchEvent(new CustomEvent(OPEN_TERMINAL_EVENT, { detail: { origin } }));
}
