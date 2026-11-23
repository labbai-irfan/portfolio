'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { openTerminal } from '@/lib/terminal-events';

/**
 * Opens the global terminal overlay. With `growFrom`, the overlay expands out of that element
 * (for example the hero's terminal panel) rather than out of the button itself.
 */
export function OpenTerminalButton({
  growFrom,
  variant = 'secondary',
  className,
  children,
}: {
  growFrom?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button
      variant={variant}
      className={className}
      aria-keyshortcuts="Control+`"
      onClick={(event) =>
        openTerminal((growFrom && document.getElementById(growFrom)) || event.currentTarget)
      }
    >
      {children}
    </Button>
  );
}
