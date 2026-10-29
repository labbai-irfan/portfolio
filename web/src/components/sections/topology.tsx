'use client';

import { Fragment, useState } from 'react';
import { buildTopology, connectedTo, describeTopology, type TopologyNode } from '@/lib/topology';
import { cx } from '@/lib/utils';

const TONE: Record<string, { box: string; kicker: string; sub: string }> = {
  user: { box: 'border border-rule-strong bg-surface', kicker: 'text-muted', sub: 'text-body' },
  build: {
    box: 'border border-signal bg-signal text-on-signal',
    kicker: 'text-on-signal-muted',
    sub: 'text-on-signal-muted',
  },
  host: {
    box: 'border border-bar bg-bar text-on-bar',
    kicker: 'text-on-bar-meta',
    sub: 'text-on-bar-meta',
  },
};
const PLANNED_TONE = {
  box: 'border border-dashed border-rule-dashed bg-surface',
  kicker: 'text-planned',
  sub: 'text-body',
};

/** The interactive diagram: hover or focus a part to light its connections and dim the rest. */
export function Topology({ nodes }: { nodes: TopologyNode[] }) {
  const [active, setActive] = useState<string | null>(null);
  const { chain, others, edges } = buildTopology(nodes);
  if (nodes.length === 0) return null;

  const shown = nodes.find((n) => n.id === active) ?? chain[0]?.node ?? nodes[0];
  const lit = active ? connectedTo(active, edges) : null;
  const nameOf = (id: string) => nodes.find((n) => n.id === id)?.name ?? '';
  const shownEdges = shown
    ? edges
        .filter((e) => e.from === shown.id || e.to === shown.id)
        .map((e) =>
          e.from === shown.id
            ? { text: `${e.label} → ${nameOf(e.to)}`, type: e.type }
            : { text: `${nameOf(e.from)} → ${e.label}`, type: e.type },
        )
    : [];

  function renderNode(node: TopologyNode) {
    const tone = node.state === 'planned' ? PLANNED_TONE : (TONE[node.category] ?? TONE.user!);
    const dimmed = lit !== null && !lit.has(node.id);
    return (
      <button
        key={node.id}
        type="button"
        aria-describedby="topo-detail"
        onMouseEnter={() => setActive(node.id)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(node.id)}
        onBlur={() => setActive(null)}
        className={cx(
          'flex min-h-20 min-w-36 cursor-pointer flex-col items-start gap-0.5 p-3.5 text-left transition-opacity duration-150 motion-reduce:transition-none',
          tone.box,
          dimmed && 'opacity-35',
        )}
      >
        <span className={cx('font-mono text-10 tracking-label uppercase', tone.kicker)}>
          {node.kicker}
        </span>
        <span className="text-15 font-semibold">{node.name}</span>
        {node.sub && <span className={cx('font-mono text-11', tone.sub)}>{node.sub}</span>}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <figure
        aria-labelledby="topo-cap"
        className="m-0 min-w-0 flex-[1_1_100%] border border-rule-strong bg-surface bg-grid"
      >
        <div className="flex flex-col items-stretch gap-2 p-6 lg:flex-row lg:flex-wrap lg:items-center lg:p-8">
          {chain.map(({ node, via }) => (
            <Fragment key={node.id}>
              {via && (
                <span
                  aria-hidden="true"
                  className="flex flex-col items-center gap-0.5 font-mono text-10 text-muted lg:flex-1"
                >
                  <span>{via}</span>
                  <span className="text-18 text-arrow">
                    <span className="lg:hidden">↓</span>
                    <span className="hidden lg:inline">→</span>
                  </span>
                </span>
              )}
              {renderNode(node)}
            </Fragment>
          ))}
        </div>
        {others.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-t border-rule px-6 py-5 lg:px-8">
            <span className="w-full font-mono text-10 tracking-label text-muted uppercase">
              Supporting
            </span>
            {others.map(renderNode)}
          </div>
        )}
        <figcaption
          id="topo-cap"
          className="border-t border-rule bg-surface px-6 py-4 text-13 leading-[1.6] text-muted"
        >
          {describeTopology(nodes, edges)} Hover or focus a part to see what it connects to.
        </figcaption>
      </figure>

      {shown && (
        <aside
          id="topo-detail"
          aria-live="polite"
          className="flex min-w-0 flex-[1_1_100%] flex-col gap-3 border border-rule-strong bg-surface p-6"
        >
          <span className="font-mono text-11 tracking-label text-signal uppercase">
            {shown.kicker}
          </span>
          <h3 className="m-0 text-24 font-semibold tracking-lead">{shown.name}</h3>
          <p className="m-0 text-15 leading-[1.6] text-body">{shown.role}</p>
          {shownEdges.length > 0 && (
            <div className="flex flex-col border-t border-rule pt-3">
              <span className="font-mono text-10 tracking-label text-muted uppercase">
                Connections
              </span>
              {shownEdges.map((edge) => (
                <div
                  key={edge.text}
                  className="flex justify-between gap-3 border-rule py-2 text-14 not-last:border-b"
                >
                  <span>{edge.text}</span>
                  <span className="font-mono text-11 text-muted">{edge.type}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
