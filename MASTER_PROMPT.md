# Master Prompt — Labbai Irfan Portfolio

> Paste this whole file into Claude Code as your first message, from the root of an empty folder that already contains the `design/` folder from this kit. Claude Code works one phase at a time and stops at each **GATE** for your approval.

---

## 0. Your role and how to work

You are a senior full-stack and platform engineer. Build my personal DevOps portfolio from scratch:

- **Frontend:** Next.js (App Router, TypeScript strict), Tailwind CSS
- **Content backend:** Sanity (standalone Studio). Sanity is the only data store. No VPS, no other database.
- **Hosting:** Vercel free Hobby plan for the site; Sanity-hosted Studio (`sanity deploy`).
- **CI:** GitHub Actions.

Work rules:

1. Work **phase by phase**, in order. At the end of each phase, run the checks listed under its **Done when**, report what you did and what you verified, then **stop at the GATE** and wait for me.
2. Before installing anything, check the **current stable versions** and current official docs (Next.js, Tailwind, `next-sanity`, `sanity`). Don't rely on remembered versions.
3. If a step can't be done or verified, say so exactly. Never claim something works without running it.
4. Ask me only when a decision can't be made from this prompt, the design files, or sensible defaults.
5. Use the **Sanity MCP server** for anything that touches my Sanity project (schemas, documents, datasets). If it isn't connected, tell me to run:
   `claude mcp add Sanity -t http https://mcp.sanity.io --scope user`
   If you have the Sanity agent skills available, load the Next.js, schema, GROQ, TypeGen, and visual-editing guidance before the matching phase.

---

## 1. The design is the specification

The folder `design/` contains the full design: one `.dc.html` file per screen plus `canvas.json` (the index). **Match it exactly**: layout, spacing, type sizes, colours, borders, copy structure, states, and responsive behaviour.

How to read the files:

- Each file is a self-contained HTML page. Its inline styles are the visual spec. Its `<script data-dc-script>` block (where present) shows the **intended behaviour** (filters, terminal commands, topology highlighting, search). Re-implement that behaviour cleanly in React; do not copy the runtime (`support.js`, `<x-dc>`, `<sc-for>`, `<sc-if>`, `{{holes}}`).
- Text in `[square brackets]` is a **content slot**, not copy. It must come from Sanity or build data, and if empty, the element is **hidden** in production (never shown as a placeholder).
- Where two versions exist, the **newer one wins**: `HomeV2` over `Main`, `HomeV2Mobile` over `Mobile`, `NavV2` navigation everywhere, `ComponentsV2` + `System` for tokens.

### Design file → route / component map

| Design file | Builds |
|---|---|
| `System.dc.html`, `ComponentsV2.dc.html` | Design tokens, UI primitives, states |
| `NavV2.dc.html`, `MobileMenu.dc.html` | Site header, About dropdown, mobile menu |
| `HomeV2.dc.html`, `HomeV2Mobile.dc.html` | `/` (desktop + mobile) |
| `Work.dc.html` | `/work` |
| `CaseStudy.dc.html`, `CaseStudyMobile.dc.html` | `/work/[slug]` (case-study layout) |
| `SiteProject.dc.html` | `/work/[slug]` for the portfolio project (pipeline layout) |
| `ContainerLab.dc.html`, `CicdLab.dc.html` | `/work/[slug]` (lab layout) |
| `Notes.dc.html` | `/notes` |
| `NoteDetail.dc.html` | `/notes/[slug]` |
| `Journey.dc.html` | `/journey` |
| `Experience.dc.html` | `/experience` |
| `Skills.dc.html` | `/skills` |
| `Infrastructure.dc.html` | `/infrastructure` |
| `Terminal.dc.html`, `TerminalMobile.dc.html` | `/terminal` |
| `Search.dc.html` | Ctrl/Cmd K command palette (global) |
| `Contact.dc.html` | `/contact` |
| `Resume.dc.html` | `/resume` |
| `NotFound.dc.html` | `not-found.tsx` |
| `Dark.dc.html` | Dark theme tokens |
| `ShareCard.dc.html` | `opengraph-image.tsx` (1200×630) |
| `Icons.dc.html` | Favicon + app icons |

