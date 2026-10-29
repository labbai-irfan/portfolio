// Seed content for the portfolio dataset. Facts come from MASTER_PROMPT section 3 and the
// owner's answers. Text only the owner can verify is drafted and flagged `needsReview: true`
// with a `reviewNote`. No URLs, metrics, uptime numbers or certifications are invented.
import { bullets, callout, code, p, section } from './blocks';
import { oldProjects, oldRoles, oldSkills } from './old-portfolio';

/** Placeholder for a reference, resolved by seed.ts via the target's natural key. */
export const ref = (type: string, key: string) => ({ __ref: { type, key } });

export type SeedDoc = { _type: string; _id?: string; [field: string]: unknown };

/** Natural key used to detect an existing document (fixed `_id` for singletons). */
export const naturalKey: Record<string, string> = {
  noteCategory: 'slug.current',
  project: 'code',
  note: 'slug.current',
  milestone: 'title',
  role: 'title',
  skill: 'name',
  infraNode: 'name',
};

const slug = (current: string) => ({ _type: 'slug', current });
const cells = (...pairs: [string, string][]) =>
  pairs.map(([label, value]) => ({ _type: 'labelledValue', label, value }));
const coverage = (
  c: Partial<Record<'commit' | 'build' | 'test' | 'ship' | 'run' | 'observe', string>>,
) => ({
  _type: 'stageCoverage',
  commit: 'none',
  build: 'none',
  test: 'none',
  ship: 'none',
  run: 'none',
  observe: 'none',
  ...c,
});

// ── Blog categories ────────────────────────────────────────────────────────────
export const categories: SeedDoc[] = [
  { _type: 'noteCategory', title: 'Troubleshooting', slug: slug('troubleshooting') },
  { _type: 'noteCategory', title: 'Write-up', slug: slug('write-up') },
  { _type: 'noteCategory', title: 'Learning log', slug: slug('learning-log') },
  { _type: 'noteCategory', title: 'Tutorial', slug: slug('tutorial') },
];

