// WCAG contrast check for token pairs in globals.css, both themes.
// Usage: node scripts/check-contrast.mjs   (exits 1 on any failure)
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
const readColors = (block) =>
  Object.fromEntries([...block.matchAll(/--color-([\w-]+):\s*(#\w+);/g)].map((m) => [m[1], m[2]]));
const light = readColors(css.match(/@theme \{[\s\S]*?\n\}/)[0]);
const dark = { ...light, ...readColors(css.match(/\[data-theme='dark'\] \{[\s\S]*?\n {2}\}/)[0]) };
const tokens = { light, dark };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum] — 7 = AAA body text, 4.5 = AA text, 3 = AA UI/non-text
const pairs = [
  ['body', 'surface', 7],
  ['body', 'ground', 7],
  ['ink', 'surface', 7],
  ['ink', 'ground', 7],
  ['muted', 'surface', 4.5],
  ['muted', 'ground', 4.5],
  ['signal', 'surface', 4.5],
  ['signal', 'ground', 4.5],
  ['signal-hover', 'surface', 4.5],
  ['on-signal', 'signal', 4.5],
  ['on-signal-muted', 'signal', 4.5],
  ['on-contrast', 'contrast', 4.5],
  ['on-bar', 'bar', 4.5],
  ['on-bar-meta', 'bar', 4.5],
  ['on-bar-body', 'bar', 4.5],
  ['term-prompt', 'term', 4.5],
  ['term-out', 'term', 4.5],
  ['term-hint', 'term', 4.5],
  ['term-error', 'term', 4.5],
  ['term-label', 'term', 4.5],
  ['term-out', 'term-deep', 4.5],
  ['live', 'live-bg', 4.5],
  ['progress', 'progress-bg', 4.5],
  ['lab', 'lab-bg', 4.5],
  ['planned', 'surface', 4.5],
  ['planned', 'ground', 4.5],
  ['progress', 'surface', 4.5],
  ['signal', 'progress-bg', 4.5],
  ['muted', 'progress-bg', 4.5],
  ['rule-dashed', 'surface', 3],
  ['rule-control', 'surface', 1.4],
  ['signal', 'surface', 3],
];

let failed = 0;
for (const theme of ['light', 'dark']) {
  for (const [fg, bg, min] of pairs) {
    const r = ratio(tokens[theme][fg], tokens[theme][bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `${ok ? 'pass' : 'FAIL'}  ${theme.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)} (min ${min})`,
    );
  }
}
process.exit(failed ? 1 : 0);