---

## 2. Non-negotiable rules

**Content honesty**
- Never invent employers, dates, metrics, uptime numbers, certifications, links, testimonials, or results.
- Learning labs are labelled as labs. Planned items are labelled as planned.
- A link, metric, or evidence row with no real value is not rendered.
- The status panel shows "not measured yet" until a real uptime result exists.

**Positioning (copy tone)**
- The site is DevOps-first. Hero label: "DevOps · Cloud · Automation". Hero line: "I automate how software ships and runs."
- Software-development experience exists as facts on Experience and Résumé only. Do not add sections, copy, or callouts about a career change, a background in development, or AI.

**Code quality**
- TypeScript strict, no `any`. Server Components by default; `'use client'` only for terminal, search, topology, filters, menus, theme toggle.
- All GROQ lives in `web/src/sanity/queries.ts`, written with `defineQuery`. Types come from Sanity TypeGen and are never hand-edited.
- Colours, fonts, spacing, and focus styles come only from tokens in `globals.css`. No hex values inside components.
- Content data and presentation stay separate. No copy hard-coded in components except fixed UI labels.
- kebab-case file names; one component per file; named exports.
- Clean visual-editing strings with `stegaClean()` before any comparison; use `stega: false` in `generateMetadata` and `generateStaticParams`.

**Accessibility**
- Semantic landmarks, skip link, visible 2px focus ring, 44px minimum touch targets, WCAG AA contrast (body text AAA), keyboard support for every control, `prefers-reduced-motion` respected, every diagram has a text equivalent, the terminal output is an `aria-live` log.

**Security**
- Read token only in server environment variables. No write token anywhere in the website. Webhook and draft-mode secrets are validated.

---

## 2A. Sanity Studio is the admin panel — no code changes to update content

I will **never** edit code to update the portfolio. After launch, everything I add or change happens in Sanity Studio, and publishing it updates the live site **within seconds, without a redeploy**.

**Editable in Studio (must be):**
- **Projects:** add, edit, reorder (drag and drop), feature on Home, set status, stage coverage, evidence links, cover image, case-study content, layout choice, hide/unpublish.
- **Blog / notes:** add posts with a category (Troubleshooting, Write-up, Learning log, Tutorial — editable list), tags, cover image, rich text with code blocks, figures, callouts, and the optional four-step debug format; link to a project.
- **Certifications:** name, issuer, date, credential ID, verify URL, badge image. The section appears automatically once one exists.
- **Journey:** milestones with date, category, link, planned/latest flags.
- **Experience:** roles with dates, bullets, stack.
- **Skills:** name, group, tier, where-used links; reorderable.
- **Infrastructure:** topology parts, their state, and connections.
- **Site settings:** name, hero label/line/paragraph, summary cells, "Open to roles" toggle, roles wanted, availability, location, email, LinkedIn, GitHub, other socials, résumé PDF upload, default SEO and share text.
- **Page copy:** the heading and intro text of every page (Work, Notes, Journey, Experience, Skills, Infrastructure, Contact, Terminal, Résumé, 404), in one "Page copy" section.
- **Home:** which sections show and in what order, featured project.
- **SEO per document:** title, description, share image (falls back to defaults).

**Stays in code (fixed):** routes, layout, design tokens, components, UI labels such as "Read the case study", the pipeline itself and the build stamp.

**Technical requirements that make this true:**
- Fetch with `defineLive` and render `<SanityLive />`, so published changes appear live. Keep `dynamicParams` on, so a **new** project or post slug renders on first request without a deploy.
- Search index, terminal output, sitemap, and RSS read from Sanity at request time (cached, refreshed by live content), **not** baked in at build time.
- Every list is ordered by an orderable field (use `@sanity/orderable-document-list` or an `orderRank` field), never by code.
- Studio usability: a clear `structure.ts` (Site settings · Page copy · Home · Projects · Blog · Journey · Certifications · Experience · Skills · Infrastructure), document previews that show status and date, helpful field descriptions, sensible initial values, required `alt` text on images with hotspot enabled, and the **Presentation tool** so I can click any text on the site and edit it.
- Write `STUDIO_GUIDE.md`: a plain-language guide for adding a project, a blog post, a certificate, a milestone, and changing the résumé PDF.

