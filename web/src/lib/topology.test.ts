import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildTopology, connectedTo, describeTopology, type TopologyNode } from './topology.ts';

const node = (
  id: string,
  name: string,
  state: string,
  connections: [string, string, string][] = [],
): TopologyNode => ({
  id,
  kicker: id.toUpperCase(),
  name,
  sub: null,
  category: 'build',
  state,
  role: '',
  connections: connections.map(([target, label, type]) => ({
    key: `${id}-${target}`,
    target,
    label,
    type,
  })),
});

const nodes = [
  node('me', 'Me', 'live', [
    ['repo', 'git push', 'build'],
    ['cms', 'publishes', 'request'],
  ]),
  node('repo', 'Repo', 'live', [['host', 'deploys', 'build']]),
  node('host', 'Host', 'live', []),
  node('cms', 'CMS', 'live', [['host', 'content', 'request']]),
  node('probe', 'Probe', 'planned', [['host', 'checks', 'planned']]),
];

test('the main chain follows first real connections; the rest are supporting', () => {
  const { chain, others } = buildTopology(nodes);
  assert.deepEqual(
    chain.map((c) => c.node.id),
    ['me', 'repo', 'host'],
  );
  assert.deepEqual(
    chain.map((c) => c.via),
    [null, 'git push', 'deploys'],
  );
  assert.deepEqual(
    others.map((n) => n.id),
    ['cms', 'probe'],
  );
});

test('connections to unknown nodes are dropped, and a cycle ends the chain', () => {
  const loop = [
    node('a', 'A', 'live', [
      ['b', 'x', 'build'],
      ['ghost', 'y', 'build'],
    ]),
    node('b', 'B', 'live', [['a', 'z', 'build']]),
  ];
  const { chain, edges } = buildTopology(loop);
  assert.equal(chain.length, 2);
  assert.equal(edges.length, 2);
});

test('connectedTo includes both directions', () => {
  const { edges } = buildTopology(nodes);
  assert.deepEqual([...connectedTo('host', edges)].sort(), ['cms', 'host', 'probe', 'repo']);
});

test('text equivalent names every connection and flags planned parts', () => {
  const { edges } = buildTopology(nodes);
  const text = describeTopology(nodes, edges);
  assert.match(text, /Me → Repo \(git push\)/);
  assert.match(text, /Probe → Host \(checks, planned\)/);
  assert.match(text, /Planned, not built yet: Probe\./);
});
