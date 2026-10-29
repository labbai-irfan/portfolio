import assert from 'node:assert/strict';
import { test } from 'node:test';
import { complete, promptOf, runCommand, type RunContext, type TerminalData } from './commands.ts';

const data: TerminalData = {
  name: 'Ada Lovelace',
  headlineLabel: 'DevOps · Cloud',
  location: 'London',
  openToRoles: true,
  email: null,
  linkedinUrl: null,
  githubUrl: 'https://github.com/example',
  projects: [
    {
      code: 'P-00',
      title: 'This site',
      slug: 'this-site',
      status: 'shipsWithSite',
      statusLabel: 'ships with site',
    },
    { code: 'P-01', title: 'Lab', slug: 'lab', status: 'learningLab', statusLabel: 'learning lab' },
    { code: 'P-02', title: 'Future', slug: null, status: 'planned', statusLabel: 'planned' },
  ],
  skillTiers: [{ label: 'At work', names: ['Git'] }],
  roles: [{ title: 'Engineer', organisation: 'Acme', dates: 'Apr 2026 — Present' }],
  years: [{ year: '2026', titles: ['Started'] }],
  infra: [
    { kicker: 'CI', name: 'Actions', planned: false },
    { kicker: 'MONITOR · PLANNED', name: 'Uptime', planned: true },
  ],
  commit: 'abc1234',
  built: null,
};
const ctx = (history: string[] = []): RunContext => ({ data, history, now: new Date(0) });
const text = (input: string, history?: string[]) =>
  runCommand(input, ctx(history))
    .lines.map((l) => l.text)
    .join('\n');

test('every command prints something, and unknown ones are an error line', () => {
  for (const cmd of [
    'help',
    'whoami',
    'ls',
    'pwd',
    'projects',
    'skills',
    'experience',
    'journey',
    'pipeline',
    'infra',
    'contact',
    'resume',
    'date',
  ]) {
    assert.ok(runCommand(cmd, ctx()).lines.length > 0, cmd);
  }
  assert.equal(runCommand('nope', ctx()).lines[0]?.kind, 'err');
  assert.deepEqual(runCommand('   ', ctx()).lines, []);
});

test('output comes from the data, not from the code', () => {
  assert.match(text('whoami'), /Ada Lovelace — DevOps · Cloud/);
  assert.match(text('projects'), /p-01 {3}learning lab/);
  assert.match(text('experience'), /Engineer · Acme/);
  assert.match(text('infra'), /uptime\s+— planned|uptime {3}— planned|monitor\s+uptime — planned/);
  assert.equal(promptOf(data), 'ada@portfolio:~$');
});

test('contact shows only details that exist', () => {
  const lines = text('contact');
  assert.match(lines, /github\s+https:\/\/github.com\/example/);
  assert.doesNotMatch(lines, /email/);
});

test('open links real pages, explains planned ones, rejects unknown ones', () => {
  assert.deepEqual(runCommand('open p-01', ctx()).lines, [
    { kind: 'link', text: 'Lab →', href: '/work/lab' },
  ]);
  assert.match(text('open P-02'), /planned/);
  assert.equal(runCommand('open p-99', ctx()).lines[0]?.kind, 'err');
});

test('clear, history and the sudo easter egg', () => {
  assert.equal(runCommand('clear', ctx()).clear, true);
  assert.match(text('history', ['whoami']), /1 {2}whoami/);
  assert.match(text('sudo rm -rf'), /not in the sudoers file/);
});

test('pipeline hides stamp fields that are missing', () => {
  const lines = text('pipeline');
  assert.match(lines, /commit abc1234/);
  assert.doesNotMatch(lines, /built/);
});

test('tab completion: names, ambiguity, and project ids', () => {
  assert.deepEqual(complete('who', data), { value: 'whoami ' });
  assert.deepEqual(complete('p', data).options, ['pwd', 'projects', 'pipeline']);
  assert.deepEqual(complete('open p-0', data).options, ['p-00', 'p-01', 'p-02']);
  assert.deepEqual(complete('open p-01', data), { value: 'open p-01' });
  assert.deepEqual(complete('zzz', data), {});
});