// ── Projects (listed in display order) ────────────────────────────────────────
export const projects: SeedDoc[] = [
  {
    _type: 'project',
    code: 'P-01',
    title: 'C2 — Continuous Control',
    slug: slug('c2-continuous-control'),
    status: 'inDevelopment',
    featured: true,
    layout: 'caseStudy',
    summary: 'A Bash CLI that turns repetitive Git workflows into single, predictable commands.',
    recruiterSummary:
      'C2 wraps the Git steps I repeat every day — stage, commit, sync, branch — into short, predictable commands with safety checks. Written in Bash, in active development.',
    tools: ['Bash', 'Git'],
    role: 'Solo',
    started: 'Jun 2026',
    stageCoverage: coverage({ commit: 'implemented' }),
    evidence: [],
    needsReview: true,
    reviewNote:
      'Drafted: start month, command names, module layout, code excerpt, terminal output, decisions, the bug and the lessons. Replace with real C2 details. Add the repository URL under Evidence when it is public.',
    sections: [
      section(
        'Problem & goals',
        'Problem & goals',
        [
          p(
            'Day to day I repeat the same short Git sequences: stage, commit with a message, pull with rebase, push, and clean up merged branches. Each step is simple, but doing them by hand invites small mistakes — pushing to the wrong branch, forgetting to pull first, or committing on a dirty tree.',
          ),
          bullets(
            'G1 — Common workflows run as one command with the same behaviour every time.',
            'G2 — Risky operations stop and ask before they change history.',
            'G3 — Every command exits with a clear status code so it can be scripted.',
          ),
        ].flat(),
      ),
      section(
        'Requirements & constraints',
        'Constraints',
        [
          bullets(
            'Must: run in a plain Bash shell with only Git installed.',
            'Must not: rewrite published history without an explicit confirmation.',
            'Runs on: Bash on Linux and Git Bash on Windows.',
          ),
        ].flat(),
      ),
      section('Architecture', 'Architecture', [
        p(
          'A single entry script parses the subcommand and routes it to a command module. Each module runs Git locally and talks to the remote only when the command needs it.',
        ),
        p(
          'In words: you type "c2 <command>" in the terminal; the c2 entry script parses it and calls the matching module (for example "save" or "sync"); the module runs Git commands locally and pushes or pulls from origin where needed.',
        ),
      ]),
      section('Implementation', 'Implementation', [
        code(
          'c2/bin/c2',
          'bash',
          `
#!/usr/bin/env bash
set -euo pipefail

C2_ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"

cmd="\${1:-help}"
shift || true

case "$cmd" in
  save|sync|branch|clean)
    source "$C2_ROOT/lib/$cmd.sh"
    "c2_$cmd" "$@"
    ;;
  help|-h|--help)
    source "$C2_ROOT/lib/help.sh"
    c2_help
    ;;
  *)
    echo "c2: unknown command '$cmd' (try: c2 help)" >&2
    exit 2
    ;;
esac
`,
        ),
        p(
          'The entry script stays small: it only decides which module to load. Each module is a plain function in its own file, so a new command is one new file and one line in the case statement.',
        ),
      ]),
      section(
        'Decisions & trade-offs',
        'Decisions',
        [
          bullets(
            'Bash over Python or Go — it runs anywhere Git does, with nothing extra to install.',
            'Thin wrapper over Git, not a replacement — every C2 command maps to Git commands you could run by hand.',
            'Fail fast (set -euo pipefail) — a half-finished Git workflow is worse than a stopped one.',
          ),
        ].flat(),
      ),
      section('What broke, and the fix', 'What broke', [
        p(
          'Symptom: "c2 save" committed nothing when run from a subdirectory. Checked: the staging command and the message prompt both worked. Cause: the module ran "git add ." relative to the current folder, not the repository root. Fix: resolve the root with "git rev-parse --show-toplevel" and stage from there.',
        ),
      ]),
      section('Testing, safety & results', 'Testing & results', [
        p(
          'I test commands against throwaway repositories so nothing real is at risk. Commands that force-push or delete branches ask for confirmation first, and a dirty working tree stops "sync" before it pulls.',
        ),
        code(
          'terminal',
          'text',
          `
$ c2 save "Add sync module"
✔ staged 3 files
✔ committed a1b2c3d  Add sync module
$ c2 sync
✔ pulled with rebase (origin/main)
✔ pushed main → origin
`,
        ),
        callout('Evidence only', 'No time-saved numbers are shown until they have been measured.'),
      ]),
      section(
        'Lessons & next',
        'Lessons & next',
        [
          bullets(
            'Small, single-purpose scripts are easier to test than one large one.',
            'Clear exit codes make a CLI usable from other scripts and CI.',
            'Next (planned): lint C2 with ShellCheck in a CI workflow.',
          ),
        ].flat(),
      ),
    ],
  },
  {
    _type: 'project',
    code: 'P-00',
    title: 'This portfolio',
    slug: slug('this-portfolio'),
    status: 'shipsWithSite',
    featured: true,
    layout: 'pipeline',
    summary: 'Type-checked, linted, accessibility-audited and deployed by its own pipeline.',
    recruiterSummary:
      'This site is its own DevOps project: every change goes through a GitHub Actions pipeline — type-check, lint, build, accessibility audit — and only a passing build on main is deployed to Vercel. Content is edited in Sanity and appears without a redeploy.',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity', 'GitHub Actions', 'Vercel'],
    role: 'Solo',
    started: 'Oct 2026',
    stageCoverage: coverage({
      commit: 'implemented',
      build: 'implemented',
      test: 'implemented',
      ship: 'implemented',
      run: 'implemented',
      observe: 'planned',
    }),
    evidence: [],
    needsReview: false,
    sections: [
      section('Architecture', 'Architecture', [
        p(
          'The site is a Next.js app hosted on Vercel. Content lives in Sanity and is fetched live, so publishing in the Studio updates the site without a deploy. Code changes take a different path: they only reach visitors through the pipeline.',
        ),
        p(
          'In words: a push to GitHub starts the ship workflow, which type-checks, lints, builds and audits the site. Only a passing build on main is deployed to Vercel. Vercel serves the pages and reads published content from Sanity.',
        ),
      ]),
      section(
        'The gates',
        'The gates',
        [
          bullets(
            'Check — tsc --noEmit and ESLint. Fails on any type or lint error.',
            'Build — next build. Fails if the production build fails.',
            'Audit — axe against the built pages. Fails on any serious or critical accessibility violation.',
            'Deploy — Vercel CLI. Runs only on main, after every other gate passes.',
          ),
        ].flat(),
      ),
      section(
        'Decisions & trade-offs',
        'Decisions',
        [
          bullets(
            'Pipeline-only production deploys — Vercel’s automatic production deploys are off, so a failing check can never ship.',
            'Content in Sanity, not in code — editing a project or post never needs a code change or a redeploy.',
            'One accent, square edges, real data only — no simulated metrics anywhere on the site.',
          ),
        ].flat(),
      ),
      section('Next · Observe', 'Next', [
        p(
          'Planned: an hourly uptime check that records real results for the status panel, so stage 06 turns solid only when there is real data behind it.',
        ),
      ]),
    ],
  },
  {
    _type: 'project',
    code: 'P-02',
    title: 'Containerised app + MySQL',
    slug: slug('containerised-app-mysql'),
    status: 'learningLab',
    featured: true,
    layout: 'lab',
    summary: 'Volumes, networks and a real connectivity bug, in a two-container lab.',
    recruiterSummary:
      'A learning lab: an application and its MySQL database running as separate Docker containers on a user-defined network, with data on a named volume. The lab’s main lesson came from debugging why the app could not reach the database.',
    tools: ['Docker', 'MySQL', 'Linux'],
    role: 'Solo',
    started: 'Jul 2026',
    stageCoverage: coverage({ build: 'lab', run: 'lab' }),
    evidence: [],
    needsReview: true,
    reviewNote:
      'Drafted: start month, app stack, container/network/volume names, ports, the commands and the step list. Replace with what you actually ran (passwords as env variables).',
    sections: [
      section('Setup', 'Setup', [
        p(
          'Goal: understand images, volumes and container networking by running a real two-tier app.',
        ),
        p(
          'In words: the host reaches the app through a published port. The app and MySQL share a user-defined network, so the app reaches the database by its container name on port 3306. MySQL data lives on a named volume so it survives container restarts.',
        ),
      ]),
      section('Configuration', 'Configuration', [
        code(
          'commands',
          'bash',
          `
docker network create labnet
docker volume create mysql-data

docker run -d --name db --network labnet \\
  -e MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" \\
  -e MYSQL_DATABASE=app \\
  -v mysql-data:/var/lib/mysql \\
  mysql:8

docker build -t lab-app .
docker run -d --name app --network labnet \\
  -e DB_HOST=db -e DB_PORT=3306 \\
  -p 8080:3000 lab-app
`,
        ),
      ]),
      section(
        'What I did, step by step',
        'Steps',
        [
          bullets(
            'Built the app image from a Dockerfile.',
            'Started MySQL with a named volume for its data.',
            'Connected both containers to one user-defined network — this is where it broke.',
            'Restarted the database container and checked the data was still there.',
          ),
        ].flat(),
      ),
      section('What broke', 'What broke', [
        p(
          'The app container could not connect to MySQL even though both containers were running. The full write-up, with every check in order, is in note N-01.',
        ),
      ]),
      section(
        'What I learned · what’s next',
        'Learned & next',
        [
          bullets(
            'Inside a container, localhost means that container — not the host, and not other containers.',
            'On a user-defined network, containers find each other by name.',
            'Next (planned, P-04): run these same containers on AWS, with logs I can read.',
          ),
        ].flat(),
      ),
    ],
  },
  {
    _type: 'project',
    code: 'P-03',
    title: 'CI/CD pipeline lab',
    slug: slug('cicd-pipeline-lab'),
    status: 'learningLab',
    featured: true,
    layout: 'lab',
    summary: 'The same pipeline, built in Jenkins and in GitHub Actions.',
    recruiterSummary:
      'A learning lab: one pipeline — checkout, install, test, build — built twice, once in Jenkins and once in GitHub Actions, to compare what each tool asks of you.',
    tools: ['Jenkins', 'GitHub Actions', 'Node.js'],
    role: 'Solo',
    started: 'Sep 2026',
    stageCoverage: coverage({ build: 'lab', test: 'lab' }),
    evidence: [],
    needsReview: true,
    reviewNote:
      'Drafted: start month, the app under test, both pipeline files and the "what I found" notes. Replace with the files you ran and add screenshots of a passing and a failing run.',
    sections: [
      section('Same stages, two runners', 'Two runners', [
        p(
          'Goal: automate checkout, install, test and build — then compare the two tools honestly.',
        ),
        p(
          'In words: both pipelines run the same four stages on every push. Jenkins runs them on a server I operate; GitHub Actions runs them on a runner GitHub provides.',
        ),
      ]),
      section(
        'How they differ',
        'Differences',
        [
          bullets(
            'Pipeline file — Jenkinsfile (Groovy DSL) vs YAML in .github/workflows.',
            'Where it runs — a controller and agents you run vs GitHub-hosted or self-hosted runners.',
            'Triggers — webhooks, polling and schedules vs repository events, schedules and manual runs.',
            'Extending it — plugins vs reusable actions.',
            'Upkeep — you patch and back up the Jenkins server; GitHub maintains hosted runners.',
          ),
        ].flat(),
      ),
      section('The two configs', 'Configs', [
        code(
          'Jenkinsfile',
          'text',
          `
pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install')  { steps { sh 'npm ci' } }
    stage('Test')     { steps { sh 'npm test' } }
    stage('Build')    { steps { sh 'npm run build' } }
  }
}
`,
        ),
        code(
          '.github/workflows/ci.yml',
          'yaml',
          `
name: ci
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
`,
        ),
      ]),
      section(
        'What I learned · what’s next',
        'Learned & next',
        [
          bullets(
            'Hosted runners remove a whole server from the list of things to maintain.',
            'Keeping stages identical makes the two tools easy to compare.',
            'Next (planned): add a stage that builds and pushes P-02’s image — the step before AWS.',
          ),
        ].flat(),
      ),
    ],
  },
  {
    _type: 'project',
    code: 'P-04',
    title: 'Run it on AWS',
    slug: slug('run-it-on-aws'),
    status: 'planned',
    featured: false,
    layout: 'lab',
    summary: 'Planned: run the containerised app on AWS, with logs and basic monitoring.',
    recruiterSummary:
      'Planned, not started. The next step after the container and CI/CD labs: run the same containers on AWS and make what they are doing visible through logs and metrics.',
    tools: ['AWS', 'Docker'],
    role: 'Solo',
    started: 'Not started',
    stageCoverage: coverage({ ship: 'planned', run: 'planned', observe: 'planned' }),
    evidence: [],
    needsReview: false,
    sections: [
      section(
        'The plan',
        'Plan',
        [
          p('This project is planned. Nothing here has been built yet.'),
          bullets(
            'Ship — push the P-02 image to a registry from a pipeline.',
            'Run — run the app and its database on AWS.',
            'Observe — read the app’s logs and basic metrics in one place.',
          ),
        ].flat(),
      ),
    ],
  },
];