---

## 3. Verified content (the only facts you may use)

Load this into Sanity in Phase 4. Anything marked **[confirm]** must be asked before publishing.

- **Name:** Irfan Noor Mohammed (résumé name: Labbai Irfan Noor Mohammed). Mumbai, India.
- **Roles targeted:** DevOps, Cloud, SRE, Platform, Infrastructure.
- **Experience**
  - Junior Software Engineer, WiseTech MEP Consultants Pvt. Ltd., Mumbai — Apr 2026 to present. Develops modules of the company's internal HRMS/CRM platform (React, TypeScript, Vite, Redux Toolkit, MUI, Node.js, Express, Prisma, MySQL). Built lead ↔ project synchronisation, bulk spreadsheet lead import, and template-based document generation. Migrated the database from MariaDB to MySQL, resolving schema incompatibilities.
  - Full-Stack Developer Intern, Arba Accelerator Company — Jul 2025 to Jan 2026. Responsibilities **[confirm]**.
- **Education:** M.Sc. IT, Pillai College of Arts, Commerce & Science, Navi Mumbai (2026, in progress). B.Sc. IT, Anjuman-I-Islam's Kalsekar Technical Campus (2023–2026).
- **Projects** (statuses **[confirm]**)
  - P-00 This portfolio — ships with site. GitHub Actions → Vercel. Coverage: commit, build, test, ship, run implemented; observe planned.
  - P-01 C2 — Continuous Control — in development. Bash CLI that turns repetitive Git workflows into single, predictable commands. Coverage: commit.
  - P-02 Containerised app + MySQL — learning lab. Docker, volumes, user-defined network, a real container-to-DB connectivity bug. Coverage: build, run (lab).
  - P-03 CI/CD pipeline lab — learning lab. Same pipeline in Jenkins and GitHub Actions. Coverage: build, test (lab).
  - P-04 Run it on AWS — planned. Coverage: ship, run, observe (planned).
- **Note N-01:** "When my app container couldn't reach MySQL" — draft; real steps **[confirm]**.
- **Skills:** DevOps — Docker, Linux, Bash, Git (in projects / at work). CI/CD — GitHub Actions, Jenkins (learning). Cloud — AWS, monitoring, logging (learning). Also — React, TypeScript, Node.js, Express, MySQL, Prisma, Vite, Tailwind (at work).
- **Certifications:** none yet. Section shows its empty state.
- **Still missing — ask me:** email, LinkedIn URL, GitHub URL, domain, résumé PDF, C2 repo + real terminal output, lab configs and screenshots, milestone months.

---

## 4. Target structure

```
portfolio/
├── design/                     # this kit — read-only reference
├── studio/                     # Sanity Studio (standalone)
│   ├── schemaTypes/{documents,singletons,objects,blocks}/ + index.ts
│   ├── structure.ts
│   ├── sanity.config.ts
│   └── sanity.cli.ts           # TypeGen → ../web/src/sanity/types.ts
├── web/                        # Next.js
│   ├── src/app/                # routes from the map above + api/draft-mode, sitemap, robots, feed.xml, opengraph-image
│   ├── src/components/{ui,layout,sections,terminal,topology,search,portable-text}/
│   ├── src/sanity/{client,live,queries,image,types}.ts
│   ├── src/lib/{build-info,utils}.ts
│   └── src/styles/globals.css
├── .github/workflows/{ship.yml,uptime.yml}
├── CLAUDE.md                   # you create and maintain this: conventions + commands
└── README.md
```

---

## 5. Phases

### Phase 1 — Repository and tooling
- `git init`; create `studio/` with `npm create sanity@latest -- --template clean --typescript --output-path studio` (run from the repo root, not inside `web/`); create `web/` with `create-next-app` (TypeScript, App Router, Tailwind, ESLint, `src/`).
- Strict TS, Prettier, ESLint, root scripts to run both dev servers, `.env.example` files, `.gitignore`.
- Write `CLAUDE.md` with the rules from section 2 and the commands.
- **Done when:** both apps start (`:3000`, `:3333`), lint and type-check pass.
- **GATE 1**

