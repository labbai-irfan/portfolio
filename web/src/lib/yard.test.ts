import assert from 'node:assert/strict';
import { test } from 'node:test';
import { marksFor } from './tech-marks.ts';
import { planYard, type YardEntry } from './yard.ts';

const e = (item: string, tier: string, hasUsage = true): YardEntry<string> => ({
  item,
  tier,
  hasUsage,
});

test('stacks rows learning → projects → work and drops empty tiers', () => {
  const plan = planYard([e('Git', 'work'), e('Jenkins', 'learning'), e('React', 'work')]);
  assert.deepEqual(plan.rows, [
    { tier: 'learning', items: ['Jenkins'] },
    { tier: 'work', items: ['Git', 'React'] },
  ]);
});

test('learning skills without evidence are listed, not drawn', () => {
  const plan = planYard([e('Jenkins', 'learning'), e('Dart', 'learning', false)]);
  assert.deepEqual(plan.rows, [{ tier: 'learning', items: ['Jenkins'] }]);
  assert.deepEqual(plan.alsoLearning, ['Dart']);
});

test('exploring skills go to the dock only', () => {
  const plan = planYard([e('Kubernetes', 'exploring', false), e('Docker', 'projects')]);
  assert.deepEqual(plan.exploring, ['Kubernetes']);
  assert.deepEqual(plan.rows, [{ tier: 'projects', items: ['Docker'] }]);
});

test('unknown tiers are ignored', () => {
  const plan = planYard([e('Mystery', 'expert')]);
  assert.deepEqual(plan, { rows: [], alsoLearning: [], exploring: [] });
});

test('marksFor splits compound names and caps at two marks', () => {
  assert.deepEqual(
    marksFor('MySQL · Prisma').map((m) => m.title),
    ['MySQL', 'Prisma'],
  );
  assert.deepEqual(
    marksFor('React · TypeScript').map((m) => m.title),
    ['React', 'TypeScript'],
  );
  assert.deepEqual(marksFor('AWS'), []);
  assert.deepEqual(
    marksFor('Node.js · Express').map((m) => m.title),
    ['Node.js', 'Express'],
  );
});
