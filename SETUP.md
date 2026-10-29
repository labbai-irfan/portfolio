# SETUP — from this folder to a live website

This is the one file that takes the project from "code on my laptop" to "live site that updates itself". It assumes you did **not** write the code by hand, so every step says what to click, what to type and what you should see.

If a step here disagrees with `CLAUDE.md` or `MASTER_PROMPT.md`, trust this file for _setup_ and those files for _how the code is written_.

**Contents**

1. [What you have](#1-what-you-have)
2. [Accounts and tools you need](#2-accounts-and-tools-you-need)
3. [Run it on your own computer](#3-run-it-on-your-own-computer)
4. [Every environment variable, and how to get it](#4-every-environment-variable-and-how-to-get-it)
5. [Put the code on GitHub](#5-put-the-code-on-github)
6. [Create the Vercel project](#6-create-the-vercel-project)
7. [Tell GitHub how to deploy (secrets and variables)](#7-tell-github-how-to-deploy-secrets-and-variables)
8. [Connect Sanity to the live site](#8-connect-sanity-to-the-live-site)
9. [Your first deploy, and how to check it](#9-your-first-deploy-and-how-to-check-it)
10. [Add your own domain](#10-add-your-own-domain)
11. [Fill in the content only you can provide](#11-fill-in-the-content-only-you-can-provide)
12. [Everyday use](#12-everyday-use)
13. [When something breaks](#13-when-something-breaks)
14. [Security checklist](#14-security-checklist)
15. [Glossary](#15-glossary)

---

## 1. What you have

One folder, two apps, three outside services.

```
labbai-irfan-portfolio/
├── web/        The website (Next.js). This is what visitors see.
├── studio/     The admin panel (Sanity Studio). This is where YOU edit content.
├── design/     The visual blueprint (HTML files). Read-only reference, never deployed.
├── .github/    The robots: ship.yml (test + deploy) and uptime.yml (hourly health check).
├── CLAUDE.md   Rules the AI follows when it edits this code.
├── MASTER_PROMPT.md  The original brief and the 13-phase build plan.
├── ROADMAP.md  What the portfolio is, what is built, what is left.
├── STUDIO_GUIDE.md  How to edit content in the Studio, no code.
└── SETUP.md    This file.
```

| Service                 | What it does for you                                                    | Cost to start     |
| ----------------------- | ----------------------------------------------------------------------- | ----------------- |
| **Sanity** (sanity.io)  | Stores all your content (projects, notes, skills…) and hosts the Studio | Free plan         |
| **GitHub** (github.com) | Stores the code, runs the checks, and triggers deploys                  | Free              |
| **Vercel** (vercel.com) | Hosts the website on the internet                                       | Hobby plan (free) |

> Plan limits change. Before you go live, open each service's pricing page and confirm the free plan still covers a personal portfolio. Vercel's Hobby plan is meant for personal, non-commercial use.

### How the pieces talk to each other

```
 you ──edit content──▶  Sanity Studio  ──saves──▶  Sanity (content lake)
                                                         │  live updates, no redeploy
 you ──git push──▶  GitHub ──▶ GitHub Actions            ▼
                      (check · build · audit)       Website on Vercel ◀── visitors
                              │ only if main passes        ▲
                              └──── deploy ────────────────┘
 GitHub Actions (hourly) ──probe the site──▶ writes "up/down" back into Sanity
```

Two important consequences:

- **Changing content never needs a deploy.** Edit in the Studio, publish, and the site updates within seconds.
- **Changing code always goes through GitHub.** Push to `main`, the checks run, and only if they all pass does it deploy.

---

## 2. Accounts and tools you need

### Accounts (all free to create)

1. **GitHub** — https://github.com/signup
2. **Vercel** — https://vercel.com/signup (choose "Continue with GitHub" so they are linked)
3. **Sanity** — you already have a project. Its ID is `hl13utpc`, dataset `production`. Log in at https://www.sanity.io/manage

### Tools on your computer

| Tool                  | Version         | Check it with    | Get it                                            |
| --------------------- | --------------- | ---------------- | ------------------------------------------------- |
| Node.js               | 24.x            | `node --version` | https://nodejs.org (the "LTS/Current" 24 line)    |
| npm                   | comes with Node | `npm --version`  | —                                                 |
| Git                   | any recent      | `git --version`  | https://git-scm.com                               |
| Google Chrome         | any recent      | —                | Needed only for the accessibility audit           |
| GitHub CLI (optional) | any             | `gh --version`   | https://cli.github.com — makes step 5 a one-liner |

Windows tip: use **Git Bash** or **PowerShell** for every command in this file. Commands are written to work in both unless noted.

---

## 3. Run it on your own computer

From the project folder (`labbai-irfan-portfolio`):

```bash
npm install
```

This installs the root tools, then `web/` and `studio/` automatically. It takes a few minutes the first time.

### 3.1 Create the web env file

Copy the example and fill it in (the values come from section 4):

```bash
# Git Bash / macOS / Linux
cp web/.env.example web/.env.local

# PowerShell
Copy-Item web/.env.example web/.env.local
```

At minimum for local work:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=hl13utpc
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-10-01
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SANITY_API_READ_TOKEN=            # optional locally, see section 4.3
```

`web/.env.local` is ignored by git on purpose. **Never commit it.**

### 3.2 Start everything

```bash
npm run dev
```

| URL                         | What                             |
| --------------------------- | -------------------------------- |
| http://localhost:3000       | The website                      |
| http://localhost:3333       | The Studio (log in with Sanity)  |
| http://localhost:3000/_kit  | Component gallery (dev-only)     |
| http://localhost:3000/_data | Data-layer self-check (dev-only) |

If the Studio asks you to log in, use the same account that owns the Sanity project.

### 3.3 The checks the robots will run (run them yourself first)

```bash
npm run format:check          # code style
npm run typecheck             # TypeScript errors
npm run lint                  # code-quality rules
npm --prefix web test         # unit tests (terminal, topology, search, uptime)
npm --prefix web run contrast # colour contrast of every token pair
npm run build                 # production build
```

Then the accessibility audit, which needs the production build running:

```bash
npm run build
npm --prefix web run start -- -p 3000      # leave this running in one terminal
# in a second terminal:
npm --prefix web run audit
```

`0 blocking` means every page passes axe on desktop, mobile and dark theme. It reads `/sitemap.xml` for the page list, so `NEXT_PUBLIC_SITE_URL` must be set when you build.

---

## 4. Every environment variable, and how to get it

An **environment variable** is a setting kept outside the code, so secrets never end up in GitHub. This project has four places that hold them:

| Where                                                   | Used by                           | Edited at        |
| ------------------------------------------------------- | --------------------------------- | ---------------- |
| `web/.env.local`                                        | Your laptop (website)             | The file itself  |
| `studio/.env` (optional)                                | Your laptop (Studio)              | The file itself  |
| **Vercel** → Settings → Environment Variables           | The live website                  | Vercel dashboard |
| **GitHub** → Settings → Secrets and variables → Actions | The pipeline and the uptime check | GitHub website   |

### 4.1 The complete list

| Variable                         | Public?    | Needed in               | What it is                                                            | Value / where to get it                                                            |
| -------------------------------- | ---------- | ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | yes        | web, Vercel, GitHub var | Which Sanity project to read                                          | `hl13utpc` (see 4.2)                                                               |
| `NEXT_PUBLIC_SANITY_DATASET`     | yes        | web, Vercel, GitHub var | Which dataset inside the project                                      | `production`                                                                       |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes        | web, Vercel, GitHub var | Sanity API date version                                               | `2026-10-01`                                                                       |
| `NEXT_PUBLIC_SANITY_STUDIO_URL`  | yes        | web, Vercel             | Where the Studio lives (for the "edit" overlay)                       | Local: `http://localhost:3333`. Live: your `*.sanity.studio` address (section 8.2) |
| `NEXT_PUBLIC_SITE_URL`           | yes        | web, Vercel             | The site's own address (canonical links, sitemap, RSS)                | Local: `http://localhost:3000`. Live: your final URL, e.g. `https://yourname.dev`  |
| `SANITY_API_READ_TOKEN`          | **secret** | web, Vercel             | Lets the site read **drafts** for live preview                        | A **Viewer** token (4.3)                                                           |
| `SANITY_REVALIDATE_SECRET`       | **secret** | web, Vercel             | Signs the Sanity publish webhook so only Sanity can refresh the cache | Any long random string you invent (8.5)                                            |
| `SANITY_STUDIO_PROJECT_ID`       | yes        | studio (optional)       | Same project ID, for the Studio                                       | `hl13utpc` (default already built in)                                              |
| `SANITY_STUDIO_DATASET`          | yes        | studio (optional)       | Same dataset, for the Studio                                          | `production` (default)                                                             |
| `SANITY_STUDIO_PREVIEW_URL`      | yes        | studio (optional)       | The website address the Presentation tool previews                    | Local: `http://localhost:3000`. Live: your site URL                                |
| `VERCEL_TOKEN`                   | **secret** | GitHub secret           | Lets GitHub deploy for you                                            | 4.4                                                                                |
| `VERCEL_ORG_ID`                  | secret-ish | GitHub secret           | Which Vercel account/team                                             | 4.5                                                                                |
| `VERCEL_PROJECT_ID`              | secret-ish | GitHub secret           | Which Vercel project                                                  | 4.5                                                                                |
| `SANITY_WRITE_TOKEN`             | **secret** | GitHub secret **only**  | Lets the hourly check write "up/down" into Sanity                     | An **Editor** token (4.6)                                                          |
| `SITE_URL`                       | no         | GitHub **variable**     | The live URL the hourly check requests                                | Your live URL                                                                      |

"Public" means it is safe to appear in the browser. The `NEXT_PUBLIC_` prefix is what makes Next.js expose a value to the browser, so **never put a secret behind that prefix**.

**Set automatically, you do nothing:** `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_GIT_COMMIT_SHA` (Vercel), `GITHUB_SHA`, `GITHUB_SERVER_URL`, `GITHUB_REPOSITORY`, `GITHUB_RUN_ID` and `GITHUB_TOKEN` (GitHub). The site uses them for the commit and run link in the footer and for the status panel.

### 4.2 Sanity project ID, dataset, API version

You already have these:

- **Project ID:** `hl13utpc`
- **Dataset:** `production` (it is public, so published content can be read without a token)
- **API version:** `2026-10-01` (just a date; leave as is)

To double-check: https://www.sanity.io/manage → click your project → the ID is at the top.

### 4.3 `SANITY_API_READ_TOKEN` (Viewer token)

Why: published content needs no token, but **live preview and draft mode** do.

1. Go to https://www.sanity.io/manage → your project → **API** → **Tokens**.
2. **Add API token**.
3. Name: `website-read`. Permissions: **Viewer**.
4. Create it and **copy the token immediately**. Sanity shows it only once.
5. Paste it into `web/.env.local` and into Vercel (section 6).

Never use a token with more power than Viewer here.

### 4.4 `VERCEL_TOKEN`

1. https://vercel.com/account/tokens → **Create Token**.
2. Name `github-deploy`, scope: your account/team, expiry: your choice (set a reminder to renew).
3. Copy it once. It goes into GitHub Secrets (section 7).

### 4.5 `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

Easiest way, after creating the Vercel project (section 6):

```bash
npm install --global vercel
vercel login
vercel link       # run from the repo root; choose your project when asked
```

It writes `.vercel/project.json`:

```json
{ "orgId": "team_or_user_xxxxxxxx", "projectId": "prj_xxxxxxxx" }
```

`orgId` is `VERCEL_ORG_ID`, `projectId` is `VERCEL_PROJECT_ID`. (`.vercel/` is git-ignored.) You can also find the project ID in Vercel → your project → **Settings → General**.

### 4.6 `SANITY_WRITE_TOKEN` (Editor token)

Only the hourly uptime check uses this. It exists **only in GitHub**, never in Vercel or `.env.local`.

1. Same screen as 4.3: **API → Tokens → Add API token**.
2. Name `uptime-writer`. Permissions: **Editor**.
3. Copy it once and store it as a GitHub Secret (section 7).

### 4.7 `NEXT_PUBLIC_SITE_URL` and `SITE_URL`

These are your site's address **with no trailing path**, for example `https://irfan.dev`. Until you buy a domain you can use the free Vercel address from step 6 (for example `https://your-project.vercel.app`) and switch later (section 10).

> If `NEXT_PUBLIC_SITE_URL` is missing in a production build: canonical tags are omitted, `sitemap.xml` is empty and `/feed.xml` returns 404. That is deliberate: the site refuses to guess a domain.

---

## 5. Put the code on GitHub

The folder is already a git repository (branch `main`), but **nothing has been committed yet**.

### 5.1 Check nothing secret will be uploaded

```bash
git status --short
```

You should see `.github/`, `.gitignore`, `web/`, `studio/`, etc. You must **not** see `.env.local` or any `.env` file. (The `.gitignore` already blocks them; `web/.env.example` is safe and is allowed.)

### 5.2 First commit

```bash
git add .
git commit -m "Initial commit: portfolio site and Studio"
```

### 5.3 Create the GitHub repository and push

**Option A — GitHub CLI (one command):**

```bash
gh auth login                                   # once
gh repo create portfolio --private --source=. --remote=origin --push
```

**Option B — in the browser:**

1. https://github.com/new → name it (for example `portfolio`).
2. Choose **Private** or **Public** (Public is fine; no secrets are in the code).
3. Do **not** tick "Add a README".
4. Copy the commands GitHub shows under "push an existing repository":

```bash
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

### 5.4 What happens right after you push

GitHub Actions starts the `ship` workflow automatically. The **check · build · audit** job should pass. The **deploy** job will fail or be skipped until sections 6 and 7 are done. That is expected.

Watch it at: your repo → **Actions** tab.

### 5.5 Protect `main` (recommended)

Repo → **Settings → Branches → Add rule** for `main`:

- Require a pull request before merging.
- Require status checks to pass → select **check · build · audit**.

Now a broken change cannot reach `main`, so it cannot reach production.

---

## 6. Create the Vercel project

1. https://vercel.com/new → **Import** the GitHub repository from step 5.
2. **Framework Preset:** Next.js (auto-detected).
3. **Root Directory:** click **Edit** and choose **`web`**. This is critical because the website lives in `web/`.
4. Leave Build/Output commands on their defaults.
5. Open **Environment Variables** and add (apply to **Production**, **Preview** and **Development**):

   | Name                             | Value                                                               |
   | -------------------------------- | ------------------------------------------------------------------- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID`  | `hl13utpc`                                                          |
   | `NEXT_PUBLIC_SANITY_DATASET`     | `production`                                                        |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-10-01`                                                        |
   | `NEXT_PUBLIC_SANITY_STUDIO_URL`  | your Studio URL (fill after section 8.2; put the local one for now) |
   | `NEXT_PUBLIC_SITE_URL`           | your site URL (Vercel address for now)                              |
   | `SANITY_API_READ_TOKEN`          | the Viewer token from 4.3                                           |

6. Click **Deploy**. This first deploy is made by Vercel itself. After this, the pipeline takes over.

### 6.1 Make the pipeline the only way to production

The file `web/vercel.json` already switches off Vercel's automatic deploys for `main`:

```json
{ "git": { "deploymentEnabled": { "main": false } } }
```

So pushing to `main` will **not** deploy by itself. Only the GitHub Action does, and only after every check passes. Pull-request previews stay on.

> Check it: Vercel → project → **Settings → Git**. After your next push to `main` you should see **no** automatic Vercel deployment, only the one created by the Action.

### 6.2 Find your live address

Vercel → project → **Domains** shows `something.vercel.app`. Copy it. This is your first `NEXT_PUBLIC_SITE_URL` and `SITE_URL` value (with `https://` in front).

---

## 7. Tell GitHub how to deploy (secrets and variables)

Repo → **Settings → Secrets and variables → Actions**.

### 7.1 Secrets (tab "Secrets" → New repository secret)

| Name                 | Value                 | Used by             |
| -------------------- | --------------------- | ------------------- |
| `VERCEL_TOKEN`       | token from 4.4        | deploy job          |
| `VERCEL_ORG_ID`      | `orgId` from 4.5      | deploy job          |
| `VERCEL_PROJECT_ID`  | `projectId` from 4.5  | deploy job          |
| `SANITY_WRITE_TOKEN` | Editor token from 4.6 | hourly uptime check |

### 7.2 Variables (tab "Variables" → New repository variable)

| Name       | Value                                      | Used by      |
| ---------- | ------------------------------------------ | ------------ |
| `SITE_URL` | your live URL, e.g. `https://x.vercel.app` | uptime check |

Optional: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`. The workflow already falls back to `hl13utpc`, `production`, `2026-10-01`.

### 7.3 The `production` environment

Repo → **Settings → Environments → New environment** → name it exactly `production`. (You can add yourself as a "required reviewer" if you want a manual approval before each deploy.)

### 7.4 Run the pipeline

Make any small change, commit and push to `main` (or re-run the last workflow from the **Actions** tab). Expect this order:

```
check · build · audit  ✓   (format, types, lint, tests, contrast, build, axe)
deploy                 ✓   (vercel pull → build → deploy)
```

Open the live URL. The footer's **Commit** and **Built** now show real values.

### 7.5 The hourly uptime check

`uptime.yml` runs at minute 17 of every hour. To test it immediately: **Actions → uptime → Run workflow**.

What you should see:

- The run is green when the site answers, red when it does not.
- In the Studio, **Site status** shows `up`/`down` and a "checked at" time.
- The status panel on `/infrastructure` and the home page changes from "not measured yet" to `up`.
- **Uptime %** appears only after at least 24 hourly results exist (about a day). It is the share of green runs in the last 7 days.

---

## 8. Connect Sanity to the live site

### 8.1 Allow the website to talk to Sanity (CORS)

https://www.sanity.io/manage → project → **API → CORS origins → Add CORS origin**. Add each of these (they may already include the two `localhost` entries):

| Origin                                                     | Allow credentials |
| ---------------------------------------------------------- | ----------------- |
| `http://localhost:3000`                                    | yes               |
| `http://localhost:3333`                                    | yes               |
| your live site, e.g. `https://x.vercel.app` or your domain | yes               |
| your Studio, e.g. `https://yourname.sanity.studio`         | yes               |

If you want Vercel preview deployments to work too, Sanity accepts wildcard origins such as `https://*.vercel.app` (confirm on the CORS screen). Without the right origin, live updates in the browser silently fail.

### 8.2 Deploy the Studio (your admin panel on the internet)

```bash
npm --prefix studio run deploy
```

- It asks for a hostname, for example `irfan-portfolio`. Your Studio becomes `https://irfan-portfolio.sanity.studio`.
- Log in the same way as locally.

Then update `NEXT_PUBLIC_SANITY_STUDIO_URL` in Vercel to that address and redeploy (push any commit).

### 8.3 Deploy the content schema

You only need this when someone changes the files in `studio/schemaTypes/`:

```bash
npm --prefix studio run schema:validate
npm --prefix studio run schema:deploy
npm --prefix studio run typegen      # regenerates web/src/sanity/types.ts
```

Commit the regenerated `types.ts`.

### 8.4 Draft mode and the Presentation tool

The site has the draft-mode endpoints (`/api/draft-mode/enable` and `/disable`) and uses your read token. The Studio now has the **Presentation** tab (click-to-edit on the live page). To point it at your live site:

1. Set `SANITY_STUDIO_PREVIEW_URL` to your site address before deploying the Studio. Put it in a `studio/.env` file, or set it in the terminal first (PowerShell: `$env:SANITY_STUDIO_PREVIEW_URL="https://your-site"`; Git Bash: `export SANITY_STUDIO_PREVIEW_URL=https://your-site`).
2. Run `npm --prefix studio run deploy` again.
3. In the Studio open **Presentation**. Your site loads inside it and you can click text to edit it.

It needs `SANITY_API_READ_TOKEN` set in Vercel (4.3) and your site and Studio addresses in Sanity's CORS list (8.1).

### 8.5 The publish webhook (so every cache refreshes at once)

The site refreshes through Sanity live events, but that only happens while someone has the site open. The webhook makes sure that a publish refreshes **everything** (pages, `sitemap.xml`, the RSS feed, search and terminal data) even if nobody is looking.

1. Invent a long random secret. One way to make one:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Add it to Vercel as `SANITY_REVALIDATE_SECRET` (and to `web/.env.local` if you want to test locally). Redeploy.
3. https://www.sanity.io/manage → your project → **API → Webhooks → Create webhook**:
   - **Name:** `refresh-site`
   - **URL:** `https://<your-site>/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** leave empty (all documents)
   - **Projection:** `{_id, _type}`
   - **HTTP method:** POST
   - **Secret:** the same secret as step 1
4. Save. Publish any change in the Studio. In the webhook's **Attempts** log you should see a `200` response.

If the secret is missing on the site the endpoint answers `503`; if the signature is wrong it answers `401`. It never refreshes anything without a valid signature.

---

## 9. Your first deploy, and how to check it

Tick every line. If something fails, see section 13.

- [ ] GitHub → Actions: latest `ship` run is green (both jobs).
- [ ] The live URL opens the home page. The hero reads "I automate how software ships and runs."
- [ ] Footer shows a **Commit** (short hash) and **Built** date.
- [ ] `/work` lists five projects; `/work/this-portfolio` opens.
- [ ] `/notes/app-container-could-not-reach-mysql` opens.
- [ ] `/terminal`: type `help`, press Enter; `projects` lists five rows.
- [ ] `Ctrl + K` (or `⌘ + K`) opens search.
- [ ] `/infrastructure` shows the diagram; hovering a box dims the unrelated ones.
- [ ] `/sitemap.xml`, `/robots.txt`, `/feed.xml` and `/manifest.webmanifest` open (they need `NEXT_PUBLIC_SITE_URL`).
- [ ] Change a project's summary in the Studio, publish, refresh: the change appears within seconds, and **no deploy ran**.
- [ ] Viewing source of the home page shows a `<script type="application/ld+json">` block (your Person data).
- [ ] Sharing the URL in a chat app shows a card with your name (the image comes from `/opengraph-image`).

---

## 10. Add your own domain

1. Buy a domain from any registrar.
2. Vercel → project → **Settings → Domains → Add**. Enter `yourname.dev` (and `www.yourname.dev` if wanted).
3. Vercel shows the exact DNS records to create at your registrar (usually an `A` record for the root and a `CNAME` for `www`). Add them exactly as shown. HTTPS is issued automatically; allow a few minutes up to a day for DNS.
4. Update everything that mentions the old address:
   - Vercel env `NEXT_PUBLIC_SITE_URL` → `https://yourname.dev`
   - GitHub variable `SITE_URL` → `https://yourname.dev`
   - Sanity CORS origin → add `https://yourname.dev`
5. Push any commit to redeploy so canonical links, sitemap and RSS use the new domain.
6. In the Studio, the "Custom domain" part on the Infrastructure page is marked **planned**. Open **Infrastructure part → Custom domain**, set its state to **Live**, and update its text. The site updates by itself.

---

## 11. Fill in the content only you can provide

The Studio is the admin panel. Open it (local `http://localhost:3333` or your `.sanity.studio` address). Everything below is **hidden or marked as draft on the site until you fill it in**. The site never invents these.

### 11.1 Must-do (the site is missing these)

| Where in Studio                 | Field                           | Why                                       |
| ------------------------------- | ------------------------------- | ----------------------------------------- |
| Site settings → Contact & links | Email, LinkedIn URL, GitHub URL | Contact page, terminal `contact`, JSON-LD |
| Site settings                   | Résumé PDF                      | Résumé page download button               |
| Projects → C2                   | Repository URL (under Evidence) | Links the real code                       |
| Milestones (two of them)        | Real month + sort date          | Currently drafted months                  |
| Certifications                  | Add any certification you hold  | Section shows an empty state today        |

### 11.2 Review the drafts (marked `needsReview`)

These were written as realistic drafts. **Replace them with what you really did**, then untick "needs review":

- Project **Containerised app + MySQL** (commands, names, ports, steps)
- Project **CI/CD pipeline lab** (the two pipeline files, notes, add screenshots)
- Project **C2 — Continuous Control** (start month, commands, code, terminal output, lessons)
- Role **Junior Software Engineer** ("Also in the role" paragraph, context)
- Role **B.Sc. Information Technology** (campus location)
- Role **Full-Stack Developer Intern** (responsibilities)
- Milestones: container lab, CI/CD lab (months)
- **Page copy** (intros for Notes, Journey, Experience, Résumé)
- **Site settings** ("Where", "Availability")
- Note **When my app container couldn't reach MySQL** (use your real log lines and commands)

Easiest: open the Studio folder **Content → Needs review**, which lists every one of them. (You can also run this in the Studio's **Vision** tab:)

```groq
*[needsReview == true]{_type, "title": coalesce(title, name), reviewNote}
```

### 11.3 What each Studio section controls (full walkthrough: [STUDIO_GUIDE.md](STUDIO_GUIDE.md))

| Studio section       | Controls                                                                            |
| -------------------- | ----------------------------------------------------------------------------------- |
| Site settings        | Name, hero text, summary cells, "open to roles", contact links, résumé, default SEO |
| Page copy            | The heading and intro of every page                                                 |
| Home page            | Which sections show on the home page and in what order                              |
| Projects             | Work page, detail pages, search, terminal, sitemap. **Drag to reorder**             |
| Notes + categories   | Blog posts, four-step debugging format, RSS feed                                    |
| Milestones           | Journey page timeline. **Drag to reorder**                                          |
| Experience           | Experience page and résumé                                                          |
| Skills               | Skills page, tiers (at work / in projects / learning). **Drag to reorder**          |
| Certifications       | Certifications on the Journey page                                                  |
| Infrastructure parts | The topology diagram and stack table. **Drag to reorder**                           |
| Site status          | **Read-only.** Written only by the hourly uptime check                              |

### 11.4 Honesty rules the site enforces

- Planned work is labelled **planned**; learning labs are labelled **learning lab**.
- Links, rows and numbers that have no real value are **not shown**.
- The only number the site ever shows is the **measured uptime**, and only after real checks exist.

Keep to the same rules when you edit.

### 11.5 Re-seeding (rarely needed)

```bash
npm run seed
```

Loads the starter content. It is **idempotent and never overwrites** things you changed in the Studio. It needs you to be logged in to Sanity in your terminal.

---

## 12. Everyday use

| I want to…                            | Do this                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Add a project, note, skill, milestone | Studio → create → Publish. Live in seconds. No code.                                                                               |
| Change the hero line                  | Studio → Site settings → Hero line → Publish                                                                                       |
| Reorder projects/skills/milestones    | Studio → drag the rows                                                                                                             |
| Hide the "open to roles" badge        | Studio → Site settings → untick "Open to roles"                                                                                    |
| Change how the site looks or behaves  | Edit code (or ask the AI), commit on a branch, open a pull request, merge when green                                               |
| Add a field to a content type         | Edit `studio/schemaTypes/…`, then `schema:validate` → `schema:deploy` → `typegen`, update the query in `web/src/sanity/queries.ts` |
| See the site as the robots see it     | GitHub → Actions → open the latest run                                                                                             |

### The safe way to change code

```bash
git switch -c my-change          # work on a branch, never directly on main
# …make changes…
npm run format && npm run lint && npm run typecheck && npm --prefix web test
git add . && git commit -m "Describe the change"
git push -u origin my-change     # then open a Pull Request on GitHub
```

Vercel builds a **preview URL** for the pull request. When the checks are green, merge. The merge to `main` triggers the deploy.

### Working with an AI assistant on this repo

Tell it to read `CLAUDE.md` first. It contains the conventions (no hard-coded content, colours only from tokens, queries only in `queries.ts`, types from TypeGen, and so on) and the exact commands.

---

## 13. When something breaks

| Symptom                                              | Likely cause                                | Fix                                                                                    |
| ---------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm install` fails                                  | Wrong Node version                          | Use Node 24 (`node --version`)                                                         |
| Site shows no content locally                        | Wrong/missing Sanity env values             | Re-check `web/.env.local` (4.2)                                                        |
| Studio says "Project not found" or won't log in      | Logged into the wrong Sanity account        | `npx sanity logout` then `npx sanity login` inside `studio/`                           |
| Browser console: "CORS" or live updates never arrive | Site URL not in Sanity CORS                 | Add the origin (8.1)                                                                   |
| Pull request fails at **Format**                     | Code style                                  | `npm run format`, commit                                                               |
| Fails at **Type-check**                              | A TypeScript error                          | Read the error line; `npm run typecheck` locally                                       |
| Fails at **Unit tests**                              | A behaviour change broke a test             | `npm --prefix web test` shows which                                                    |
| Fails at **Colour contrast**                         | A colour token pair is too low contrast     | `npm --prefix web run contrast` shows the pair                                         |
| Fails at **Build**                                   | Code or env problem                         | Read the log; check env variables                                                      |
| Fails at **Accessibility audit**                     | A page has a serious/critical axe violation | The log lists page, rule and element; fix, or run `npm --prefix web run audit` locally |
| Audit says "sitemap.xml is empty"                    | Built without `NEXT_PUBLIC_SITE_URL`        | Set it for the build (the workflow does)                                               |
| **deploy** fails: "No existing credentials"/401      | `VERCEL_TOKEN` wrong or expired             | Create a new token (4.4), update the secret                                            |
| **deploy** fails: project not found                  | Wrong `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`   | Re-run `vercel link`, copy again (4.5)                                                 |
| **deploy** succeeds but site is empty/old            | Vercel env variables missing                | Add them (6, step 5) and redeploy                                                      |
| Pushing to `main` created an extra Vercel deployment | Auto-deploy not disabled                    | Confirm `web/vercel.json` is committed and Root Directory is `web`                     |
| `/feed.xml` is 404, sitemap empty                    | `NEXT_PUBLIC_SITE_URL` not set in Vercel    | Set it and redeploy                                                                    |
| Uptime run fails with "Missing SITE_URL"             | GitHub variable not set                     | Add `SITE_URL` (7.2)                                                                   |
| Uptime run fails with "Sanity mutate 401/403"        | Write token wrong or not Editor             | Recreate the token (4.6)                                                               |
| Status panel still says "not measured yet"           | Fewer than 24 checks so far                 | Wait a day; status will say up/down sooner                                             |
| Pages say 404 but the browser tab shows status 200   | Known Next.js behaviour with streaming      | Harmless; the page has `noindex`                                                       |
| Studio form shows an error on publish                | A required field is empty                   | Fill the red field (for example an image's alt text)                                   |

If you are stuck, copy the exact error text and the step number from this file to your AI assistant. That is enough context for it to help.

---

## 14. Security checklist

- [ ] `.env.local` is **not** in git (`git ls-files | grep env` should show only `web/.env.example` and `studio/.env.example`).
- [ ] The only token in Vercel is the **Viewer** read token. There is **no write token** in the website, ever.
- [ ] `SANITY_WRITE_TOKEN` exists only as a GitHub Secret.
- [ ] No secret begins with `NEXT_PUBLIC_`.
- [ ] Branch protection on `main` requires the check job to pass.
- [ ] Tokens have an expiry reminder in your calendar.
- [ ] If a token ever appears in a screenshot, chat or commit: revoke it in Sanity/Vercel/GitHub **immediately** and create a new one.
- [ ] The Sanity dataset is public for _reading published content_. Anything you do not want public must stay a **draft** or must never be put in Sanity.

Planned hardening (listed on the Infrastructure page as planned): security headers (CSP, HSTS), error tracking.

---

## 15. Glossary

| Term                 | Meaning                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| Repository (repo)    | The project folder tracked by git, stored on GitHub                            |
| Commit               | A saved snapshot of your code                                                  |
| Branch               | A separate line of work. `main` is the real one                                |
| Pull request (PR)    | A request to merge a branch into `main`, where the checks run                  |
| CI/CD                | Robots that test (CI) and deploy (CD) on every change                          |
| GitHub Actions       | GitHub's robot system; its recipes live in `.github/workflows/`                |
| Secret               | A hidden value stored in GitHub/Vercel (tokens)                                |
| Environment variable | A named setting kept outside the code                                          |
| Sanity               | The content database + the Studio editing screen                               |
| Studio               | The admin panel where you edit content                                         |
| Dataset              | A container of documents inside a Sanity project (`production`)                |
| Schema               | The definition of what fields each content type has (`studio/schemaTypes/`)    |
| TypeGen              | Tool that turns the schema + queries into TypeScript types                     |
| GROQ                 | Sanity's query language                                                        |
| CORS                 | A browser safety rule; Sanity must list your site as an allowed origin         |
| Draft mode           | A preview mode that shows unpublished edits                                    |
| Preview deployment   | A temporary site Vercel builds for every pull request                          |
| axe                  | The accessibility checking engine used in the audit                            |
| Stega                | Invisible markers used by visual editing; kept out of page titles and metadata |
