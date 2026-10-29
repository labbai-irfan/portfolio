// Renders the app icons from design/Icons.dc.html (ink square, "IN" monogram, signal notch):
//   public/icon-512.png, public/icon-maskable-512.png, src/app/apple-icon.png, src/app/favicon.ico
// The outputs are committed; run `node scripts/make-icons.mjs` only if the icon design changes.
// (src/app/icon.svg, the adaptive browser-tab icon, is hand-written.)
import { readFile, writeFile } from 'node:fs/promises';
import { ImageResponse } from 'next/dist/compiled/@vercel/og/index.node.js';

const INK = '#0a0f1c';
const SIGNAL = '#1d4ed8';
const font = await readFile(new URL('../src/assets/fonts/GeistMono-600.woff', import.meta.url));

const el = (type, style, children) => ({ type, props: { style, children } });

/** `px` is the output size; the design's 180px icon is the reference, everything scales from it. */
function icon(px, { maskable = false } = {}) {
  const k = px / 180;
  const letters = maskable ? 52 * k : 68 * k;
  const notch = maskable ? 18 * k : 30 * k;
  const text = el(
    'div',
    { display: 'flex', color: '#ffffff', fontSize: letters, letterSpacing: '-0.02em' },
    'IN',
  );
  const body = maskable
    ? el('div', { display: 'flex', position: 'relative' }, [
        text,
        el('div', {
          position: 'absolute',
          right: -14 * k,
          bottom: 2 * k,
          width: notch,
          height: notch,
          background: SIGNAL,
        }),
      ])
    : [
        text,
        el('div', {
          position: 'absolute',
          right: 18 * k,
          bottom: 18 * k,
          width: notch,
          height: notch,
          background: SIGNAL,
        }),
      ];
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: INK,
      fontFamily: 'Geist Mono',
    },
    body,
  );
}

async function png(node, px) {
  const res = new ImageResponse(node, {
    width: px,
    height: px,
    fonts: [{ name: 'Geist Mono', data: font, weight: 600, style: 'normal' }],
  });
  return Buffer.from(await res.arrayBuffer());
}

/** An .ico holding several PNG images (supported by every current browser). Each image is `{ px, bytes }`. */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ px, bytes }, i) => {
    const entry = 6 + 16 * i;
    header[entry] = px; // width
    header[entry + 1] = px; // height
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(bytes.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += bytes.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.bytes)]);
}

const out = (path) => new URL(`../${path}`, import.meta.url);
await writeFile(out('public/icon-512.png'), await png(icon(512), 512));
await writeFile(out('public/icon-maskable-512.png'), await png(icon(512, { maskable: true }), 512));
await writeFile(out('src/app/apple-icon.png'), await png(icon(180), 180));

// The favicon: 32px has the letters; 16px drops them (the design's small mark: square + notch).
const frame = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  background: INK,
  fontFamily: 'Geist Mono',
};
const notch = (size, inset) =>
  el('div', {
    position: 'absolute',
    right: inset,
    bottom: inset,
    width: size,
    height: size,
    background: SIGNAL,
  });
const favicon32 = el('div', frame, [
  el('div', { display: 'flex', color: '#ffffff', fontSize: 13 }, 'IN'),
  notch(6, 2),
]);
const favicon16 = el('div', frame, [notch(5, 2)]);
await writeFile(
  out('src/app/favicon.ico'),
  ico([
    { px: 16, bytes: await png(favicon16, 16) },
    { px: 32, bytes: await png(favicon32, 32) },
  ]),
);
console.log('icons written');