### Phase 2 — Design tokens and UI primitives
- Extract tokens from `System.dc.html` + `ComponentsV2.dc.html` + `Dark.dc.html` into Tailwind `@theme` in `globals.css`: ink, body, muted, signal, rule, ground, surface (light and dark), status chip colours, focus ring, grid background, 1px rules, square corners.
- Fonts: Geist and Geist Mono via `next/font`.
- Build primitives in `components/ui/`: Button (primary/secondary/dark), StatusChip (live, in development, ships with site, learning lab, planned), SectionBar, SpecStrip, EvidenceLedger, CoverageMark, CodeBlock with Copy, Figure (with required caption), FilterButton (pressed state), EmptyState.
- Add a dev-only `/_kit` page that renders every primitive in every state, matching `ComponentsV2.dc.html`.
- **Done when:** `/_kit` visually matches the components artboard in light and dark; contrast checked.
- **GATE 2**

### Phase 3 — Sanity content model (via Sanity MCP where possible)
- Documents: `project` (title, slug, code like P-01, status, summary, tools, stageCoverage, evidence[], cover image, layout: caseStudy | pipeline | lab, body Portable Text, sections, featured, orderRank, seo), `note` = blog post (title, slug, date, category ref, tags, project ref, summary, cover image, debugSteps optional, body, seo), `noteCategory` (title, slug), `role`, `milestone` (date label, sort date, category, title, planned, latest, link), `skill` (name, group, tier, usedIn refs, orderRank), `credential` (name, issuer, issued, credentialId, verifyUrl — required, badge image), `infraNode` (kicker, name, sub, category, state, role, connections[] with label + type, orderRank).
- Singletons: `siteSettings` (name, headline label, hero line, hero paragraph, summary cells, open-to-roles toggle, roles wanted, availability, location, contact and social links, résumé file, default SEO), `pageCopy` (heading + intro for every page listed in section 2A), `homePage` (featured project, section order and toggles), `siteStatus` (written only by the uptime workflow: status, checkedAt, uptime).
- Everything listed in section 2A must be editable from these types.
- Objects: evidenceLink, stageCoverage (six stages × none/implemented/lab/planned), codeBlock, figure (textEquivalent required), debugSteps, seo.
- Validation: required fields, slugs unique, figures need text equivalents, no numeric "metrics" fields.
- `structure.ts`: singletons pinned; projects grouped by status.
- Configure TypeGen in `sanity.cli.ts`.
- **Done when:** schema deploys; Studio shows all types; TypeGen generates `types.ts`.
- **GATE 3**

### Phase 4 — Load real content (via Sanity MCP)
- Create documents from section 3 only. Leave unknown fields empty. List every **[confirm]** item and ask me for each.
- Let Sanity generate `_id`s for ordinary documents; use fixed IDs only for singletons.
- **Done when:** every page's data exists in the dataset; no invented values (show me a summary table to check).
- **GATE 4**

### Phase 5 — Data layer
- `client.ts`, `live.ts` (`defineLive` → `sanityFetch`, `SanityLive`), `image.ts`, all queries in `queries.ts` with `defineQuery`, typed via TypeGen.
- `build-info.ts`: commit SHA, build time, and a link to the workflow run, from CI/Vercel environment variables. Missing values → not rendered.
- **Done when:** a test page renders typed data for every document type; no `any`.
- **GATE 5**

### Phase 6 — Layout shell
- Root layout: skip link, header from `NavV2` (About dropdown, Open to roles badge, Search button, theme toggle, Résumé), mobile header + `MobileMenu`, footer site-map + build stamp (from `HomeV2`), `<SanityLive />`, theme handling without flash.
- **Done when:** keyboard-only navigation works through header, dropdown, and mobile menu at 390px, 768px, 1280px, 1440px.
- **GATE 6**

### Phase 7 — Core pages
- Home, Work (working status filters with counts and an empty state), Notes, Journey (category filters, year groups, latest marker, upcoming, credentials empty state), Experience, Skills, Contact, Résumé (print-friendly CSS; PDF download only if a file exists).
- **Done when:** each page matches its artboard at desktop and mobile; filters work by keyboard; empty content hides cleanly.
- **GATE 7**

