import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSearchIndex, filterIndex } from './search-index.ts';

const index = buildSearchIndex(
  [
    {
      code: 'P-02',
      title: 'Containerised app',
      slug: 'app',
      summary: 'Docker and MySQL',
      tools: ['Docker'],
    },
  ],
  [
    {
      code: 'N-01',
      title: 'Container could not reach MySQL',
      slug: 'mysql',
      summary: 'localhost',
      tags: ['networking'],
      category: { title: 'Troubleshooting' },
    },
  ],
);

test('empty query lists everything, grouped in order', () => {
  const all = filterIndex(index, '');
  assert.equal(all.length, index.length);
  assert.deepEqual(
    [...new Set(all.map((i) => i.group))],
    ['Pages', 'Projects', 'Notes', 'Actions'],
  );
});

test('every word must match, across title, summary and keywords', () => {
  assert.deepEqual(
    filterIndex(index, 'docker mysql').map((i) => i.id),
    ['project-app'],
  );
  assert.deepEqual(
    filterIndex(index, 'networking').map((i) => i.id),
    ['note-mysql'],
  );
  assert.deepEqual(filterIndex(index, 'zzz'), []);
});

test('projects and notes link to their pages; the theme action has no link', () => {
  assert.equal(index.find((i) => i.id === 'project-app')?.href, '/work/app');
  assert.equal(index.find((i) => i.id === 'note-mysql')?.href, '/notes/mysql');
  assert.equal(index.find((i) => i.id === 'action-theme')?.href, undefined);
});
