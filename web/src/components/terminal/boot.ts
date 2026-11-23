import type { TermLine } from './commands';

/** sessionStorage key: the boot animation plays once per visit, then the result shows instantly. */
export const BOOT_KEY = 'terminal-booted';

/** The command the hero terminal "types" on arrival. */
export const BOOT_COMMAND = './initialize.sh';

/**
 * The hero terminal's startup. A playful flourish in the voice of a shell script, not a report of
 * real operations: nothing here claims a measured result.
 */
export const BOOT_LINES: TermLine[] = [
  { kind: 'dim', text: 'Initializing engineering workspace…' },
  { kind: 'out', text: 'Loading profile, projects, pipelines…' },
  { kind: 'head', text: 'Environment ready.' },
];
