// Pure layout logic for the infrastructure topology, so it can be unit-tested. Everything here
// is derived from `infraNode` documents; nothing about the site's architecture is hard-coded.

export type TopologyNode = {
  id: string;
  kicker: string;
  name: string;
  sub: string | null;
  category: string;
  state: string;
  role: string;
  connections: { key: string; label: string; type: string; target: string }[];
};

export type TopologyEdge = { from: string; to: string; label: string; type: string };

export type Topology = {
  /** The main flow: starts at the first node and follows each node's first real connection. */
  chain: { node: TopologyNode; via: string | null }[];
  /** Every other node (supporting services, planned parts). */
  others: TopologyNode[];
  edges: TopologyEdge[];
};

export function buildTopology(nodes: TopologyNode[]): Topology {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges: TopologyEdge[] = nodes.flatMap((n) =>
    n.connections
      .filter((c) => byId.has(c.target))
      .map((c) => ({ from: n.id, to: c.target, label: c.label, type: c.type })),
  );

  const chain: Topology['chain'] = [];
  const seen = new Set<string>();
  let current = nodes[0];
  let via: string | null = null;
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.push({ node: current, via });
    const step: TopologyEdge | undefined = edges.find(
      (e) => e.from === current?.id && e.type !== 'planned' && !seen.has(e.to),
    );
    via = step?.label ?? null;
    current = step ? byId.get(step.to) : undefined;
  }

  return { chain, others: nodes.filter((n) => !seen.has(n.id)), edges };
}

/** Ids of the node and everything directly connected to it, in either direction. */
export function connectedTo(id: string, edges: TopologyEdge[]): Set<string> {
  const ids = new Set([id]);
  for (const e of edges) {
    if (e.from === id) ids.add(e.to);
    if (e.to === id) ids.add(e.from);
  }
  return ids;
}

/** The whole diagram as one sentence, for the figure's text equivalent. */
export function describeTopology(nodes: TopologyNode[], edges: TopologyEdge[]): string {
  const name = new Map(nodes.map((n) => [n.id, n.name]));
  const parts = edges.map(
    (e) =>
      `${name.get(e.from)} → ${name.get(e.to)} (${e.label}${e.type === 'planned' ? ', planned' : ''})`,
  );
  const planned = nodes.filter((n) => n.state === 'planned').map((n) => n.name);
  return [
    `In words: ${parts.join('; ')}.`,
    planned.length > 0 ? `Planned, not built yet: ${planned.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
