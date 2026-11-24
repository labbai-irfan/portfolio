// The terminal's brain: a pure function from (input, site data) to output lines. No React, no
// imports at runtime, so `npm test` runs it directly. Every fact it prints comes from
// `TerminalData`, which is built from the same Sanity queries as the pages (lib/terminal-data.ts).

export type TermLine = {
  kind: 'out' | 'dim' | 'head' | 'err' | 'link';
  text: string;
  href?: string;
  /** On an echoed command line: whether the command succeeded (no error lines) or failed. */
  status?: 'ok' | 'fail';
};

/** Something a command asks the page to do, beyond printing. */
export type TermAction = { kind: 'scroll'; target: string } | { kind: 'shake' };

/** Where `deploy` takes the visitor: an element id on the home page. */
export const DEPLOY_TARGET = 'yard';

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
    /** Tools used, as listed on the project. */
    tools: string[];
  }[];
  /** Site settings → Summary cells: the 60-second read. */
  summary: { label: string; value: string }[];
  /** Container skills (Docker and friends), with what they were used in. */
  containers: { name: string; tierLabel: string; usedIn: string[] }[];
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
export type RunResult = {
  lines: TermLine[];
  clear?: boolean;
  /** Close the terminal: the overlay closes; the full page goes home. */
  exit?: boolean;
  action?: TermAction;
};

export const COMMAND_NAMES = [
  'help',
  'about',
  'whoami',
  'ls',
  'pwd',
  'projects',
  'open',
  'skills',
  'experience',
  'journey',
  'pipeline',
  'deploy',
  'docker',
  'infra',
  'neofetch',
  'contact',
  'resume',
  'history',
  'clear',
  'date',
  'echo',
  'sudo',
  'exit',
] as const;

/** The site's own pages, as `docker ps` lists them. Fixed routes, not content. */
const PAGES = [
  'work',
  'notes',
  'journey',
  'experience',
  'skills',
  'infrastructure',
  'contact',
  'resume',
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
  out('  about         who I am, and the 60-second summary'),
  out('  whoami        who I am, in one line'),
  out('  projects      everything I have built, with status'),
  out('  open <id>     open a project, e.g. open p-01'),
  out('  skills        honestly tiered'),
  out('  experience    where I have worked'),
  out('  journey       milestones, newest first'),
  out('  pipeline      how this page was shipped'),
  out('  deploy        ship down to the container yard'),
  out('  docker        container skills, and the projects that use them'),
  out('  infra         what this site runs on'),
  out('  neofetch      the system summary'),
  out('  contact       how to reach me'),
  out('  resume        the one-page version'),
  out('  ls · pwd · date · echo · history · clear · exit'),
  dim('Tab autocompletes. ↑ ↓ walk through history. A few commands are not on this list.'),
];

const TEAPOT: TermLine[] = [
  err("HTTP/1.1 418 I'm a teapot"),
  out('      ( (     '),
  out('       ) )    '),
  out('    ........  '),
  out('    |      |] '),
  out('    \\      /  '),
  out("     `----'   "),
  dim('RFC 2324: this server only brews tea. `contact` works for coffee.'),
];

const NEOFETCH_SKILLS = 4;

