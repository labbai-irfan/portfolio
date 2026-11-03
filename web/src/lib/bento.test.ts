import assert from 'node:assert/strict';
import { test } from 'node:test';
import { packRows } from './bento.ts';

const spans = (prefs: number[], cols = 12) =>
  packRows(
    prefs.map((prefer, i) => ({ item: i, prefer })),
    cols,
  ).map((t) => t.span);

/** Every row must add up to exactly `cols`. */
function rowsAreFull(result: number[], cols = 12) {
  let used = 0;
  for (const span of result) {
    used += span;
    assert.ok(used <= cols, `row overflows: ${result.join(',')}`);
    if (used === cols) used = 0;
  }
  assert.equal(used, 0, `last row is not full: ${result.join(',')}`);
}

test('tiles that fit keep their preferred width', () => {
  assert.deepEqual(spans([7, 5, 3, 3, 3, 3]), [7, 5, 3, 3, 3, 3]);
});

test('a tile that does not fit starts a new row; the short row shares the spare columns', () => {
  assert.deepEqual(spans([8, 6, 6]), [12, 6, 6]);
  assert.deepEqual(spans([6, 4, 5, 7]), [7, 5, 5, 7]);
});

test('the last row is always filled', () => {
  assert.deepEqual(spans([8, 4, 4]), [8, 4, 12]);
  assert.deepEqual(spans([4, 4]), [6, 6]);
  assert.deepEqual(spans([3, 3, 3, 5]), [4, 4, 4, 12]);
});

test('any mix of widths produces full rows, in order', () => {
  for (const prefs of [[5, 5, 5, 5], [12], [3, 9, 6, 6, 7], [1, 2, 3, 4, 5, 6], [11, 11]]) {
    rowsAreFull(spans(prefs));
  }
  rowsAreFull(spans([3, 3, 6, 3], 6), 6);
});

test('out-of-range widths are clamped', () => {
  assert.deepEqual(spans([20, 0]), [12, 12]);
});
