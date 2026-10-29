'use client';

import { useState } from 'react';

const labels = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' } as const;

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<keyof typeof labels>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-11 cursor-pointer border border-term-control bg-transparent px-4 font-mono text-12 text-term-out hover:border-term-out"
    >
      <span aria-live="polite">{labels[status]}</span>
    </button>
  );
}
