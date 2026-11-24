import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  complete,
  DEPLOY_TARGET,
  promptOf,
  runCommand,
  type RunContext,
  type TerminalData,
} from './commands.ts';

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
      tools: ['Next.js'],
    },
    {
      code: 'P-01',
      title: 'Lab',
      slug: 'lab',
      status: 'learningLab',
      statusLabel: 'learning lab',
      tools: ['Docker', 'MySQL'],
    },
    {
      code: 'P-02',
      title: 'Future',
      slug: null,
      status: 'planned',
      statusLabel: 'planned',
      tools: ['Docker Compose'],
    },
  ],
  summary: [{ label: 'Targeting', value: 'DevOps roles' }],
  containers: [{ name: 'Docker', tierLabel: 'In projects', usedIn: ['Lab'] }],
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

test('about adds the summary cells to whoami', () => {
  const lines = text('about');
  assert.match(lines, /Ada Lovelace — DevOps · Cloud/);
  assert.match(lines, /targeting\s+DevOps roles/);
});

test('docker lists container skills and the projects that use Docker, honestly', () => {
  const result = runCommand('docker', ctx());
  const all = result.lines.map((l) => l.text).join('\n');
  assert.match(all, /Docker\s+in projects · Lab/);
  // A real project links to its page; a planned one is shown, but not as a link.
  assert.ok(result.lines.some((l) => l.kind === 'link' && l.href === '/work/lab'));
  assert.ok(result.lines.some((l) => l.kind === 'dim' && /p-02\s+Future — planned/.test(l.text)));
  assert.ok(!all.includes('This site'));
});

test('docker says so when there is no container work', () => {
  const empty = { ...data, containers: [], projects: [] };
  assert.match(
    runCommand('docker', { data: empty, history: [], now: new Date(0) }).lines[0]!.text,
    /No container work/,
  );
});

test('deploy explains CI, shows the real stamp, and asks the page to scroll', () => {
  const result = runCommand('deploy', ctx());
  const all = result.lines.map((l) => l.text).join('\n');
  assert.match(all, /ships from CI/);
  assert.match(all, /commit abc1234/);
  assert.doesNotMatch(all, /built/);
  assert.deepEqual(result.action, { kind: 'scroll', target: DEPLOY_TARGET });
});

test('sudo rm -rf / is denied, says nothing was logged, and shakes', () => {
  const result = runCommand('sudo rm -rf /', ctx());
  const all = result.lines.map((l) => l.text).join('\n');
  assert.match(all, /cannot remove '\/': Permission denied/);
  assert.match(all, /Nothing was reported/);
  assert.deepEqual(result.action, { kind: 'shake' });
  assert.equal(runCommand('sudo ls', ctx()).action, undefined);
});

test('docker ps lists pages and projects; only real pages are links', () => {
  const lines = runCommand('docker ps', ctx()).lines;
  assert.match(lines[0]!.text, /^CONTAINER\s+STATUS\s+NAME$/);
  assert.ok(lines.some((l) => l.kind === 'link' && l.href === '/work'));
  assert.ok(lines.some((l) => l.kind === 'link' && l.href === '/work/lab'));
  const planned = lines.find((l) => l.text.startsWith('p-02'));
  assert.equal(planned?.kind, 'dim');
  assert.match(planned!.text, /planned\s+Future/);
});

test('kubectl get pods is honest that there is no cluster', () => {
  const lines = runCommand('kubectl get pods', ctx()).lines;
  assert.match(lines[0]!.text, /not in production/);
  assert.ok(lines.some((l) => /^POD\s+STATUS\s+NAME$/.test(l.text)));
  assert.equal(runCommand('kubectl apply', ctx()).lines[0]?.kind, 'err');
});

test('neofetch prints only facts from the data', () => {
  const all = text('neofetch');
  assert.match(all, /ada@portfolio/);
  assert.match(all, /Role: DevOps · Cloud/);
  assert.match(all, /CI: Actions/);
  assert.match(all, /At work: Git/);
  assert.match(all, /Commit: abc1234/);
  // Planned infrastructure and missing values are left out.
  assert.doesNotMatch(all, /Uptime|Email/);
});

test('neofetch summarises long skill tiers', () => {
  const many = {
    ...data,
    skillTiers: [{ label: 'Learning', names: ['A', 'B', 'C', 'D', 'E', 'F'] }],
  };
  const all = runCommand('neofetch', { data: many, history: [], now: new Date(0) })
    .lines.map((l) => l.text)
    .join('\n');
  assert.match(all, /Learning: A, B, C, D \+2 more/);
});

test('coffee is a teapot', () => {
  assert.match(text('coffee'), /418 I'm a teapot/);
});

test('exit asks the terminal to close', () => {
  assert.equal(runCommand('exit', ctx()).exit, true);
  assert.equal(runCommand('help', ctx()).exit, undefined);
});