// ── Blog post N-01 ────────────────────────────────────────────────────────────
export const notes: SeedDoc[] = [
  {
    _type: 'note',
    title: 'When my app container couldn’t reach MySQL',
    slug: slug('app-container-could-not-reach-mysql'),
    code: 'N-01',
    category: ref('noteCategory', 'troubleshooting'),
    date: '2026-07-20',
    summary:
      'Both containers were running, but the app kept getting ECONNREFUSED. The cause was one word: localhost.',
    tags: ['docker', 'networking', 'mysql'],
    project: ref('project', 'P-02'),
    needsReview: true,
    reviewNote:
      'Drafted in full: date, error line, the three checks and their output, root cause, fix and prevention. Replace with your real log lines and commands.',
    body: [
      p(
        'In the container lab (P-02) I ran an app and a MySQL database as two separate containers. Both started cleanly, yet every request to the app failed with a database connection error. This is how I worked through it.',
      ),
      callout(
        'Takeaway',
        'Inside a container, localhost is the container itself. Use the other container’s name on a shared network.',
      ),
    ],
    debugSteps: {
      _type: 'debugSteps',
      symptomLine: 'App container logs ECONNREFUSED to MySQL.',
      causeLine: 'DB_HOST was localhost — the app container itself.',
      fixLine: 'Set DB_HOST to the database container name on a shared network.',
      symptom:
        'I started the database and the app in separate containers and opened the app in the browser. The page failed, and the app logs showed it could not connect to MySQL.',
      errorLog: {
        _type: 'codeBlock',
        filename: 'app container logs',
        language: 'text',
        code: 'Error: connect ECONNREFUSED 127.0.0.1:3306',
      },
      checks: [
        {
          _type: 'check',
          command: 'docker ps',
          result: 'Both app and db were up — neither had restarted.',
          outcome: 'ruledOut',
        },
        {
          _type: 'check',
          command: 'docker logs db',
          result: 'MySQL reported "ready for connections" on port 3306.',
          outcome: 'ruledOut',
        },
        {
          _type: 'check',
          command: 'docker exec app printenv DB_HOST',
          result: 'localhost — the app was connecting to itself, not to the db container.',
          outcome: 'foundIt',
        },
      ],
      rootCause:
        'The app read DB_HOST=localhost, a value left over from running everything on my laptop. Inside a container, localhost points at that same container, where nothing listens on 3306. Because the database looked healthy, the error at first seemed like a MySQL problem.',
      explanation:
        'Each container has its own localhost, so the app has to reach MySQL by the db container’s name.',
      fix: {
        before: 'DB_HOST=localhost',
        after: 'DB_HOST=db   # both containers on the user-defined network "labnet"',
      },
      verification:
        'After recreating the app container, its logs showed a successful connection and the page loaded. Restarting the db container kept the data, confirming the volume worked too.',
      prevention:
        'Never default DB_HOST to localhost in container config — set it explicitly per environment, and check printenv first when a container cannot reach a service.',
    },
  },
];