const NEOFETCH_ART = [
  '┌──────────────┐',
  '│ >_           │',
  '│              │',
  '│              │',
  '└──────┬───────┘',
  '    ───┴───     ',
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

/** Who-am-I summary: one line of identity, one of status. Also the hero's post-boot overview. */
export function whoami(data: TerminalData): TermLine[] {
  return [
    out([data.name, data.headlineLabel].filter(Boolean).join(' — ') || userOf(data)),
    dim([data.location, data.openToRoles && 'open to roles'].filter(Boolean).join(' · ')),
  ];
}

function docker(data: TerminalData): TermLine[] {
  const using = data.projects.filter((p) =>
    p.tools.some((tool) => /docker|compose|container/i.test(tool)),
  );
  if (data.containers.length === 0 && using.length === 0) {
    return [dim('No container work is published yet.')];
  }
  const width = Math.max(8, ...data.containers.map((s) => s.name.length));
  return [
    ...(data.containers.length > 0 ? [head('Skills')] : []),
    ...data.containers.map((s) => {
      const used = s.usedIn.length > 0 ? ` · ${s.usedIn.join(', ')}` : '';
      return out(`  ${s.name.padEnd(width + 2)}${s.tierLabel.toLowerCase()}${used}`);
    }),
    ...(using.length > 0 ? [head('Projects')] : []),
    ...using.map((p) =>
      p.slug && p.status !== 'planned'
        ? link(`${p.code.toLowerCase()}  ${p.title} →`, `/work/${p.slug}`)
        : dim(`${p.code.toLowerCase()}  ${p.title} — ${p.statusLabel}`),
    ),
  ];
}

/** The build stamp (commit, build time) as one dim line, or nothing when neither is known. */
function buildStamp(data: TerminalData): TermLine[] {
  const stamp = [
    data.commit && `commit ${data.commit}`,
    data.built && `built ${data.built}`,
  ].filter(Boolean);
  return stamp.length > 0 ? [dim(stamp.join(' · '))] : [];
}

function pipeline(data: TerminalData): TermLine[] {
  const siteProject = data.projects.find((p) => p.status === 'shipsWithSite' && p.slug);
  return [
    out('push → check → build → audit → deploy'),
    ...buildStamp(data),
    link('How the pipeline works →', siteProject ? `/work/${siteProject.slug}` : '/infrastructure'),
  ];
}

function deploy(data: TerminalData): RunResult {
  return {
    lines: [
      dim('deploy: production ships from CI, not from a browser tab.'),
      out('push → check → build → audit → deploy'),
      ...buildStamp(data),
      out('↓ heading down to the container yard…'),
    ],
    action: { kind: 'scroll', target: DEPLOY_TARGET },
  };
}

/** Pages and projects as a `docker ps` (or `kubectl get pods`) table. Rows with a page link to it. */
function containerTable(data: TerminalData, kind: 'CONTAINER' | 'POD'): TermLine[] {
  const rows = [
    ...PAGES.map((page) => ({ id: page, status: 'page', name: `/${page}`, href: `/${page}` })),
    ...data.projects.map((p) => ({
      id: p.code.toLowerCase(),
      status: p.statusLabel,
      name: p.title,
      href: p.slug && p.status !== 'planned' ? `/work/${p.slug}` : null,
    })),
  ];
  const idWidth = Math.max(kind.length, ...rows.map((r) => r.id.length)) + 3;
  const statusWidth = Math.max(6, ...rows.map((r) => r.status.length)) + 3;
  const row = (r: { id: string; status: string; name: string }) =>
    `${r.id.padEnd(idWidth)}${r.status.padEnd(statusWidth)}${r.name}`;
  return [
    head(row({ id: kind, status: 'STATUS', name: 'NAME' })),
    ...rows.map((r) => (r.href ? link(`${row(r)} →`, r.href) : dim(row(r)))),
  ];
}

/** An ASCII mark beside a system summary, every value from the site's data. */
function neofetch(data: TerminalData): TermLine[] {
  const user = `${userOf(data)}@portfolio`;
  const facts: [string, string | null][] = [
    ['Name', data.name],
    ['Role', data.headlineLabel],
    ['Location', data.location],
    ...data.infra
      .filter((n) => !n.planned && !/people/i.test(n.kicker))
      .map((n): [string, string] => {
        const key = n.kicker.split(' · ')[0] ?? n.kicker;
        // Acronyms (CI, CDN) stay upper-case; words become Title case.
        const label =
          key.length <= 3
            ? key.toUpperCase()
            : key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        return [label, n.name];
      }),
    // A summary, not the table: a few names per tier keeps each line beside the art.
    ...data.skillTiers.map((t): [string, string] => {
      const more = t.names.length - NEOFETCH_SKILLS;
      return [
        t.label,
        t.names.slice(0, NEOFETCH_SKILLS).join(', ') + (more > 0 ? ` +${more} more` : ''),
      ];
    }),
    ['Commit', data.commit],
  ];
  const info = [
    user,
    '─'.repeat(user.length),
    ...facts.filter((f): f is [string, string] => Boolean(f[1])).map(([k, v]) => `${k}: ${v}`),
  ];
  const artWidth = (NEOFETCH_ART[0]?.length ?? 0) + 3;
  return Array.from({ length: Math.max(NEOFETCH_ART.length, info.length) }, (_, i) =>
    out(`${(NEOFETCH_ART[i] ?? '').padEnd(artWidth)}${info[i] ?? ''}`.trimEnd()),
  );
}

function sudo(parts: string[], data: TerminalData): RunResult {
  const denied = err(`${userOf(data)} is not in the sudoers file. This incident will be reported.`);
  if ((parts[1] ?? '').toLowerCase() !== 'rm') {
    return { lines: [denied, dim('Nice try — `contact` works without root.')] };
  }
  const target = parts.slice(2).find((p) => !p.startsWith('-')) ?? '/';
  return {
    lines: [
      denied,
      err(`rm: cannot remove '${target}': Permission denied`),
      dim('(Nothing was reported, and nothing was removed. `contact` works without root.)'),
    ],
    action: { kind: 'shake' },
  };
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
      return { lines: whoami(data) };
    case 'about':
      return {
        lines: [
          ...whoami(data),
          ...data.summary.map((cell) => out(`${cell.label.toLowerCase().padEnd(18)}${cell.value}`)),
          link('Experience →', '/experience'),
        ],
      };
    case 'docker':
      return { lines: arg === 'ps' ? containerTable(data, 'CONTAINER') : docker(data) };
    case 'kubectl':
      if (arg === 'get' && /^(pods?|po)$/.test((parts[2] ?? '').toLowerCase())) {
        return {
          lines: [
            dim('No cluster here: Kubernetes is on my exploring list, not in production.'),
            dim('The same parts, as pods:'),
            ...containerTable(data, 'POD'),
          ],
        };
      }
      return { lines: [err('kubectl: try `kubectl get pods`')] };
    case 'deploy':
      return deploy(data);
    case 'neofetch':
      return { lines: neofetch(data) };
    case 'coffee':
      return { lines: TEAPOT };
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
      return sudo(parts, data);
    case 'exit':
      return { lines: [dim('Closing the terminal.')], exit: true };
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
