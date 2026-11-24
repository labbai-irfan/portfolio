# Portfolio — conventions

DevOps portfolio. `web/` = Next.js (App Router, TS strict, Tailwind v4). `studio/` = standalone Sanity Studio.
Sanity is the only data store. Hosting: Vercel Hobby (site), `sanity deploy` (Studio). CI: GitHub Actions.
`design/*.dc.html` is the visual spec and read-only. Newer wins: HomeV2 > Main, HomeV2Mobile > Mobile, NavV2 everywhere, ComponentsV2 + System for tokens.
Visual overhaul (owner's brief, Nov 2026) supersedes the home design files. `PORTFOLIO_PLAN.md` is the step-by-step plan (Steps 1–6: motion foundation, hero terminal and easter eggs, container yard, CI/CD spine with the Jenkins butler on the P-03 lab branch only, projects as deployments, X-ray mode and audit) — read it before working on any step. Kubernetes appears only on the "Exploring" dock; no PostgreSQL, proficiency percentages, build durations or health indicators that the data does not hold.
`MASTER_PROMPT.md` holds the full brief and phase plan.

## Commands (run from repo root)

| Command                                  | What it does                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `npm install`                            | Installs root tooling, then `web/` and `studio/`                                               |
| `npm run dev`                            | Web on :3000 and Studio on :3333 together                                                      |
| `npm run dev:web` / `npm run dev:studio` | One of them                                                                                    |
| `npm --prefix web test`                  | Unit tests (Node test runner, no dependency): terminal commands, topology layout, search index |
| `npm run lint`                           | ESLint in both apps                                                                            |
| `npm run typecheck`                      | `tsc --noEmit` in both apps                                                                    |
| `npm run format` / `format:check`        | Prettier                                                                                       |
| `npm --prefix studio run typegen`        | Extract schema + TypeGen → `web/src/sanity/types.ts` (rerun after schema or query changes)     |
| `npm --prefix studio run schema:deploy`  | Validate locally first (`schema:validate`), then deploy schema to the dataset                  |
| `npm --prefix web run contrast`          | WCAG check of token pairs, both themes (exit 1 on fail)                                        |

Dev-only pages (404 in production): `http://localhost:3000/_kit` (component sheet, folder `%5Fkit`), `http://localhost:3000/_data` (data-layer check, folder `%5Fdata`, fetches every query with its generated type).

## Content honesty

- Zero content in code: every heading, intro, paragraph and setting comes from Sanity; components hold only fixed UI labels. Seed data lives in `studio/seed/data.ts` (`npm run seed`, idempotent, never overwrites Studio edits).
- Drafted text only the owner can verify is flagged `needsReview: true` (+ `reviewNote`); the site never queries these fields.
- Never invent employers, dates, metrics, uptime numbers, certifications, links, testimonials, or results. Only facts in MASTER_PROMPT.md section 3, or ones the owner gives.
- Labs are labelled as labs; planned items as planned.
- A link, metric, or evidence row with no real value is not rendered.
- `[square brackets]` in design files are content slots: data comes from Sanity/build data; empty → element hidden, never a placeholder.
- Status panel says "not measured yet" until a real uptime result exists.

## Positioning

- DevOps Engineer / Software Engineer (owner's redesign brief, superseding the earlier DevOps-only rule). The hero's role label, hero line, paragraph and technology line all come from Site settings (`headlineLabel`, `heroLine`, `heroParagraph`, `heroTech`); never hard-code them.
- No copy about a career change, or AI. Skills and technologies are listed only when the owner confirms they were used.

## Code

- TypeScript strict, no `any`. Server Components by default; `'use client'` only for terminal, search, topology, filters, menus, theme toggle.
- All GROQ in `web/src/sanity/queries.ts` via `defineQuery`. Types from Sanity TypeGen only; never hand-edit `types.ts` (generated; excluded from lint).
- `next.config.ts` has `cacheComponents: true`. Every route follows the three-layer pattern from `web/src/sanity/live.ts`: a page/layout component resolves `draftMode()`/`cookies()` outside any cache boundary (via `getDynamicFetchOptions()`), passes the result as props into a child with `'use cache'` that calls `cachedSanity()`/`sanityFetch()`. Never call `draftMode()` or `cookies()` inside a `'use cache'` function. Static routes use `sanityFetchStaticParams()` in `generateStaticParams`; metadata/sitemap use `sanityFetchMetadata()`. See `web/src/app/%5Fdata/page.tsx` for a worked example.
- `SanityLive` and `VisualEditing` render once, in the root layout only — never add a second instance.
- `web/src/lib/build-info.ts` reads the commit SHA / build time / run URL that `next.config.ts` bakes in from CI/Vercel env vars (`BUILD_COMMIT_SHA`, `BUILD_TIME`, `BUILD_RUN_URL`). Missing values are `null`; don't render a `null` field.
- Colours, fonts, spacing, focus styles only from tokens in `web/src/styles/globals.css`. No hex values in components. Tailwind's default colours, font sizes and radii are reset, so only tokens exist.
- Motion and depth utilities (all in `globals.css`, all off with reduced motion): `reveal` (scroll-driven fade/lift via a CSS view timeline; animates `translate` so it composes with `tilt`; unsupported browsers show the element in place), `scroll-progress` (the header's reading-progress line), `seam` (faded hairline with a signal joint on a section's top edge, uses `::after`), `grid-backdrop` (blueprint grid fading at the edges, uses `::before`), `ambient` (soft `--color-glow` light; position with `--ambient-x/--ambient-y`). Prefer these CSS-only tools over animation libraries; none are installed.
- Dark theme = `[data-theme='dark']` overriding `--color-*` (works on `<html>` or any subtree). The dark values are written twice (that block and the `prefers-color-scheme` block) — change both; the contrast script reads the first. Don't use CSS `light-dark()` for tokens: Tailwind's Lightning CSS polyfill resolves it on `:root`, so subtrees never switch. After changing a colour, run the contrast check.
- UI primitives live in `web/src/components/ui/`; reuse them before writing new markup.
- No copy hard-coded in components except fixed UI labels.
- kebab-case file names; one component per file; named exports.
- `stegaClean()` visual-editing strings before comparing; `stega: false` in `generateMetadata` and `generateStaticParams`.
- Next.js 16 differs from older versions: read `web/node_modules/next/dist/docs/` before using an API (see `web/AGENTS.md`).
- Stega: with `stega: boolean` fetch options, every string in a query result is typed `StegaString` (it may carry invisible click-to-edit markers in draft mode). Render strings as-is; run any value you COMPARE or use as a lookup key (status, layout, kind, category, tier, group, `_type`, section key) through `stegaClean()` from `@/lib/stega` first. Type component props that take query data with `Fetched<…>` from the same file, not the raw generated type.
- Always-light / always-dark pages: wrap the subtree in `data-theme="dark"` (Contact) or `data-theme="light"` (the Résumé sheet, which is paper and must print black on white) — the token set switches for that subtree whatever the site theme is.
- Résumé is print-ready: the site header, footer and skip link carry `print:hidden`; keep that on any new global chrome.
- Page copy that is not in `pageCopy` (the four-step note format, CTA banners, "What I'm looking for", section headings under the hero) is treated as fixed UI chrome. If the owner wants any of it editable, add a field rather than editing the component.
- Every page body needs `<main id="main">` — the skip link in the root layout targets `#main`.
- Theme: no stored choice → pure CSS `@media (prefers-color-scheme: dark)` follows the OS, zero JS. A stored choice is applied before paint by the inline script in `app/layout.tsx` (`<html suppressHydrationWarning>`, following Next's "preventing flash before hydration" guide exactly — don't swap this for `next/script` or drop `suppressHydrationWarning`, both are load-bearing). `ThemeToggle` also re-applies the stored choice in a `useLayoutEffect`, since React Strict Mode's dev-only remount of `<html>` clears attributes the script set that aren't in JSX; that effect is a no-op in production.
- The mobile nav (`components/layout/mobile-nav.tsx`) is a native `<dialog>` + `showModal()` — focus trap, Escape-to-close and focus restoration come from the browser, not hand-rolled JS. Keep using `<dialog>` for any future full-screen overlay (don't reach for a custom modal/focus-trap library).
- Header/footer (`components/layout/site-header.tsx` / `site-footer.tsx`) are `'use cache'` components that receive `{ perspective, stega }` as props from the root layout — the pattern every other route's shared chrome should follow.
- Detail pages (`app/work/[slug]`, `app/notes/[slug]`): the cached function only fetches and returns data; `notFound()` is called in the page, outside `'use cache'`. With Cache Components the unlisted-slug response streams, so a missing slug shows the 404 UI (with `noindex`) but the HTTP status is 200. Portable Text renders through `components/portable-text/rich-text.tsx`; figures show `textEquivalent` as the caption, and images come from `cdn.sanity.io` (allowed in `next.config.ts`).
- 404: `app/not-found.tsx` (copy from `pageCopy.notFound`, request path from the URL). Unknown top-level paths return a real 404; unknown `/work/<slug>` and `/notes/<slug>` stream the same page with HTTP 200 and `noindex` (Cache Components behaviour). The mobile header's short name comes from `shortName()` in `lib/format.ts`, never hard-coded.
- Interactive features: terminal logic is the pure `components/terminal/commands.ts` (fed by `lib/terminal-data.ts` from the same queries as the pages); topology layout is `lib/topology.ts` (chain = follow each node's first real connection from the first `infraNode`; the rest are "supporting"); search is `lib/search-index.ts` (pages and actions are fixed labels, projects/notes from Sanity), mounted once in the root layout and opened by Ctrl/Cmd K or `openSearch()`. Data fed to these is fetched with `stega: false`.
- SEO: head metadata is built in `lib/metadata.ts` (and `generateMetadata` in the two detail routes) from published, `stega: false` fetches, so it never carries visual-editing characters. The domain comes from `NEXT_PUBLIC_SITE_URL` (or Vercel's production URL, picked up automatically) via `lib/site-url.ts`; with no domain, canonical/sitemap entries/feed/JSON-LD URLs are left out, never guessed. Literal colours for generated images and the manifest live in `lib/brand.ts` (mirror the tokens). Icons are generated once by `node web/scripts/make-icons.mjs` and committed; `app/icon.svg` is hand-written and adapts to dark mode.
- CI/CD: `.github/workflows/ship.yml` runs format → typecheck → lint → unit tests → contrast → build → axe audit (`web/scripts/a11y-audit.mjs`, fails on serious/critical, reads `/sitemap.xml` for the page list) on every push and PR; only a passing push to `main` runs the `deploy` job (Vercel CLI, `vercel pull/build/deploy --prebuilt`). `web/vercel.json` turns Vercel's own Git deploys off for `main`. `uptime.yml` runs hourly and writes `siteStatus` with a write token that exists only in GitHub Secrets (`SANITY_WRITE_TOKEN`); uptime is the 7-day share of successful runs, withheld until 24 samples. Repo variables: `SITE_URL`; secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SANITY_WRITE_TOKEN`. `npm --prefix web run audit` runs the audit against a local `next start`.

## Accessibility

Semantic landmarks, skip link, visible 2px focus ring, 44px min touch targets, WCAG AA contrast (body text AAA), keyboard support for every control, respect `prefers-reduced-motion`, text equivalent for every diagram, terminal output is an `aria-live` log.
Desktop nav / mobile nav cut over at `xl` (1280px): at 1024 the full desktop nav does not fit on one row. Tested at 390/768/1024 (compact header) and 1280/1440 (desktop).

## Security

Read token only in server env vars (`SANITY_API_READ_TOKEN`, Viewer role). No write token anywhere in the website (the uptime write token lives only in GitHub Secrets). Validate webhook and draft-mode secrets.
`production` is a public dataset, so published content reads work with no token. Without `SANITY_API_READ_TOKEN` set, `defineLive` logs (not errors) that drafts/live previewing need a token — harmless until Phase 12, when draft mode and the Presentation Tool need a real Viewer token in `web/.env.local` (never committed).

## Sanity

- Studio is the only admin panel (MASTER_PROMPT 2A): any content the owner might change must be a Sanity field, never code. Fetch live (`defineLive`), keep `dynamicParams` on.
- Project `hl13utpc`, dataset `production`. Schema lives in `studio/schemaTypes/` (documents, singletons, objects, blocks); option lists in `constants.ts`.
- Edit schema locally, then `schema:validate` → `schema:deploy` → `typegen`. Never use the MCP `deploy_schema` tool (it would fork the schema from the Studio source).
- Singletons (`siteSettings`, `pageCopy`, `homePage`, `siteStatus`) use fixed `_id` = type name; all other documents get generated IDs.
- `siteStatus` is written only by the uptime workflow; it is read-only in the Studio.
- No numeric "metrics" fields on content. The only number is the measured uptime.
- Lists are ordered in Studio by drag and drop (`@sanity/orderable-document-list`, field `orderRank`): projects, milestones, skills, infra parts. Query with `| order(orderRank)`, never sort in code.
- `note` is the blog post type (categories in `noteCategory`); page headings/intros live in the `pageCopy` singleton; every content image uses `altImage` (hotspot + required alt).
- CORS origins (Sanity → API settings): `http://localhost:3333` (Studio) and `http://localhost:3000` (web) are allowed. Add the production and preview URLs in Phase 12, or `SanityLive` can't connect from them.
- Cache freshness: every cached Sanity read carries `CONTENT_TAG` (`web/src/sanity/live.ts`), and `POST /api/revalidate` (Sanity publish webhook, signed with `SANITY_REVALIDATE_SECRET`, refuses unsigned or unconfigured requests) refreshes all of it on publish. Live Content alone only refreshes while a visitor has the site open.
- Error pages: `app/not-found.tsx`, `app/error.tsx` and `app/global-error.tsx`. The last two use fixed wording, because an error page must not depend on the CMS.
- Browser-side components are not limited to the list in MASTER_PROMPT: `copy-button` and `request-panel` are also `'use client'` (a clipboard button and a `usePathname` read). Everything else stays a Server Component.
- Fixed interface text kept in code on purpose (MASTER_PROMPT §2A "stays in code"): the hero pipeline strip and its labels, section headings such as "Topology", the four-step note format, nav labels, button labels, error-page wording.
- Presentation tool: configured in `studio/sanity.config.ts`; its target site is `SANITY_STUDIO_PREVIEW_URL`. `STUDIO_GUIDE.md` is the owner's editing guide.
- Cache-refresh safety: a cache refresh (publish webhook or Live Content) rebuilds each route's static shell, and a route with a dynamic segment may not read `params` or call `usePathname()` outside `<Suspense>` while that happens, or its pages error after the first publish. So detail pages read `params` inside a `<Suspense>` child, and the header's nav (`usePathname`) is wrapped in `<Suspense>`. Any new client component that reads the path or search params must be inside `<Suspense>`. Test after a change: build, start with `SANITY_REVALIDATE_SECRET` set, send a signed `POST /api/revalidate`, then fetch every route.
- Terminal (site-wide): one session for the whole visit.
  - `components/terminal/commands.ts` is the pure, unit-tested engine; add commands and tests there.
  - `use-terminal.ts` holds session state; `terminal-view.tsx` draws a session.
  - `terminal-context.tsx` (`TerminalProvider`, `useTerminalSession`) shares the session and owns the overlay. `terminal-host.tsx`, in the root layout, loads its data with `stega: false`.
  - The hero (`hero-terminal.tsx`), the overlay (`terminal-overlay.tsx`, a native `<dialog>`) and `/terminal` all draw the same session.
  - Open the overlay with `openTerminal(fromElement)` from `lib/terminal-events.ts`; Ctrl+` opens it anywhere, and the nav Terminal entry and the search action use it.
  - The hero boot sequence (`boot.ts`) plays once per visit (sessionStorage) and never with reduced motion. Its lines are a playful start-up, not claims; keep them that way.
- A command may return an `action` (`TermAction`: `scroll` to an element id, or `shake`); `use-terminal.ts` handles it with an exhaustive switch, and `terminal-context.tsx` does the scroll (closes the overlay, glides, focuses the target; off the home page it navigates to `/#id`). `deploy` targets `DEPLOY_TARGET`. Echoed command lines carry `status` (✓ / ✗).
- Easter eggs (`sudo rm …`, `docker ps`, `kubectl get pods`, `neofetch`, `coffee`) are jokes built from `TerminalData`; their wording must never read as a claim (see `PORTFOLIO_PLAN.md`). `console-greeting.tsx` logs one DevTools hello per page load.
- Hero: `components/home/hero.tsx` (an editorial intro, not a card) plus `HeroTerminal`. New home sections go in `components/home/`; the bento tiles below the hero are being replaced section by section (redesign phases R4–R7).
- Depth and the home bento:
  - Cards use the `tile` utility (radius, soft border, two-layer `--shadow-tile`). Add `tile-interactive` when something in the card is clickable; it lifts on hover and keyboard focus. Inner-page cards (project cards, evidence ledger, spec strip, figure, role, notes, topology) already use it.
  - Home is a bento grid (`app/page.tsx`). Tiles come from the Studio's section order and visibility. `packRows()` in `lib/bento.ts` (unit-tested) gives each tile a column span so every row is exactly full at 12 and 6 columns; keep a tile's preferred widths in the page, not in CSS.
  - Every home tile sits in `<Tilt>` (`components/ui/tilt.tsx`, client). It tilts toward the pointer with a light sheen, only with a fine pointer and no reduced-motion preference.
  - The two terminal tiles use `TerminalWindow` (`components/ui/terminal-window.tsx`) at a static 3D angle that turns to face the viewer on hover.
  - Shadows, the sheen and window-button colours are tokens in `globals.css`, light and dark.
- One component per file: small helpers get their own file (for example `footer-link.tsx`, `neighbour-link.tsx`). Do not add a second component to an existing file.