### Phase 8 — Detail pages
- `/work/[slug]` with three layouts chosen by `project.layout` (case study, pipeline, lab), coverage strip, recruiter summary, sticky-free sidebar, prev/next.
- `/notes/[slug]` with the four-step format.
- Portable Text renderers: code block with Copy, figure with text equivalent, debug steps, callouts.
- `generateStaticParams` (published only, `stega: false`), `notFound()` for missing slugs.
- **Done when:** every project and note renders; mobile layouts match the mobile artboards.
- **GATE 8**

### Phase 9 — Interactive features
- **Terminal:** `components/terminal/commands.ts` is a pure, unit-tested module whose output comes from the same Sanity data as the pages. Commands from `Terminal.dc.html` (help, whoami, ls, pwd, projects, open, skills, experience, journey, pipeline, infra, contact, resume, history, clear, date, echo, sudo easter egg), Tab completion, ↑/↓ history, quick-command buttons, mobile layout from `TerminalMobile.dc.html`.
- **Topology:** from `infraNode` documents; hover and focus highlight connections and dim others; detail panel; reduced-motion safe; text equivalent.
- **Search:** global Ctrl/Cmd K palette; index of pages, projects, notes, actions built at build time; arrow-key selection, Enter to open, Esc to close, focus trap, empty state.
- **Done when:** unit tests for commands pass; all three work by keyboard and screen reader basics.
- **GATE 9**

### Phase 10 — SEO and assets
- `generateMetadata` per route, canonical URLs once the domain is known, `opengraph-image.tsx` matching `ShareCard.dc.html`, icons from `Icons.dc.html` (SVG favicon with dark-mode variant, 32 ico, 180 Apple, 512 and maskable 512), `sitemap.ts`, `robots.ts`, `/feed.xml` for notes, JSON-LD Person.
- **Done when:** metadata contains no visual-editing characters; OG image renders.
- **GATE 10**

### Phase 11 — CI/CD (this is the pipeline the hero shows — make it real)
- `ship.yml`: on push and PR → install → `tsc --noEmit` → ESLint → build → accessibility audit (axe against built pages; fail on serious/critical) → on `main` only, deploy to Vercel with the Vercel CLI (`VERCEL_TOKEN`, org and project IDs in GitHub Secrets) and pass the commit SHA and run URL into the build.
- Disable Vercel's automatic Git deploys for production so **only a passing pipeline deploys** (PR previews may stay on).
- `uptime.yml`: scheduled hourly; requests the live site; writes the result to the `siteStatus` document using a write token stored **only** in GitHub Secrets. No commits, no redeploys.
- **Done when:** a PR with a type error fails the pipeline; a clean merge deploys.
- **GATE 11**

### Phase 12 — Deploy
- Vercel project for `web/` (root directory `web`), environment variables, Sanity CORS for production and preview URLs, `sanity deploy` for the Studio, Presentation tool + draft mode + Visual Editing pointed at the site, optional revalidation webhook if needed.
- Check the current Vercel Hobby and Sanity free-plan limits and confirm we are within them.
- **Done when:** production URL live; editing in Studio updates the site; Presentation tool works.
- **Admin test (must pass):** in Studio only, create a test project, blog post, certificate, and milestone, and change the hero line. Publish. Within seconds, with no code change and no deploy, each appears on its page, in search, in the terminal, in the sitemap, and (for the post) in RSS. Then delete the test documents and confirm they disappear.
- **GATE 12**

### Phase 13 — Quality pass
- Lighthouse and axe on every route (desktop + mobile); fix issues. Check 320px, 390px, 768px, 1024px, 1440px for overflow. Keyboard-only walkthrough. Reduced motion. Dark theme. Content honesty audit: list every rendered claim and its source document.
- Review the site as a recruiter (60 seconds) and as a DevOps hiring manager (10 minutes); fix what fails.
- Final report: what was built, what was verified and how, what is still pending from me.
- **GATE 13 — done.**
