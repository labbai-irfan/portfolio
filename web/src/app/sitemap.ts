import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { sanityFetchMetadata } from '@/sanity/live';
import { SITEMAP_QUERY } from '@/sanity/queries';

const STATIC_PATHS = [
  '/',
  '/work',
  '/notes',
  '/journey',
  '/experience',
  '/skills',
  '/infrastructure',
  '/terminal',
  '/contact',
  '/resume',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  // Without a known domain there are no honest absolute URLs to list.
  if (!base) return [];
  const { data } = await sanityFetchMetadata({ query: SITEMAP_QUERY, perspective: 'published' });
  const url = (path: string) => new URL(path, base).toString();

  return [
    ...STATIC_PATHS.map((path) => ({ url: url(path) })),
    ...data.projects.map((p) => ({ url: url(`/work/${p.slug}`), lastModified: p._updatedAt })),
    ...data.notes.map((n) => ({ url: url(`/notes/${n.slug}`), lastModified: n._updatedAt })),
  ];
}
