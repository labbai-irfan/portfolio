# Portfolio visual overhaul — plan

The owner's brief (Nov 2026): a sober, architectural DevOps portfolio (Linear / Vercel / Railway /
Stripe), not neon. It supersedes the home design files (`design/HomeV2*.dc.html`, `HomeV3`) for the
home page; every other rule in `CLAUDE.md` still applies. Work ships one step at a time and waits
for the owner's approval between steps.

## Ground rules for every step

- **Honesty first.** Everything shown comes from Sanity, the build (`lib/build-info.ts`), or a fixed
  UI label. No invented metrics, uptime, durations, health states, logos of tools not in the
  stack, or claims of production use. Labs say lab, planned says planned.
- **Queries stay as they are.** No GROQ in `web/src/sanity/queries.ts` changes unless a step says so
  and the owner approves it first. Additive schema options (a new tier value) are allowed only where
  noted, because they leave the queries untouched.
- **No WebGL, no animation libraries.** CSS 3D transforms, CSS scroll-driven animations and small
  client components. Nothing new in `package.json` without asking.
- **Motion is optional.** Every effect is off with `prefers-reduced-motion`, and every interactive
  graphic is keyboard-reachable with a text equivalent.
- **Easter eggs are jokes, never claims.** Their wording must not read as a fact about the owner,
  the site or its infrastructure.

## Step 1 — Motion foundation ✅

Slate dark palette, `--color-glow`, and the utilities `reveal`, `scroll-progress`, `seam`,
`grid-backdrop`, `ambient` (see `CLAUDE.md` → Code). Glass header with a reading-progress line.

## Step 2 — Hero terminal, easter eggs, DevTools banner ✅

- **Glass terminal.** The hero `TerminalWindow` gets a glass variant (near-opaque so terminal text
  keeps its contrast on the light theme), a lit top edge and an ambient spotlight behind it.
- **Command feedback.** Each echoed command carries an exit status (✓ / ✗ in the gutter; failures
  also announced to screen readers).
- **`deploy`.** Explains that production ships from CI (push → checks → build → audit → deploy), shows
  the real commit and build time when they exist, then scrolls down the page. Until Step 3 lands it
  scrolls to the pipeline (`#pipeline`); Step 3 retargets it to the container yard (`#yard`). Off the
  home page it navigates to `/#<target>`.
- **Easter eggs** (pure functions in `components/terminal/commands.ts`, unit-tested):
  - `sudo rm -rf /` → "not in the sudoers file", "Permission denied", and a short shake of the
    window (none with reduced motion). The wording makes clear nothing is logged or reported.
  - `docker ps` → site pages and Sanity projects as a container table; rows with a page are links,
    planned projects are shown but not linked.
  - `kubectl get pods` → the same table as pods, opened by an honest line: Kubernetes is on the
    owner's exploring list, not in production.
  - `neofetch` → ASCII mark plus a summary built from `TerminalData`: name, role, location, the
    infrastructure parts (hosting, CI, content…) and skills by tier. Missing values are left out.
  - `coffee` → `HTTP/1.1 418 I'm a teapot` with an ASCII teapot (RFC 2324).
- **DevTools banner.** One `console.info` greeting, once per page load, pointing to Ctrl+`and`help`. No data beyond the owner's name.

## Step 3 — Container yard, tech logos, radar dock

- **Yard.** CSS 3D corrugated containers, one per Sanity `skill` (SKILLS_QUERY, unchanged), stacked
  in rows by skill group, in the Studio's order. Hover/focus lifts a container like a crane pick.
  Phones get a flat, tappable stack; reduced motion gets no lift.
- **Logos.** Monochrome / duotone marks drawn with `currentColor`, from Simple Icons (CC0) where the
  mark is available: Docker, Linux (Tux), MySQL, GitHub Actions, Git, Node.js, TypeScript, Jenkins,
  AWS. A logo appears only on a container whose skill exists in Sanity; a skill with no available
  mark gets a plain text stamp. The logo map is presentation (keyed by `stegaClean(name)`), not
  content.
- **Manifest drawer.** Clicking a container opens a `docker inspect`-style drawer: real tier
  (At work / In projects / Learning), `usageNote`, and linked projects (`usedIn`). Native
  `<dialog>` per `CLAUDE.md`.
- **Architecture radar / "Exploring" dock.** At the edge of the yard, a slowly turning Kubernetes
  helm-wheel mark labelled **EXPLORING / ROADMAP**, visually separate from the yard (no container,
  no tier badge). The owner confirmed Kubernetes as something they are exploring (Nov 2026). To keep
  it in Sanity rather than code: add an `exploring` option to the skill tier list
  (`studio/schemaTypes/constants.ts`, `lib/labels.ts`) and a Kubernetes skill with that tier. The
  query is unchanged; the yard puts `exploring` skills on the dock instead of in a container, and
  the Skills page and terminal list them under "Exploring". Needs `schema:deploy` + `typegen`.
- `deploy` retargets to `#yard`.

## Step 4 — CI/CD spine and the Jenkins butler

- **Spine.** A vertical pipeline drawn with scroll-driven CSS, showing the real `ship.yml` stages
  in order: format → type-check → lint → unit tests → contrast → build → accessibility audit →
  deploy to Vercel. Replaces the current home strip, which wrongly says "Security scans" and
  "Deploy: AWS".
- **Lab branch.** A side branch off the spine for **P-03 CI/CD pipeline lab**, labelled _Lab_.
  The hand-drawn SVG **Jenkins butler** stands there with the prompt _"Build #P-03 ready. Click to
  inspect lab pipeline."_ Clicking plays a compact replay of the lab's real Jenkinsfile stages
  (Checkout → Install → Test → Build), clearly marked _simulated replay_, with a link to the P-03
  write-up. The butler never appears on the main spine: this site does not build with Jenkins.
- **Attribution.** The butler is derived from the Jenkins logo by Charles Lowell and Frontside
  (CC BY-SA 3.0); credit goes in the footer and the SVG is offered under the same licence.

## Step 5 — Projects as deployments, topologies

- **Deployment manifests.** Project cards styled as service manifests: real status, stage coverage
  as a rollout bar, tools. No health dots, latency or uptime on labs or planned projects.
- **This portfolio only:** commit SHA, build time, CI run link (from `lib/build-info.ts`) and the
  uptime status ("not measured yet" until 24 samples). **Build duration** is shown only if CI bakes
  a real value in (e.g. a `BUILD_STARTED` stamp added to `ship.yml`); otherwise it is left out.
- **Topologies.** An interactive SVG node-link diagram where hovering a node highlights its request
  path. The portfolio's comes from `infraNode` (real). Other projects have no topology data, so they
  show none; adding per-project topology needs a new optional Sanity field, which needs the owner's
  approval first (it changes `PROJECTS_QUERY`).

## Step 6 — Blueprint X-ray, contact handshake, audit

- **Blueprint X-ray mode.** Triggered by clicking the butler five times or typing `xray` in the
  terminal (a pure, tested command). Outlines container geometry, the layout grid and section
  boxes like an infrastructure wireframe; toggles off the same way or with Escape. Visual only.
- **Contact as an `ssh` handshake.** The contact section styled as a connection handshake to the
  owner's real channels (email, LinkedIn, GitHub from Site settings); missing ones are not shown.
- **Audit.** 60fps (performance profile while scrolling), contrast (`npm --prefix web run
contrast`), axe (`npm --prefix web run audit`), keyboard pass, reduced motion, and layout at
  390 / 768 / 1280 / 1440 px. Final `CLAUDE.md` update.
