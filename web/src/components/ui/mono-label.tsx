/** Small sentence-case heading used to label a block inside a card. */
export function MonoLabel({ children }: { children: string }) {
  return <h3 className="m-0 text-13 font-medium text-muted">{children}</h3>;
}
