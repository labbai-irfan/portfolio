import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { BRAND } from '@/lib/brand';
import { sanityFetchMetadata } from '@/sanity/live';
import { SETTINGS_QUERY } from '@/sanity/queries';

export const alt = 'Share card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const fontFile = async (file: string) =>
  (await readFile(join(process.cwd(), 'src/assets/fonts', file))).toString('base64');

const toArrayBuffer = (base64: string) => {
  const bytes = Buffer.from(base64, 'base64');
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

// Read inside a cache boundary so the card can be generated at build time (as base64: cached
// values are serialised, and raw buffers do not survive that).
async function loadFonts() {
  'use cache';
  const [sans, sansMedium, mono] = await Promise.all([
    fontFile('Geist-600.woff'),
    fontFile('Geist-500.woff'),
    fontFile('GeistMono-500.woff'),
  ]);
  return { sans, sansMedium, mono };
}

// The pipeline strip is the same fixed sequence the home page shows.
const STEPS = ['push', 'check', 'build', 'audit', 'deploy'];

/** The 1200×630 share card from design/ShareCard.dc.html, filled from siteSettings. */
export default async function OpenGraphImage() {
  const [{ data: settings }, fonts] = await Promise.all([
    sanityFetchMetadata({ query: SETTINGS_QUERY, perspective: 'published' }),
    loadFonts(),
  ]);
  const [first, ...rest] = (settings?.name ?? '').split(' ');
  const monogram = (settings?.name ?? '')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const grid = `linear-gradient(${BRAND.grid} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.grid} 1px, transparent 1px)`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: BRAND.ground,
        backgroundImage: grid,
        backgroundSize: '30px 30px',
        border: `2px solid ${BRAND.ink}`,
        color: BRAND.ink,
        fontFamily: 'Geist',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            background: BRAND.ink,
            color: BRAND.surface,
            fontFamily: 'Geist Mono',
            fontSize: 20,
          }}
        >
          {monogram}
          <div
            style={{
              position: 'absolute',
              right: -6,
              bottom: -6,
              width: 15,
              height: 15,
              background: BRAND.signal,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: 'Geist Mono',
            fontSize: 20,
            letterSpacing: '0.08em',
            color: BRAND.body,
            textTransform: 'uppercase',
          }}
        >
          {settings?.headlineLabel}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 104,
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
          }}
        >
          <span>{first}</span>
          <span>{rest.join(' ')}</span>
        </div>
        <div
          style={{
            fontFamily: 'Geist Medium',
            fontSize: 34,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: BRAND.body,
          }}
        >
          {settings?.heroLine}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: BRAND.surface,
          border: `2px solid ${BRAND.ink}`,
          fontFamily: 'Geist Mono',
          fontSize: 18,
        }}
      >
        <div
          style={{
            padding: '16px 22px',
            background: BRAND.ink,
            color: BRAND.surface,
            letterSpacing: '0.06em',
          }}
        >
          SHIPPED BY
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 12px',
          }}
        >
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', gap: 28 }}>
              {i > 0 && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 11h15M12 5l6 6-6 6" stroke={BRAND.signal} strokeWidth="2" />
                </svg>
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: toArrayBuffer(fonts.sans), weight: 600, style: 'normal' },
        {
          name: 'Geist Medium',
          data: toArrayBuffer(fonts.sansMedium),
          weight: 500,
          style: 'normal',
        },
        { name: 'Geist Mono', data: toArrayBuffer(fonts.mono), weight: 500, style: 'normal' },
      ],
    },
  );
}
