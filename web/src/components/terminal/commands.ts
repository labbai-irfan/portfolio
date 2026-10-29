// The terminal's brain: a pure function from (input, site data) to output lines. No React, no
// imports at runtime, so `npm test` runs it directly. Every fact it prints comes from
// `TerminalData`, which is built from the same Sanity queries as the pages (lib/terminal-data.ts).

export type TermLine = {
  kind: 'out' | 'dim' | 'head' | 'err' | 'link';
  text: string;
  href?: string;
};

export type TerminalData = {
  name: string | null;
  headlineLabel: string | null;
  location: string | null;
  openToRoles: boolean;
  email: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  projects: {
    code: string;
    title: string;
    slug: string | null;
    status: string;
    statusLabel: string;
  }[];
  /** Skills by tier, in display order. */
  skillTiers: { label: string; names: string[] }[];
  roles: { title: string; organisation: string; dates: string }[];
  /** Milestones already happened, newest first, grouped by year. */
  years: { year: string; titles: string[] }[];
  infra: { kicker: string; name: string; planned: boolean }[];
  commit: string | null;
  built: string | null;
};

export type RunContext = { data: TerminalData; history: string[]; now: Date };
export type RunResult = { lines: TermLine[]; clear?: boolean };

export const COMMAND_NAMES = [
  'help',
  'whoami',
  'ls',
  'pwd',
  'projects',
  'open',
  'skills',
  'experience',
  'journey',
  'pipeline',
  'infra',
  'contact',
  'resume',
  'history',
  'clear',
  'date',
  'echo',
  'sudo',
] as const;

/** The first word of the owner's name, lower-cased: the user in `irfan@portfolio`. */
export function userOf(data: Pick<TerminalData, 'name'>): string {
  return data.name?.split(/\s+/)[0]?.toLowerCase() || 'guest';
}

export function promptOf(data: Pick<TerminalData, 'name'>): string {
  return `${userOf(data)}@portfolio:~$`;
}

const out = (text: string): TermLine => ({ kind: 'out', text });
const dim = (text: string): TermLine => ({ kind: 'dim', text });
const head = (text: string): TermLine => ({ kind: 'head', text });
const err = (text: string): TermLine => ({ kind: 'err', text });
const link = (text: string, href: string): TermLine => ({ kind: 'link', text, href });

const HELP: TermLine[] = [
  head('Available commands'),
  out('  whoami        who I am, in one line'),
  out('  projects      everything I have built, with status'),
  out('  open <id>     open a project, e.g. open p-01'),
  out('  skills        honestly tiered'),
  out('  experience    where I have worked'),
  out('  journey       milestones, newest first'),
  out('  pipeline      how this page was shipped'),
  out('  infra         what this site runs on'),
  out('  contact       how to reach me'),
  out('  resume        the one-page version'),
  out('  ls · pwd · date · echo · history · clear'),
  dim('Tab autocompletes. ↑ ↓ walk through history.'),
];

function projectsTable(data: TerminalData): TermLine[] {
  if (data.projects.length === 0) return [dim('no projects yet')];
  const width = Math.max(6, ...data.projects.map((p) => p.statusLabel.length));
  return [
    head(`${'ID'.padEnd(7)}${'STATUS'.padEnd(width + 2)}PROJECT`),
    ...data.projects.map((p) =>
      out(`${p.code.toLowerCase().padEnd(7)}${p.statusLabel.padEnd(width + 2)}${p.title}`),
    ),
    dim('Run `open <id>` for the detail page.'),
  ];
}

function open(arg: string, data: TerminalData): TermLine[] {
  const project = data.projects.find((p) => p.code.toLowerCase() === arg);
  if (!project) return [err(`open: unknown project "${arg}" — run \`projects\``)];
  if (project.status === 'planned' || !project.slug) {
    return [
      dim(`${project.code.toLowerCase()} is planned — it gets a page once real work exists.`),
    ];
  }
  return [link(`${project.title} →`, `/work/${project.slug}`)];
}

