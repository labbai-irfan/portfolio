# STUDIO GUIDE — editing your portfolio without touching code

Written for: you, the site owner, with no coding needed.

Everything you will ever change on the site (projects, posts, certifications, milestones, your résumé, even the hero line) is edited in the **Studio**. Click **Publish** and the live site updates within seconds. No code, no deploy.

For first-time setup, see [SETUP.md](SETUP.md). This guide is only about day-to-day editing.

**Contents**

1. [Open the Studio](#1-open-the-studio)
2. [The three golden rules](#2-the-three-golden-rules)
3. [Find your way around](#3-find-your-way-around)
4. [Add a project](#4-add-a-project)
5. [Write a blog post (note)](#5-write-a-blog-post-note)
6. [Add a certification](#6-add-a-certification)
7. [Add a milestone to the Journey](#7-add-a-milestone-to-the-journey)
8. [Change the résumé PDF](#8-change-the-résumé-pdf)
9. [Change the hero line and other site text](#9-change-the-hero-line-and-other-site-text)
10. [Reorder, hide and delete](#10-reorder-hide-and-delete)
11. [Edit by clicking on the live page (Presentation)](#11-edit-by-clicking-on-the-live-page-presentation)
12. [The "Needs review" list](#12-the-needs-review-list)
13. [Things you must not edit](#13-things-you-must-not-edit)
14. [Quick fixes](#14-quick-fixes)

---

## 1. Open the Studio

- **Live:** your Studio address, which looks like `https://your-name.sanity.studio`.
- **On your computer:** run `npm run dev`, then open http://localhost:3333.

Log in with the same account that owns the Sanity project.

---

## 2. The three golden rules

1. **Nothing is live until you click Publish.** While you type, your work is a **draft** (shown with an orange/yellow dot). The green dot means it is published.
2. **Only write what is true.** The site never invents anything, and neither should you. If something is planned, set its status to **Planned**. If it is a practice project, use **Learning lab**.
3. **Leave a field empty rather than filling it with a placeholder.** Empty links, rows and numbers are hidden on the site automatically.

---

## 3. Find your way around

The left sidebar, top to bottom:

| Folder / item      | What it controls                                                              |
| ------------------ | ----------------------------------------------------------------------------- |
| **Needs review**   | A to-do list: drafted text you should replace with the truth (see section 12) |
| **Site settings**  | Your name, hero text, contact links, résumé PDF, "Open to roles", default SEO |
| **Page copy**      | The heading and intro of every page, including the 404 page                   |
| **Home**           | Which sections show on the home page, and in what order                       |
| **Projects**       | The Work page and every project's page. **Drag to reorder**                   |
| **Blog**           | **Posts** and **Categories**                                                  |
| **Journey**        | Milestones, **Certifications** and **Experience** (jobs and education)        |
| **Skills**         | The skills table. **Drag to reorder**                                         |
| **Infrastructure** | The parts in the infrastructure diagram. **Drag to reorder**                  |
| **Site status**    | Read-only. Written automatically by the hourly health check                   |

Tip: most fields have a small grey description under the label. Read it; it says what the field does on the site.

---

## 4. Add a project

1. Sidebar → **Projects** → the **+** (Create) button.
2. Fill in:
   - **Title** and **Slug** (click _Generate_; the slug is the end of the web address).
   - **Code** such as `P-05`.
   - **Status**: Live, In development, Ships with site, Learning lab or Planned.
   - **Summary**: one or two honest sentences. This shows on the Work page card.
   - **Recruiter summary**: the "In short" box on the project page; two or three sentences for someone skimming.
   - **Tools**: the technologies used.
   - **Role** and **Started**.
   - **Stage coverage**: for each of Commit, Build, Test, Ship, Run, Observe choose _Implemented_, _Lab_, _Planned_ or _None_. Be honest; this is the project's report card.
   - **Layout**: _Case study_ (a build with a story), _Pipeline_ (a delivery pipeline) or _Lab_ (a practice exercise).
   - **Evidence**: links to the real repository, demo or write-up. Rows without a link are hidden.
   - **Introduction** and **Sections**: the body of the page. Use the toolbar for headings, lists, bold, links, **code blocks** (give them a file name), **figures** and **callouts**.
3. **Show on Home** ticks the project into the Home page's featured work.
4. Click **Publish**.

Notes:

- **Figures** need a **text equivalent**: one or two sentences describing the picture in words. The Studio will not let you publish without it. It is the caption and helps screen-reader users.
- Every image needs **alt text**.
- A project with status **Planned** appears on the Work page but has no detail page until real work exists.

---

## 5. Write a blog post (note)

1. Sidebar → **Blog** → **Posts** → **+**.
2. Fill in:
   - **Title**, **Slug**, **Category** (create new categories under Blog → Categories), **Code** like `N-02`, **Publish date**.
   - **Summary** (shown in lists, search and the RSS feed) and **Tags**.
   - **Project**: optional link to the project this post came from.
   - **Body**: the article itself, with code blocks, figures and callouts.
3. For troubleshooting write-ups, open **Debug steps (optional)** and fill the four-step format:
   - **Symptom**: what you saw, plus the exact error log.
   - **Checks**: each command you ran, what it showed, and whether it _ruled out_ a cause or _found it_.
   - **Root cause** and explanation, the **fix** (before and after), how you **verified** it.
   - **Prevention**: what stops it happening again.
   - The three one-line summaries at the top (symptom, cause, fix) feed the box at the top of the post.
4. **Publish**. The post appears on Notes, in search, in the terminal's data and in the RSS feed.

---

## 6. Add a certification

1. Sidebar → **Journey** → **Certifications** → **+**.
2. Fill in **Name**, **Issuer**, **Issue date**, optional **Credential ID**, **Verify URL** and a **Badge image** (with alt text).
3. **Publish**. The Certifications section on the Journey page appears automatically as soon as one exists; until then it shows an honest empty state.

Only add certifications you really hold.

---

## 7. Add a milestone to the Journey

1. Sidebar → **Journey** → **Milestones** → **+**.
2. Fill in:
   - **Title**: what happened.
   - **Category**: Career, Education, Project, Learning or Site.
   - **Date label**: how it is shown (for example `Aug 2026`).
   - **Sort date**: the real date, used for ordering and the year groups.
   - **Planned**: tick if it has not happened yet (it shows under "Upcoming").
   - **Latest**: tick for the one "latest" marker.
   - **Link**: optional link to a project, note or page.
3. **Publish**.

---

## 8. Change the résumé PDF

1. Sidebar → **Site settings** → **Contact & links** tab.
2. Under **Résumé PDF**, click **Upload** and pick your PDF (or replace the existing one).
3. **Publish**.

The Résumé page's Download button appears only when a file exists. The page itself is also print-ready (Ctrl/⌘ + P).

---

## 9. Change the hero line and other site text

**Hero text:** Site settings → **Hero** tab → _Headline label_, _Hero line_, _Hero paragraph_, _Summary cells_.

**Contact details:** Site settings → **Contact & links** tab → Email, LinkedIn URL, GitHub URL, Other links.

**Availability:** Site settings → **Availability** tab → _Open to roles_, _Roles wanted_, _Where_, _Availability_.

**A page's heading and intro:** **Page copy** → find the page → edit heading and intro.

**Search-engine and share text:** Site settings → **Default SEO** tab. Each project and post also has its own **SEO** group (title, description, share image) that overrides the default.

Click **Publish** after each change.

---

## 10. Reorder, hide and delete

- **Reorder:** in **Projects** (use _All projects (drag to reorder)_), Milestones, Skills and Infrastructure, drag the row by its handle. The site uses exactly that order.
- **Home page sections:** open **Home**; toggle each section's _visible_ switch and drag to reorder.
- **Hide something without deleting it:** open it and choose **Unpublish** (from the **…** menu next to Publish). It disappears from the site but you keep the content.
- **Delete:** the **…** menu → **Delete**. This cannot be undone.

---

## 11. Edit by clicking on the live page (Presentation)

The Studio has a **Presentation** tab at the top. It shows your real site next to the editor.

1. Click **Presentation**.
2. Browse your site inside the preview. Hover over text; a highlighted box appears on anything editable.
3. Click it to jump to the exact field, edit, and Publish.

If the preview says it cannot connect, check that the Studio's preview address points to your live site (the Studio setting `SANITY_STUDIO_PREVIEW_URL`, see SETUP.md) and that the site's address is allowed in Sanity's CORS settings.

---

## 12. The "Needs review" list

When content was drafted for you rather than written by you, it is marked **needs review**. These items are listed in the sidebar folder **Needs review**.

For each item:

1. Open it and read the **Review note**; it says exactly which parts were drafted.
2. Replace those parts with what is true.
3. Untick **Needs review**.
4. **Publish**.

A good target: the list is empty before you share your portfolio.

---

## 13. Things you must not edit

- **Site status**: it is read-only and written by the hourly check. It is the only source of the "up/down" and uptime figures.
- **Slugs of published items**: changing one breaks old links. If you must, accept that the old address will show the 404 page.
- Do not paste secrets (tokens, passwords) into any field. Content is public.

---

## 14. Quick fixes

| Problem                                 | Fix                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I published but nothing changed         | Hard refresh (Ctrl/⌘ + Shift + R). Updates normally appear in seconds. If not, tell your developer: the publish webhook may be missing (SETUP.md §8.5) |
| I cannot publish; a field is red        | Fill the red field (often a figure's text equivalent or an image's alt text)                                                                           |
| A project is missing from the Work page | It must have a **Slug**, and it must be **published**                                                                                                  |
| A post is missing from Notes or search  | It needs a **Slug**, a **Category**, a **Publish date** and to be published                                                                            |
| The Journey shows no certifications     | Correct: none are published yet                                                                                                                        |
| I deleted something by mistake          | Open the Studio's history for the document (the clock icon) and restore, if it still exists; otherwise recreate it                                     |
| The preview in Presentation is blank    | See section 11                                                                                                                                         |
