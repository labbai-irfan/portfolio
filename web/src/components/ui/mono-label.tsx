/** Small upper-case mono heading used to label a block inside a card. */
export function MonoLabel({ children }: { children: string }) {
  return <h3 className="m-0 font-mono text-11 tracking-label text-muted uppercase">{children}</h3>;
}