// ── Journey milestones (display order: planned first, then newest first) ──────
const ms = (
  title: string,
  category: string,
  dateLabel: string,
  sortDate: string | null,
  extra: Record<string, unknown> = {},
): SeedDoc => ({
  _type: 'milestone',
  title,
  category,
  dateLabel,
  ...(sortDate ? { sortDate } : {}),
  planned: !sortDate,
  latest: false,
  needsReview: false,
  ...extra,
});
const draftMonth = {
  needsReview: true,
  reviewNote: 'Drafted month. Set the real month and sort date.',
};

export const milestones: SeedDoc[] = [
  ms('Launch this portfolio with its own CI/CD pipeline', 'site', 'Next', null, {
    link: { label: 'How it ships →', reference: ref('project', 'P-00') },
  }),
  ms('Run the containerised app on AWS, with readable logs', 'project', 'Next', null, {
    link: { label: 'See P-04 →', reference: ref('project', 'P-04') },
  }),
  ms(
    'Logs and metrics — see what is running, not just that it deployed',
    'learning',
    'After',
    null,
  ),
  ms('CI/CD pipeline lab with Jenkins and GitHub Actions', 'learning', 'Sep 2026', '2026-09-01', {
    ...draftMonth,
    latest: true,
    link: { label: 'Lab write-up →', reference: ref('project', 'P-03') },
  }),
  ms(
    'Migrated the internal platform database from MariaDB to MySQL',
    'career',
    'Aug 2026',
    '2026-08-01',
    draftMonth,
  ),
  ms(
    'Container lab — debugged an app that could not reach its MySQL container',
    'learning',
    'Jul 2026',
    '2026-07-01',
    {
      ...draftMonth,
      link: {
        label: 'Read the debugging note →',
        reference: ref('note', 'app-container-could-not-reach-mysql'),
      },
    },
  ),
  ms(
    'Started C2 — Continuous Control, a Bash CLI for Git workflows',
    'project',
    'Jun 2026',
    '2026-06-01',
    {
      ...draftMonth,
      link: { label: 'Case study →', reference: ref('project', 'P-01') },
    },
  ),
  ms(
    'Joined WiseTech MEP Consultants as Junior Software Engineer',
    'career',
    'Apr 2026',
    '2026-04-01',
    {
      link: { label: 'Role details →', path: '/experience' },
    },
  ),
  ms(
    'Started M.Sc. Information Technology — Pillai College, Navi Mumbai',
    'education',
    '2026',
    '2026-03-01',
  ),
  ms('Completed B.Sc. Information Technology — AIKTC', 'education', '2026', '2026-02-01'),
  ms('Completed the full-stack internship at Arba Accelerator', 'career', 'Jan 2026', '2026-01-31'),
  ms(
    'Joined Arba Accelerator as a Full-Stack Developer Intern',
    'career',
    'Jul 2025',
    '2025-07-01',
  ),
  ms('Started B.Sc. Information Technology — AIKTC', 'education', '2023', '2023-06-01'),
];

