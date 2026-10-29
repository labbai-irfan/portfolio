import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';
import { sanityFetchMetadata } from '@/sanity/live';
import { SETTINGS_QUERY } from '@/sanity/queries';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { data: settings } = await sanityFetchMetadata({
    query: SETTINGS_QUERY,
    perspective: 'published',
  });
  return {
    name: settings?.name ?? undefined,
    short_name: settings?.name?.split(' ')[0] ?? undefined,
    description: settings?.heroLine ?? undefined,
    start_url: '/',
    display: 'standalone',
    background_color: BRAND.ground,
    theme_color: BRAND.ink,
    icons: [
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
