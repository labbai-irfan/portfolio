import type { Metadata } from 'next';
import { sanityFetchMetadata } from '@/sanity/live';
import { PAGE_COPY_QUERY, SETTINGS_QUERY } from '@/sanity/queries';
import { getSiteUrl } from './site-url';

/** The share card rendered by app/opengraph-image.tsx. */
const GENERATED_CARD = { url: '/opengraph-image', width: 1200, height: 630 };

type SeoImage = { asset: { url: string } | null } | null | undefined;

/** The first usable Sanity image for `openGraph.images`, else the generated share card. */
export function shareImages(
  ...images: SeoImage[]
): { url: string; width?: number; height?: number }[] {
  const found = images.find((image) => image?.asset?.url);
  return found?.asset?.url
    ? [{ url: `${found.asset.url}?w=1200&h=630&fit=crop&auto=format` }]
    : [GENERATED_CARD];
}

type PageKey =
  | 'work'
  | 'notes'
  | 'journey'
  | 'experience'
  | 'skills'
  | 'infrastructure'
  | 'contact'
  | 'terminal'
  | 'resume'
  | 'notFound';

/**
 * Metadata for a page whose heading and intro live in `pageCopy`. Fetched published and without
 * stega markers: <head> text must never carry visual-editing characters.
 */
export async function pageMetadata(key: PageKey, path: string): Promise<Metadata> {
  const { data: copy } = await sanityFetchMetadata({
    query: PAGE_COPY_QUERY,
    perspective: 'published',
  });
  const intro = copy?.[key];
  return {
    title: intro?.heading ?? undefined,
    description: intro?.intro ?? undefined,
    openGraph: {
      title: intro?.heading ?? undefined,
      description: intro?.intro ?? undefined,
      images: shareImages(),
    },
    alternates: getSiteUrl() ? { canonical: path } : undefined,
  };
}

/** Site-wide defaults, from `siteSettings`. Used by the root layout. */
export async function siteMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: SETTINGS_QUERY,
    perspective: 'published',
  });
  const name = settings?.name ?? undefined;
  const title = settings?.seo?.title ?? [name, settings?.headlineLabel].filter(Boolean).join(' — ');
  const description = settings?.seo?.description ?? settings?.heroLine ?? undefined;
  const siteUrl = getSiteUrl();
  return {
    metadataBase: siteUrl ?? undefined,
    title: { default: title, template: name ? `%s — ${name}` : '%s' },
    description,
    applicationName: name,
    authors: name ? [{ name }] : undefined,
    alternates: {
      canonical: siteUrl ? '/' : undefined,
      types: { 'application/rss+xml': '/feed.xml' },
    },
    openGraph: {
      type: 'website',
      siteName: name,
      title,
      description,
      images: shareImages(settings?.seo?.shareImage),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
