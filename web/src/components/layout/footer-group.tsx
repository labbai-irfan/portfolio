import type { ReactNode } from 'react';

export function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-35 flex-1 flex-col">
      <p className="m-0 mb-2.5 font-mono text-11 tracking-label text-muted uppercase">{title}</p>
      {children}
    </div>
  );
}