// ── Roles (Experience + Résumé) ───────────────────────────────────────────────
export const roles: SeedDoc[] = [
  {
    _type: 'role',
    kind: 'employment',
    title: 'Junior Software Engineer',
    organisation: 'WiseTech MEP Consultants Pvt. Ltd.',
    location: 'Mumbai',
    startDate: '2026-04-01',
    yearsOnly: false,
    context:
      'I develop modules of the company’s internal HRMS / CRM platform — the system staff use for leads, projects and people.',
    highlights: [
      'Lead ↔ project synchronisation, so a change on one side creates or updates the other.',
      'Bulk lead import from spreadsheets.',
      'Template-based document generation.',
      'Database migration from MariaDB to MySQL, resolving schema incompatibilities.',
    ],
    alsoInRole:
      'A multi-functional position — I also support the business on operations, which keeps me close to the people who use the software.',
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Redux Toolkit',
      'MUI',
      'Node.js',
      'Express',
      'Prisma',
      'MySQL',
    ],
    infrastructureNote:
      'The MariaDB → MySQL migration was operations work: changing a running system’s foundations without breaking what depends on it.',
    needsReview: true,
    reviewNote:
      'Drafted: the "Also in the role" paragraph and the context wording. Highlights and stack are verified.',
  },
  {
    _type: 'role',
    kind: 'internship',
    title: 'Full-Stack Developer Intern',
    organisation: 'Arba Accelerator Company',
    location: 'Mumbai',
    startDate: '2025-07-01',
    endDate: '2026-01-31',
    yearsOnly: false,
    context: 'A full-stack internship building and maintaining web application features.',
    highlights: [
      'Built front-end screens and connected them to REST APIs.',
      'Added and maintained back-end endpoints and database queries.',
      'Fixed bugs reported by the team and reviewed changes through pull requests.',
    ],
    stack: ['React', 'JavaScript', 'Node.js', 'Express', 'MySQL', 'Git'],
    needsReview: true,
    reviewNote:
      'Drafted: location, context, all three responsibilities and the stack. Replace with what you actually did at Arba.',
  },
  {
    _type: 'role',
    kind: 'education',
    title: 'M.Sc. Information Technology',
    organisation: 'Pillai College of Arts, Commerce & Science',
    location: 'Navi Mumbai',
    startDate: '2026-01-01',
    yearsOnly: true,
    context: 'In progress.',
    needsReview: false,
  },
  {
    _type: 'role',
    kind: 'education',
    title: 'B.Sc. Information Technology',
    organisation: 'Anjuman-I-Islam’s Kalsekar Technical Campus',
    location: 'Navi Mumbai',
    startDate: '2023-01-01',
    endDate: '2026-01-01',
    yearsOnly: true,
    context: 'Completed.',
    needsReview: true,
    reviewNote: 'Check the campus location (Navi Mumbai is assumed).',
  },
];

