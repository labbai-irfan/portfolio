# ROADMAP — the whole portfolio, explained

_Status as of 29 October 2026. Phases 1–11 are built; Phases 12–13 (go-live and the final quality pass) are not._

This file explains **what this portfolio is, why it is built the way it is, what exists today, what is still missing, and where it can grow**. It is written so that you can understand and explain every part of your own site, including in an interview. For the click-by-click go-live steps, use [SETUP.md](SETUP.md).

**Contents**

1. [The one-minute version](#1-the-one-minute-version)
2. [Purpose, audience and the honesty rule](#2-purpose-audience-and-the-honesty-rule)
3. [The site, page by page](#3-the-site-page-by-page)
4. [How it works, in plain English](#4-how-it-works-in-plain-english)
5. [The content model (what lives in Sanity)](#5-the-content-model-what-lives-in-sanity)
6. [The design system](#6-the-design-system)
7. [The three interactive features](#7-the-three-interactive-features)
8. [Quality built in](#8-quality-built-in)
9. [The pipeline: how a change reaches the internet](#9-the-pipeline-how-a-change-reaches-the-internet)
10. [Build history: the 13 phases](#10-build-history-the-13-phases)
11. [Honest status: done, not done, known gaps](#11-honest-status-done-not-done-known-gaps)
12. [What happens next, in order](#12-what-happens-next-in-order)
13. [Growing the portfolio (ideas, not promises)](#13-growing-the-portfolio-ideas-not-promises)
14. [How to talk about it](#14-how-to-talk-about-it)
15. [Maintenance rhythm](#15-maintenance-rhythm)
16. [Where things live](#16-where-things-live)

---

## 1. The one-minute version

**What it is.** A personal portfolio for **Irfan Noor Mohammed** (Mumbai, India), aimed at **DevOps, Cloud, SRE, Platform and Infrastructure** roles.

**What makes it different.** It is not only a site _about_ DevOps; it is a small piece of DevOps itself:

- It is **shipped by a real pipeline** (GitHub Actions → Vercel) that checks types, lint, tests, colour contrast, build and accessibility before anything goes live.
- Its content lives in a **headless CMS** (Sanity), so editing a project or a post never needs a code change or a deploy.
- It **measures itself**: an hourly check records whether the site is up, and the site shows that real result (or says "not measured yet").
- It shows **work honestly**: planned things are labelled planned, labs are labelled labs, and anything without a real value is hidden instead of faked.
- It has a **working terminal**, a **live infrastructure diagram** and a **keyboard search**, all driven by the same content as the pages.

**The stack in one line.** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 on Vercel; Sanity for content; GitHub Actions for CI/CD.

**Where it stands.** The site is complete and tested locally. It is **not yet live**: it needs a GitHub repository, a Vercel project and a few secrets (see SETUP.md), then a final quality pass.

---

## 2. Purpose, audience and the honesty rule

### 2.1 Positioning

- **DevOps-first.** The hero label is "DevOps · Cloud · Automation" and the hero line is "I automate how software ships and runs."
- Software-development experience (the job at WiseTech MEP, the internship) appears **only as facts** on Experience and Résumé. There is deliberately no copy about a career change, and no AI-themed copy.

### 2.2 Who reads it, and how

| Reader                          | Time        | What they should walk away with                                          | Where the site serves them                                                |
| ------------------------------- | ----------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Recruiter                       | ~60 seconds | Who you are, which roles you want, proof you ship, how to contact you    | Home hero, summary strip, project "In short" band, Résumé                 |
| DevOps hiring manager           | ~10 minutes | _How_ you work: pipeline, debugging method, honest scope, real artefacts | Work, case studies, Notes (debugging write-ups), Infrastructure, Terminal |
| Accessibility/QA minded visitor | any         | The site itself is built to a standard                                   | Keyboard paths, contrast, axe audit, text equivalents                     |

### 2.3 The honesty rule (the most important design decision)

Because a portfolio can easily oversell, the project has hard rules, written into `CLAUDE.md`:

- **Never invent** employers, dates, metrics, uptime numbers, certifications, links, testimonials or results.
- **Planned** work is labelled planned; **learning labs** are labelled learning labs.
- A link, metric or evidence row with **no real value is not rendered**.
- The status panel says **"not measured yet"** until a real uptime result exists. The only number the site ever shows is the measured uptime.
- Text only the owner can verify is stored with a **`needsReview`** flag. The site never reads that flag, but the Studio lists every flagged item so nothing stays a draft by accident.

This is why an empty email field today means the contact page shows no email rather than a placeholder.

---

## 3. The site, page by page

| Route                 | What it shows                                                                                                                                                               | Fed by (Sanity)                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `/` Home              | Hero with the live pipeline strip, summary strip, then sections you can show/hide/reorder: Work, Terminal teaser, Infrastructure, Journey, Notes, Contact                   | Site settings, Home page, Projects, Infra parts, Milestones, Notes, Site status |
| `/work`               | All projects as cards with status chip, tools and a six-stage coverage bar; status filters with counts and an empty state                                                   | Projects, Page copy                                                             |
| `/work/[slug]`        | A project's detail page in one of three layouts (case study, pipeline, lab): coverage strip, "In short" recruiter summary, numbered sections, evidence links, previous/next | Project                                                                         |
| `/notes`              | The blog list (category filter)                                                                                                                                             | Notes, Categories                                                               |
| `/notes/[slug]`       | A post; debugging posts use the **four-step format**: Symptom → What I checked → Root cause and fix → Prevention                                                            | Note                                                                            |
| `/journey`            | Timeline of milestones grouped by year, category filters, a "latest" marker, upcoming items, certifications (empty state until you add some)                                | Milestones, Certifications                                                      |
| `/experience`         | Job and education entries with highlights, stack and context                                                                                                                | Experience (roles)                                                              |
| `/skills`             | Skills in tiers: **At work**, **In projects**, **Learning**, each traceable to where it was used                                                                            | Skills                                                                          |
| `/infrastructure`     | Interactive diagram of everything the site runs on, a status panel, and a layer-by-layer table                                                                              | Infrastructure parts, Site status                                               |
| `/terminal`           | A working shell for the whole site                                                                                                                                          | Everything above                                                                |
| `/contact`            | Contact details and links (only those you filled in)                                                                                                                        | Site settings                                                                   |
| `/resume`             | A print-ready one-page résumé; PDF download appears only when a file is uploaded                                                                                            | Site settings, Roles                                                            |
| `Ctrl/⌘ + K` anywhere | Search palette: pages, projects, notes and actions                                                                                                                          | Projects, Notes                                                                 |

**Machine-facing routes:** `/sitemap.xml`, `/robots.txt`, `/feed.xml` (RSS of the notes), `/manifest.webmanifest`, `/opengraph-image` (the 1200×630 share card), icons, and `/api/draft-mode/*` (for visual editing).

**Dev-only pages** (do not exist in production): `/_kit` (every UI component in every state) and `/_data` (checks every query against its generated type).

---

## 4. How it works, in plain English

### 4.1 Two apps, one repository

- **`web/`** is the website. It reads content from Sanity and turns it into pages.
- **`studio/`** is the admin panel (Sanity Studio). It defines _what kinds of content exist_ and gives you forms to edit them.

### 4.2 Why a headless CMS?

If content lived in the code, every typo fix would need a deploy. With Sanity, **content and code are separated**: you edit content in forms; developers edit code in git. A rule in the brief enforces this: _anything you might change later must be a Sanity field, never text inside a component._ The only text left in code is fixed interface wording (for example "Copy", "Skip to content").

### 4.3 Live content, no redeploy

The site uses Sanity's **live content** feature. A published edit is pushed to the site within seconds. No rebuild, no webhook. Drafts can be previewed through **draft mode**, protected by a read-only token that stays on the server. A publish webhook (`/api/revalidate`, signed with a secret) also refreshes every cache on publish, so the sitemap, feed and search never wait for a visitor.

### 4.4 Rendering and caching (why it is fast)

- Next.js **Server Components** render most of the site on the server, so visitors receive finished HTML and very little JavaScript. Only the pieces that must be interactive (terminal, search, topology, filters, mobile menu, theme toggle) run in the browser.
- **Cache Components** (`'use cache'`) let pages be built ahead of time and still stay fresh. Every page follows a fixed three-layer pattern: _read the visitor's mode → pass it down → fetch inside a cached function._ This is documented in `CLAUDE.md` so future edits keep the pattern.
- Project and note pages are pre-generated from their slugs; a new slug published later is rendered on first request.

### 4.5 Type safety end to end

Sanity's **TypeGen** reads the schema and every query and writes `web/src/sanity/types.ts`. TypeScript is in strict mode with no `any`. If a field is renamed in the schema, the type check fails until every use is fixed. All queries live in one file, `web/src/sanity/queries.ts`.

### 4.6 The stack and why each piece

| Piece                       | Why it is here                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Next.js 16 (App Router)     | Server rendering, caching, file-based routes, metadata, sitemaps, OG images        |
| React 19                    | UI components                                                                      |
| TypeScript (strict)         | Catches mistakes before they ship                                                  |
| Tailwind CSS 4              | Styling driven entirely by **design tokens** (no hard-coded colours in components) |
| Sanity + next-sanity        | Content, live updates, visual editing, typed queries                               |
| `@portabletext/react`       | Renders rich text from Sanity (code blocks with Copy, figures, callouts)           |
| Geist / Geist Mono          | The type system from the design                                                    |
| Node's built-in test runner | Unit tests with zero extra dependency                                              |
| axe-core + Playwright       | Accessibility audit in real Chrome                                                 |
| GitHub Actions              | Checks and deploys                                                                 |
| Vercel                      | Hosting, previews, HTTPS, CDN                                                      |

---

## 5. The content model (what lives in Sanity)

**Singletons** (exactly one each):

| Document      | Holds                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site settings | Name, résumé name, location, hero label/line/paragraph, summary cells, open-to-roles toggle, roles wanted, availability, email, LinkedIn, GitHub, extra links, résumé PDF, default SEO |
| Page copy     | The heading and intro of every page, plus the 404 copy                                                                                                                                 |
| Home page     | Featured project and which home sections are visible, and in what order                                                                                                                |
| Site status   | `up`/`down`, last-checked time and measured uptime. **Read-only, written only by the hourly workflow**                                                                                 |

**Collections:**

| Document            | Notes                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project             | Code (P-00…), title, slug, **status** (live / in development / ships with site / learning lab / planned), summary, tools, **six-stage coverage**, layout, recruiter summary, role, start, evidence links, rich body, numbered sections, SEO. Drag-to-reorder. |
| Note (blog post)    | Code, title, slug, date, category, summary, tags, linked project, rich body, optional **debug steps** (symptom, error log, checks with found-it/ruled-out, root cause, before/after fix, verification, prevention), SEO                                       |
| Note category       | Troubleshooting etc.                                                                                                                                                                                                                                          |
| Milestone           | Title, category, date label, sort date, planned flag, latest flag, link. Drag-to-reorder.                                                                                                                                                                     |
| Experience (role)   | Employment, internship or education entries                                                                                                                                                                                                                   |
| Skill               | Name, group, **tier**, usage note, "used in" references to projects/notes/roles. Drag-to-reorder.                                                                                                                                                             |
| Certification       | Name, issuer, dates, credential ID, verify URL                                                                                                                                                                                                                |
| Infrastructure part | Kicker, name, sub-label, category, live/planned, role text, **connections to other parts**. Drag-to-reorder.                                                                                                                                                  |

**The six delivery stages** used in project coverage: **Commit → Build → Test → Ship → Run → Observe**. Each stage is marked _implemented_, _lab_, _planned_ or _none_. This is the honest way to show how far each project goes through the delivery path.

**Rich content blocks:** code block (with filename), figure (a **text equivalent is required**), callout (note or warning). Every image needs alt text.

---

## 6. The design system

- **Source of truth:** the HTML files in `design/` (never deployed). Where files disagree, the newer wins: HomeV2 over Main, HomeV2Mobile over Mobile, NavV2 everywhere, ComponentsV2 and System for tokens.
- **Look:** square corners, 1-pixel rules, a graph-paper grid background, one blue accent ("signal"), monospace for data, a dark band for code and terminal.
- **Tokens:** every colour, font and spacing value lives in `web/src/styles/globals.css`. Components may not contain hex colours. Light and dark themes are the same token names with different values.
- **Themes:** follows the visitor's system setting with no JavaScript; a stored choice from the toggle is applied before first paint so there is no flash.
- **Components:** reusable primitives in `web/src/components/ui/` (Button, StatusChip, CoverageMark, EvidenceLedger, CodeBlock, Figure, SpecStrip, SectionBar, PageHero, EmptyState…), previewed on `/_kit`.
- **Responsive:** tested at 390 px and 768 px (mobile) and 1280 px and 1440 px (desktop). Navigation switches at 1024 px.

---

## 7. The three interactive features

### 7.1 Terminal (`/terminal`)

- Commands: `help`, `whoami`, `ls`, `pwd`, `projects`, `open <id>`, `skills`, `experience`, `journey`, `pipeline`, `infra`, `contact`, `resume`, `history`, `clear`, `date`, `echo`, and a `sudo` easter egg.
- **Tab** completes command names and project ids; **↑/↓** walks history; quick-command buttons help on touch devices; the output is an `aria-live` log for screen readers.
- Its brain is a **pure, unit-tested module** (`components/terminal/commands.ts`). It prints facts from the same Sanity data as the pages, so adding a project in the Studio makes it appear in `projects` automatically.

### 7.2 Infrastructure topology (`/infrastructure`)

- Built from the **Infrastructure part** documents. The main flow is found automatically by following each part's first real connection (Me → GitHub repo → GitHub Actions → Vercel → Visitor); everything else (Sanity, planned parts) sits in a "Supporting" row. Planned parts have dashed borders.
- Hover or keyboard focus **lights a part's connections and dims the rest**, and a detail panel explains it. It respects reduced motion.
- The diagram has a **generated text equivalent** that lists every connection and which parts are still planned.

### 7.3 Search (`Ctrl/⌘ + K`)

- Indexes pages, projects, notes and actions (open terminal, view résumé, switch theme).
- Arrow keys move, Enter opens, Esc closes; it is a native dialog, so focus is trapped correctly and returns to where you were.
- Shows an empty state with a link to the terminal.

---

## 8. Quality built in

| Area             | What exists                                                                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility    | Skip link, landmarks, visible 2 px focus ring, 44 px minimum touch targets, keyboard support everywhere, reduced-motion support, text equivalents for diagrams, AA contrast (body text AAA) checked by script, **axe audit in CI** (0 blocking on 15 pages × desktop/mobile/dark) |
| Tests            | 17 unit tests (terminal commands, topology layout, search index, uptime maths and probe)                                                                                                                                                                                          |
| Static checks    | Prettier, ESLint, strict TypeScript, colour-contrast script                                                                                                                                                                                                                       |
| SEO              | Per-page title/description from Sanity, canonical URLs once a domain exists, Open Graph/Twitter cards, a generated share card, sitemap, robots, RSS, JSON-LD (schema.org Person), icons incl. a dark-mode favicon and a maskable app icon                                         |
| No stray markers | Metadata is fetched without visual-editing characters, verified on three pages                                                                                                                                                                                                    |
| Security         | Read-only token only on the server; **no write token anywhere in the website**; the uptime write token exists only in GitHub Secrets; secrets never behind `NEXT_PUBLIC_`                                                                                                         |
| Print            | The résumé prints as black on white; site chrome is hidden when printing                                                                                                                                                                                                          |

---

## 9. The pipeline: how a change reaches the internet

```
 push / pull request
      │
      ▼
 ┌─ check ────────────────────────────────────────────────────────────┐
 │ format → type-check → lint → unit tests → colour contrast           │
 └─────────────────────────────────────────────────────────────────────┘
      │ pass
      ▼
 ┌─ build ────────┐      ┌─ audit ─────────────────────────────────────┐
 │ next build     │ ───▶ │ axe on every page, desktop + mobile + dark  │
 └────────────────┘      │ fails on serious or critical issues          │
                         └──────────────────────────────────────────────┘
      │ pass, and only for a push to main
      ▼
 ┌─ deploy ─────────────────────────────────────────────────────────────┐
 │ Vercel CLI: pull environment → build → deploy (commit + run link baked in) │
 └───────────────────────────────────────────────────────────────────────┘
```

- **Only a passing pipeline deploys.** Vercel's own automatic deploys for `main` are switched off by `web/vercel.json`; pull-request previews remain.
- **Uptime workflow** (hourly): requests the live site, writes `up`/`down` to the Site status document, and fails if the site is down. **Uptime %** = successful runs ÷ all runs over 7 days, shown only after 24 results exist.
- The hero panel, footer and Infrastructure status show the real commit hash, build time and run link, taken from the pipeline.

---

## 10. Build history: the 13 phases

The project was built phase by phase; after each phase the work stopped at a **gate** for review.

| #   | Phase                    | What it delivered                                                                                                            | Status                                                                        |
| --- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Repository and tooling   | Git repo, `web/` + `studio/`, strict TypeScript, Prettier, ESLint, root scripts, `CLAUDE.md`                                 | ✅ Done                                                                       |
| 2   | Tokens and UI primitives | Tailwind tokens (light/dark), fonts, 13 UI components, `/_kit` gallery, contrast script                                      | ✅ Done                                                                       |
| 3   | Content model            | All Sanity schemas, drag-to-reorder lists, Studio structure, TypeGen                                                         | ✅ Done                                                                       |
| 4   | Real content             | Verified content seeded (5 projects, 1 note, 13 milestones, 13 skills, 4 roles, 8 infra parts); drafts flagged `needsReview` | ✅ Done (drafts need your review)                                             |
| 5   | Data layer               | Typed Sanity client, live content, queries, image helper, build info                                                         | ✅ Done                                                                       |
| 6   | Layout shell             | Skip link, header, mobile menu, footer with build stamp, theme toggle without flash                                          | ✅ Done                                                                       |
| 7   | Core pages               | Home, Work, Notes, Journey, Experience, Skills, Contact, Résumé with filters and empty states                                | ✅ Done                                                                       |
| 8   | Detail pages             | Project pages (3 layouts), note pages (four-step format), rich-text renderers, static params, not-found handling             | ✅ Done                                                                       |
| 9   | Interactive features     | Terminal, infrastructure topology, global search                                                                             | ✅ Done                                                                       |
| 10  | SEO and assets           | Metadata, share card, icons, sitemap, robots, RSS, JSON-LD, manifest                                                         | ✅ Done                                                                       |
| 11  | CI/CD                    | `ship.yml`, `uptime.yml`, axe audit, Vercel deploy job, auto-deploy off                                                      | 🟡 Written and tested locally; **not yet run on GitHub**                      |
| 12  | Deploy                   | Vercel project, env vars, CORS, Studio deploy, Presentation tool, admin test                                                 | 🟡 Code ready (webhook, Presentation tool, Studio guide); needs your accounts |
| 13  | Quality pass             | Lighthouse + axe on every route, overflow checks, keyboard walkthrough, honesty audit, final report                          | ⬜ Not started                                                                |

---

## 11. Honest status: done, not done, known gaps

### 11.1 Needs _you_ (the AI cannot supply these)

- [ ] Create the GitHub repository and push (SETUP §5) — nothing has been committed yet.
- [ ] Create the Vercel project, tokens and secrets (SETUP §6–7).
- [ ] Provide **email, LinkedIn URL, GitHub URL, résumé PDF** and the **domain** (SETUP §10–11).
- [ ] Replace every `needsReview` draft with your real details (SETUP §11.2). The site currently shows drafted wording for the container lab, CI/CD lab, C2 project, one role, milestones' months and the sample note.
- [ ] Decide whether the **CI/CD pipeline lab** is built or still planned (it is currently shown as a learning lab).
- [ ] Add real artefacts: C2 repository link, lab configuration files, screenshots of passing and failing pipeline runs.

### 11.2 Not built yet (planned work in the brief)

- Phase 12 items still to do on your accounts: CORS for production, Studio deployment, creating the publish webhook (code is ready), the "admin test" (create test content in the Studio only and watch it appear everywhere, then delete it).
- Phase 13 items: Lighthouse run per route, overflow checks at 320/390/768/1024/1440 px, full keyboard-only walkthrough, reduced-motion and dark-theme pass, a **content-honesty audit** (every rendered claim traced to its source), and the 60-second recruiter / 10-minute hiring-manager reviews.

### 11.3 Known gaps and small debts (found while building)

| Gap                                                                                                                                                           | Impact                            | Planned fix                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------- |
| Unknown project/note slugs show the 404 page with `noindex`, but the HTTP status can be **200** or 404 depending on cache state (Next.js streaming behaviour) | Minor SEO nuance                  | Revisit with Next.js updates |
| Pipeline unproven on GitHub                                                                                                                                   | "Clean merge deploys" is untested | First push (SETUP §5–7)      |
| Contact info is empty, so `contact`, JSON-LD and the Contact page show no details                                                                             | Visitors cannot reach you yet     | Fill the fields              |
| Security headers (CSP, HSTS), error tracking, custom domain are **planned**, not done                                                                         | Honestly labelled on the site     | See §13                      |

---

## 12. What happens next, in order

**Step 1 — Go live (you + AI, ~1–2 hours).** Follow SETUP.md sections 5 → 9. Result: a public URL, a green pipeline, a deploy created by GitHub, not by hand.

**Step 2 — Phase 12 finish (AI, with your accounts).**

1. Add production and preview URLs to Sanity CORS.
2. Deploy the Studio to `*.sanity.studio`.
3. Point the **Presentation tool** (already in the Studio) at the live site, so you can click on the live page to edit.
4. Confirm free-plan limits for Vercel and Sanity.
5. Run the **admin test**: in the Studio only, create a test project, post, certification and milestone and change the hero line. Each must appear on its page, in search, in the terminal, in the sitemap and (for the post) in RSS, with no code change and no deploy. Then delete them and confirm they disappear.
6. Create the publish webhook in Sanity (SETUP §8.5) and re-point the Presentation tool at the live site (SETUP §8.4).

**Step 3 — Content pass (you).** Fill the must-do fields and replace every draft with the truth (SETUP §11). Add screenshots and configs.

**Step 4 — Phase 13 quality pass (AI).** Lighthouse and axe per route, overflow and keyboard tests, reduced motion and dark theme, and the content-honesty audit. Final report: built / verified / still pending from you.

**Step 5 — Launch checks (you).** Open the site on a real phone; send the link to one friend; share it in a chat app and confirm the card; submit `sitemap.xml` to Google Search Console if you want faster indexing.

---

## 13. Growing the portfolio (ideas, not promises)

The best growth comes from **doing real work and adding it as honest content**, not from adding features. In rough order of value:

1. **Turn "planned" into "live".** The Infrastructure page already lists planned parts, and each can graduate to live when it really exists:
   - **Custom domain** (easy, high impact)
   - **Uptime check** (already written; goes live once secrets are set)
   - **Security headers** in `vercel.json` (CSP, HSTS)
   - **Error tracking** in the browser (pick a tool, wire it, mark it live)
2. **Make P-04 "Run it on AWS" real.** Deploy the containerised app on AWS (for example a small VM or a managed container service), add logs and basic monitoring, then change its stage coverage from _planned_ to _implemented_ and publish a write-up. This is the single most relevant DevOps proof point for the roles you want.
3. **Publish real notes regularly.** One honest debugging note a month in the four-step format (symptom, checks, root cause, prevention) is stronger than any feature. The RSS feed and search pick them up automatically.
4. **Open-source C2.** Put the Bash CLI in a public repository, add the link under the project's Evidence, and add real terminal output.
5. **Finish the CI/CD lab properly.** Same pipeline in Jenkins and GitHub Actions with screenshots of a passing and a failing run; move its status from learning lab to live when it is genuinely built.
6. **Add certifications** when earned; the section is ready and hides itself until then.
7. **Infrastructure as code.** Describe the site's Vercel and DNS setup as code (for example Terraform), then add the part to the topology.
8. **Optional polish:** a visible RSS link on the Notes page, a "latest status" badge in the header, per-note share images, more terminal commands (`notes`, `status`).

Rules for growth: add content in the Studio first; add code only when a new _kind_ of thing is needed; keep the checks green; keep the honesty rule.

---

## 14. How to talk about it

A true, short pitch (adjust as the work grows):

> "My portfolio is a small DevOps project in itself. The code lives on GitHub; every push runs type checks, lint, tests, a colour-contrast check, a production build and an automated accessibility audit, and only a passing build on `main` is deployed to Vercel by the pipeline. Content is in Sanity, so I can publish a post without redeploying. An hourly workflow checks the site and records the result, and the site shows 'not measured yet' until it has real data rather than a made-up number."

Points a hiring manager may probe, and where the answer is in this repo:

| Question                           | Answer lives in                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| "Show me your pipeline."           | `.github/workflows/ship.yml`; the Infrastructure page                                         |
| "How do you prevent a bad deploy?" | Required checks, branch protection, only the pipeline deploys (`web/vercel.json`)             |
| "How do you handle secrets?"       | Env variable table in SETUP §4; write token only in GitHub Secrets; read-only token on server |
| "How do you monitor it?"           | `.github/workflows/uptime.yml`, `web/scripts/uptime.mjs`                                      |
| "How do you debug?"                | The note "When my app container couldn't reach MySQL"                                         |
| "What would you improve?"          | §11 and §13 of this file, stated openly                                                       |

Be ready to say which parts are real and which are planned. The site already says it.

---

## 15. Maintenance rhythm

| When                 | Do                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Every change         | Branch → pull request → wait for green checks → merge                                                                           |
| Weekly               | Glance at the **Actions** tab; make sure the uptime runs are green                                                              |
| Monthly              | Publish a note; update project status or coverage if something moved; skim the Studio's "Needs review" list                     |
| Quarterly            | Update dependencies (`npm outdated`), run the full checks, read the release notes of Next.js and Sanity; check free-plan limits |
| Before tokens expire | Create new tokens and update GitHub/Vercel secrets                                                                              |
| After job changes    | Update Experience, Résumé, "open to roles", availability in the Studio                                                          |

---

## 16. Where things live

| I want to find…                      | Look here                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| A page                               | `web/src/app/<route>/page.tsx`                                                          |
| Page building blocks                 | `web/src/components/sections/`, `components/ui/`                                        |
| Layout (header, footer, mobile menu) | `web/src/components/layout/`                                                            |
| Rich-text rendering                  | `web/src/components/portable-text/rich-text.tsx`                                        |
| Terminal logic and tests             | `web/src/components/terminal/commands.ts` and `.test.ts`                                |
| Topology logic / search index        | `web/src/lib/topology.ts`, `web/src/lib/search-index.ts`                                |
| All data queries                     | `web/src/sanity/queries.ts`                                                             |
| Generated types (never edit by hand) | `web/src/sanity/types.ts`                                                               |
| Colours, fonts, spacing              | `web/src/styles/globals.css`                                                            |
| SEO helpers, site URL                | `web/src/lib/metadata.ts`, `web/src/lib/site-url.ts`                                    |
| Share card, icons                    | `web/src/app/opengraph-image.tsx`, `web/src/app/icon.svg`, `web/scripts/make-icons.mjs` |
| Content schemas                      | `studio/schemaTypes/`                                                                   |
| Studio sidebar layout                | `studio/structure.ts`                                                                   |
| Starter content                      | `studio/seed/data.ts`                                                                   |
| CI/CD                                | `.github/workflows/ship.yml`, `uptime.yml`                                              |
| Accessibility audit, uptime script   | `web/scripts/a11y-audit.mjs`, `web/scripts/uptime.mjs`                                  |
| Rules for the AI                     | `CLAUDE.md`                                                                             |
| Editing guide for the Studio         | `STUDIO_GUIDE.md`                                                                       |
| The original brief and phase plan    | `MASTER_PROMPT.md`                                                                      |
| Design reference                     | `design/*.dc.html`                                                                      |
| Go-live instructions                 | `SETUP.md`                                                                              |
