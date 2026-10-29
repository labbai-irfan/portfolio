import assert from 'node:assert/strict';
import { test } from 'node:test';
import { computeUptime, probe } from './uptime.mjs';

test('uptime is withheld until there are enough samples', () => {
  assert.equal(computeUptime([true, true, true]), null);
  assert.equal(computeUptime(Array(23).fill(true)), null);
  assert.equal(computeUptime(Array(24).fill(true)), 100);
});

test('uptime is the share of successful probes, to one decimal', () => {
  const results = [...Array(167).fill(true), false];
  assert.equal(computeUptime(results), 99.4);
  assert.equal(computeUptime([true, false], 1), 50);
});

test('a site that answers 200 is up; a 500 or a thrown error is down (after one retry)', async () => {
  let calls = 0;
  assert.equal(await probe('https://x.test', async () => ({ ok: true })), true);
  assert.equal(
    await probe('https://x.test', async () => {
      calls++;
      return { ok: false };
    }),
    false,
  );
  assert.equal(calls, 2);
  assert.equal(
    await probe('https://x.test', async () => {
      throw new Error('network');
    }),
    false,
  );
  // Fails once, then recovers on the retry.
  let first = true;
  assert.equal(
    await probe('https://x.test', async () => {
      const ok = !first;
      first = false;
      return { ok };
    }),
    true,
  );
});