// ── Skills (display order) ────────────────────────────────────────────────────
const sk = (
  name: string,
  group: string,
  tier: string,
  usedIn: unknown[],
  usageNote: string,
): SeedDoc => ({
  _type: 'skill',
  name,
  group,
  tier,
  usedIn,
  usageNote,
  needsReview: false,
});
const wisetech = ref('role', 'Junior Software Engineer');

export const skills: SeedDoc[] = [
  sk(
    'React · TypeScript',
    'application',
    'work',
    [wisetech, ref('project', 'P-00')],
    'HRMS / CRM platform · this site',
  ),
  sk('Node.js · Express', 'application', 'work', [wisetech], 'HRMS / CRM back end'),
  sk('Vite', 'application', 'work', [wisetech], 'HRMS / CRM front end'),
  sk('Tailwind CSS', 'application', 'projects', [ref('project', 'P-00')], 'This site'),
  sk('MySQL · Prisma', 'data', 'work', [wisetech], 'MariaDB → MySQL migration'),
  sk('Git', 'systems', 'work', [wisetech, ref('project', 'P-01')], 'Daily · C2 automates it'),
  sk('Bash', 'systems', 'projects', [ref('project', 'P-01')], 'C2 — Continuous Control'),
  sk(
    'Linux',
    'systems',
    'projects',
    [ref('project', 'P-01'), ref('project', 'P-02')],
    'C2 · container lab',
  ),
  sk(
    'Docker',
    'containers',
    'projects',
    [ref('project', 'P-02'), ref('note', 'app-container-could-not-reach-mysql')],
    'Container lab · debugging note N-01',
  ),
  sk(
    'GitHub Actions',
    'delivery',
    'learning',
    [ref('project', 'P-00'), ref('project', 'P-03')],
    'This site’s pipeline · CI/CD lab',
  ),
  sk('Jenkins', 'delivery', 'learning', [ref('project', 'P-03')], 'CI/CD lab'),
  sk('AWS', 'delivery', 'learning', [ref('project', 'P-04')], 'Planned — P-04'),
  sk('Monitoring · logging', 'delivery', 'learning', [ref('project', 'P-04')], 'Planned — P-04'),
];

