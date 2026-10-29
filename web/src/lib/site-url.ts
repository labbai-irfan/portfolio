/**
 * The site's public origin, or null while the domain is unknown. Set `NEXT_PUBLIC_SITE_URL` once the owner
 * has a domain; on Vercel the production URL is picked up automatically. Locally it falls back
 * to localhost so dev pages still work; a production build without either gets null, and every
 * absolute URL (canonical, sitemap, feed, JSON-LD) is then left out rather than guessed.
 */
export function getSiteUrl(): URL | null {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : null);
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      return null;
    }
  }
  return process.env.NODE_ENV === 'production' ? null : new URL('http://localhost:3000');
}

/** `https://example.com` + `/work` → absolute URL string, or null when the domain is unknown. */
export function absoluteUrl(path: string): string | null {
  const base = getSiteUrl();
  return base ? new URL(path, base).toString() : null;
}
