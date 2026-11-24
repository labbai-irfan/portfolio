'use client';

import { useEffect } from 'react';

// Module scope, so client-side navigation and Strict Mode's double effects greet only once.
let greeted = false;

/** A one-line hello for visitors who open DevTools, pointing them to the site's terminal. */
export function ConsoleGreeting({ name }: { name: string | null }) {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.info(
      `%c${name ? `${name}'s portfolio` : 'Portfolio'}%c\nYou opened the console. There is a real terminal on this site too: press Ctrl+\` and type help.`,
      'font-weight: 700; font-size: 13px',
      'font-size: 12px',
    );
  }, [name]);
  return null;
}
