// Accessibility audit for the "audit" stage of the ship pipeline: runs axe against the built site
// in a real Chrome and exits 1 on any serious or critical violation.
//
//   node scripts/a11y-audit.mjs [baseUrl]        (default http://localhost:3000)
//
// Pages: the static routes plus every project and note, read from /sitemap.xml (so a new Studio
// document is audited automatically). Each page is checked on desktop and mobile, light and dark.
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const base = new URL(process.argv[2] ?? 'http://localhost:3000');
const BLOCKING = new Set(['serious', 'critical']);

const VARIANTS = [
  { name: 'desktop light', viewport: { width: 1280, height: 900 }, colorScheme: 'light' },
  { name: 'mobile light', viewport: { width: 390, height: 844 }, colorScheme: 'light' },
  { name: 'desktop dark', viewport: { width: 1280, height: 900 }, colorScheme: 'dark' },
];

async function pagePaths() {
  const res = await fetch(new URL('/sitemap.xml', base));
  const xml = await res.text();
  // The sitemap lists the production origin; only the path matters here.
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (paths.length === 0) {
    throw new Error(
      'sitemap.xml is empty: build with NEXT_PUBLIC_SITE_URL set so the audit can find every page.',
    );
  }
  return [...new Set(paths)];
}

// A path that does not exist, so the 404 page is audited too.
const paths = [...(await pagePaths()), '/this-page-does-not-exist'];
const browser = await chromium.launch({ channel: 'chrome' });
let blocking = 0;
let advisory = 0;

for (const variant of VARIANTS) {
  const context = await browser.newContext({
    viewport: variant.viewport,
    colorScheme: variant.colorScheme,
  });
  for (const path of paths) {
    const page = await context.newPage();
    await page.goto(new URL(path, base).toString(), { waitUntil: 'networkidle' });
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    for (const v of violations) {
      const isBlocking = BLOCKING.has(v.impact ?? '');
      if (isBlocking) blocking++;
      else advisory++;
      console.log(
        `${isBlocking ? 'FAIL' : 'warn'} [${v.impact}] ${variant.name} ${path} — ${v.id}: ${v.help}`,
      );
      for (const node of v.nodes.slice(0, 3)) console.log(`       ${node.target.join(' ')}`);
    }
    await page.close();
  }
  await context.close();
}
await browser.close();

console.log(
  `\n${paths.length} pages × ${VARIANTS.length} variants: ${blocking} blocking, ${advisory} advisory.`,
);
process.exit(blocking > 0 ? 1 : 0);