function contact(data: TerminalData): TermLine[] {
  const rows = [
    ['email', data.email],
    ['linkedin', data.linkedinUrl],
    ['github', data.githubUrl],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  return [
    ...rows.map(([label, value]) => out(`${label.padEnd(10)}${value}`)),
    ...(rows.length === 0 ? [dim('No public contact details are published yet.')] : []),
    link('Contact page →', '/contact'),
  ];
}

function pipeline(data: TerminalData): TermLine[] {
  const stamp = [
    data.commit && `commit ${data.commit}`,
    data.built && `built ${data.built}`,
  ].filter(Boolean);
  const siteProject = data.projects.find((p) => p.status === 'shipsWithSite' && p.slug);
  return [
    out('push → check → build → audit → deploy'),
    ...(stamp.length > 0 ? [dim(stamp.join(' · '))] : []),
    link('How the pipeline works →', siteProject ? `/work/${siteProject.slug}` : '/infrastructure'),
  ];
}

/** Run one line of input. Unknown commands are an error line, never a throw. */
export function runCommand(input: string, { data, history, now }: RunContext): RunResult {
  const parts = input.trim().split(/\s+/);
  const cmd = (parts[0] ?? '').toLowerCase();
  const arg = (parts[1] ?? '').toLowerCase();

  switch (cmd) {
    case '':
      return { lines: [] };
    case 'clear':
      return { lines: [], clear: true };
    case 'help':
      return { lines: HELP };
    case 'whoami':
      return {
        lines: [
          out([data.name, data.headlineLabel].filter(Boolean).join(' — ') || userOf(data)),
          dim([data.location, data.openToRoles && 'open to roles'].filter(Boolean).join(' · ')),
        ],
      };
    case 'pwd':
      return { lines: [out(`/home/${userOf(data)}/portfolio`)] };
    case 'ls':
      return {
        lines: [out('projects/   notes/   journey.md   infra.md   resume.pdf   contact.txt')],
      };
    case 'date':
      return { lines: [out(now.toString())] };
    case 'echo':
      return { lines: [out(parts.slice(1).join(' ') || ' ')] };
    case 'projects':
      return { lines: projectsTable(data) };
    case 'open':
      return { lines: open(arg, data) };
    case 'skills':
      return {
        lines: [
          ...data.skillTiers.map((tier) =>
            out(`${tier.label.toLowerCase().padEnd(12)}${tier.names.join(' · ').toLowerCase()}`),
          ),
          link('Full skills table →', '/skills'),
        ],
      };
    case 'experience':
      return {
        lines: [
          ...data.roles.map((r) =>
            out(`${r.dates.toLowerCase().padEnd(24)}${r.title} · ${r.organisation}`),
          ),
          link('Read the details →', '/experience'),
        ],
      };
    case 'journey':
      return {
        lines: [
          ...data.years.map((y) => out(`${y.year}  ${y.titles.join(' · ').toLowerCase()}`)),
          link('Full timeline →', '/journey'),
        ],
      };
    case 'pipeline':
      return { lines: pipeline(data) };
    case 'infra':
      return {
        lines: [
          ...data.infra.map((n) =>
            out(
              `${n.kicker.split(' · ')[0]?.toLowerCase().padEnd(10)}${n.name.toLowerCase()}${n.planned ? ' — planned' : ''}`,
            ),
          ),
          link('Live topology →', '/infrastructure'),
        ],
      };
    case 'contact':
      return { lines: contact(data) };
    case 'resume':
      return { lines: [link('Open the résumé →', '/resume')] };
    case 'history':
      return {
        lines:
          history.length > 0
            ? history.map((c, i) => out(`  ${i + 1}  ${c}`))
            : [dim('no history yet')],
      };
    case 'sudo':
      return {
        lines: [
          err(`${userOf(data)} is not in the sudoers file.`),
          dim('Nice try — `contact` works without root.'),
        ],
      };
    case 'exit':
      return { lines: [dim('No exit here — but `contact` reaches a human.')] };
    default:
      return { lines: [err(`command not found: ${cmd} — type \`help\``)] };
  }
}

export type Completion = { value?: string; options?: string[] };

/** Tab completion: command names, then project ids after `open `. */
export function complete(value: string, data: TerminalData): Completion {
  const lower = value.toLowerCase();
  const space = lower.indexOf(' ');
  if (space === -1) {
    if (!lower) return {};
    const matches = COMMAND_NAMES.filter((name) => name.startsWith(lower));
    if (matches.length === 1) return { value: `${matches[0]} ` };
    return matches.length > 1 ? { options: [...matches] } : {};
  }
  if (lower.slice(0, space) !== 'open') return {};
  const partial = lower.slice(space + 1).trim();
  const ids = data.projects.map((p) => p.code.toLowerCase()).filter((id) => id.startsWith(partial));
  if (ids.length === 1) return { value: `open ${ids[0]}` };
  return ids.length > 1 ? { options: ids } : {};
}