// ── Infrastructure parts (diagram order; connections added after all exist) ──
const node = (
  name: string,
  kicker: string,
  sub: string,
  category: string,
  state: 'live' | 'planned',
  role: string,
): SeedDoc => ({
  _type: 'infraNode',
  name,
  kicker,
  sub,
  category,
  state,
  role,
  needsReview: false,
});

export const infraNodes: SeedDoc[] = [
  node(
    'Me',
    'PEOPLE',
    'laptop · git',
    'user',
    'live',
    'Where every change starts. I write code locally and push it; content is edited in Sanity Studio.',
  ),
  node(
    'GitHub repo',
    'SOURCE',
    'main · PRs',
    'build',
    'live',
    'The single source of truth for code. Pushes and pull requests trigger the pipeline.',
  ),
  node(
    'GitHub Actions',
    'CI',
    'check · build · audit',
    'build',
    'live',
    'Runs type-checks, lint, the production build and an accessibility audit. A failure stops the deploy.',
  ),
  node(
    'Vercel',
    'HOSTING',
    'prod · previews',
    'host',
    'live',
    'Receives only passing builds from main, serves the pages over HTTPS from its edge network, and builds a preview for every pull request.',
  ),
  node(
    'Sanity',
    'CONTENT',
    'content lake · studio',
    'host',
    'live',
    'Stores every project, post and setting. Published edits reach the site live, without a redeploy.',
  ),
  node(
    'Visitor',
    'PEOPLE',
    'browser',
    'user',
    'live',
    'You. Pages are rendered by Next.js on Vercel and kept in sync with published content.',
  ),
  node(
    'Custom domain',
    'DNS · PLANNED',
    'not set up',
    'plan',
    'planned',
    'Will point a custom domain at Vercel.',
  ),
  node(
    'Uptime check',
    'MONITOR · PLANNED',
    'scheduled action',
    'plan',
    'planned',
    'An hourly GitHub Actions workflow that requests the site and records the result for the status panel.',
  ),
];

/** Edges, added to a node only if it has no connections yet. [from, to, label, type] */
export const infraEdges: [string, string, string, string][] = [
  ['Me', 'GitHub repo', 'git push', 'build'],
  ['Me', 'Sanity', 'publishes content', 'request'],
  ['GitHub repo', 'GitHub Actions', 'triggers workflow', 'build'],
  ['GitHub Actions', 'Vercel', 'deploys on pass', 'build'],
  ['Sanity', 'Vercel', 'live content', 'request'],
  ['Vercel', 'Visitor', 'serves pages', 'request'],
  ['Custom domain', 'Vercel', 'resolves to', 'planned'],
  ['Uptime check', 'Vercel', 'requests the site hourly', 'planned'],
  ['Uptime check', 'Sanity', 'writes status', 'planned'],
];

// ── Singletons (fixed IDs) ────────────────────────────────────────────────────
const intro = (heading: string, introText: string) => ({
  _type: 'pageIntro',
  heading,
  intro: introText,
});

export const singletons: SeedDoc[] = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Irfan Noor Mohammed',
    resumeName: 'Labbai Irfan Noor Mohammed',
    location: 'Mumbai, India',
    footerTagline: 'DevOps · Cloud · Automation. Mumbai, India.',
    resumeHeadline: 'Software Engineer — DevOps & Cloud',
    resumeSummary:
      'Software engineer building business platforms with React, TypeScript, Node.js and MySQL. Hands-on with Docker, CI/CD, AWS and Linux automation, including a Bash CLI for Git workflows.',
    headlineLabel: 'DevOps · Cloud · Automation',
    heroLine: 'I automate how software ships and runs.',
    heroParagraph:
      'Docker, CI/CD, AWS and Linux — built hands-on and documented, including what broke.',
    summaryCells: cells(
      ['Targeting', 'DevOps, Cloud, SRE, Platform and Infrastructure roles'],
      ['Now', 'Junior Software Engineer at WiseTech MEP · M.Sc. IT · building C2'],
      ['Proof on this site', 'A Git CLI, container and CI/CD labs, and this site’s own pipeline'],
    ),
    openToRoles: true,
    rolesWanted: ['DevOps', 'Cloud', 'SRE', 'Platform', 'Infrastructure'],
    workPreference: 'Mumbai, elsewhere in India, or remote',
    availability: 'Available on standard notice',
    socials: [],
    seo: {
      _type: 'seo',
      title: 'Irfan Noor Mohammed — DevOps · Cloud · Automation',
      description:
        'DevOps portfolio of Irfan Noor Mohammed: a Bash CLI for Git, container and CI/CD labs, and a site shipped by its own pipeline.',
    },
    needsReview: true,
    reviewNote:
      'Drafted: "Where" and "Availability". Still empty until you add them: email, LinkedIn, GitHub, résumé PDF.',
  },
  {
    _id: 'pageCopy',
    _type: 'pageCopy',
    work: intro(
      'Everything I’ve built, and how far each one goes.',
      'Each project shows its honest status and which stages of the delivery path it covers. Learning labs are labelled as labs.',
    ),
    notes: intro(
      'Real problems, written up so they’re useful later.',
      'Troubleshooting posts follow the same four steps every time: symptom, what I checked, root cause, fix.',
    ),
    journey: intro(
      'How I got here, one milestone at a time.',
      'Career, education, projects and learning, newest first. Upcoming items are marked as planned.',
    ),
    experience: intro(
      'Where I work, and what I’ve built there.',
      'Roles, the work behind them and the stack I used. Education follows.',
    ),
    skills: intro(
      'Honestly tiered. Every one traceable.',
      'No percentages or progress bars. Each skill says how I’ve used it, and links to where.',
    ),
    infrastructure: intro(
      'Everything this site runs on.',
      'The real production setup for the page you’re reading — what’s live, and what’s still planned.',
    ),
    contact: intro(
      'Let’s build something that ships.',
      'The fastest way to reach me is email. I’m happy to talk about roles, a project, or anything on this site.',
    ),
    terminal: intro(
      'The whole site, from a shell.',
      'Same facts as every other page, no extras. Prefer clicking? Everything here is also in the normal navigation.',
    ),
    resume: intro('Plain text, ATS-friendly.', 'One page, with the same content as the PDF.'),
    notFound: intro(
      'This route didn’t ship.',
      'The page you asked for doesn’t exist — it may have moved, or the link has a typo.',
    ),
    needsReview: true,
    reviewNote:
      'Drafted intros for Blog, Journey, Experience and Résumé. Other pages use the design copy.',
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    featuredProject: ref('project', 'P-01'),
    sections: ['work', 'terminal', 'infrastructure', 'journey', 'notes', 'contact'].map((s) => ({
      _type: 'homeSection',
      section: s,
      visible: true,
    })),
  },
  // Empty on purpose: no status yet = "not measured yet" on the site. Written only by CI.
  { _id: 'siteStatus', _type: 'siteStatus' },
];

/** Creation order matters: references point backwards. */
export const seedOrder: SeedDoc[][] = [
  categories,
  [...projects, ...oldProjects],
  notes,
  [...roles, ...oldRoles],
  milestones,
  [...skills, ...oldSkills],
  infraNodes,
  singletons,
];
