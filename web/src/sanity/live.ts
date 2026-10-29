import { cacheTag } from 'next/cache';
import { cookies, draftMode } from 'next/headers';
import {
  defineLive,
  resolvePerspectiveFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live';
import type { QueryParams } from 'next-sanity';
import { client } from './client';

// Viewer (read-only) token, server env only. Needed for drafts and Visual Editing;
// published content in this public dataset is readable without it.
const token = process.env.SANITY_API_READ_TOKEN;

/** Every cached Sanity read carries this tag, so the publish webhook can refresh all of them at once. */
export const CONTENT_TAG = 'sanity-content';

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
});

/** The app's one shared 'use cache' boundary around sanityFetch. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache';
  cacheTag(CONTENT_TAG);
  return sanityFetch(options);
};

export interface DynamicFetchOptions {
  perspective: LivePerspective;
  stega: boolean;
}

/** Published + no stega normally; drafts + stega in draft mode. Call outside 'use cache'. */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return { perspective: 'published', stega: false };
  const perspective = await resolvePerspectiveFromCookies({ cookies: await cookies() });
  return { perspective: perspective ?? 'drafts', stega: true };
}

/** For generateStaticParams: published only, no stega, never drafts. */
export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString;
  params?: QueryParams;
}) {
  'use cache';
  cacheTag(CONTENT_TAG);
  return sanityFetch({ query, params, perspective: 'published', stega: false });
}

/** For generateMetadata/generateViewport/sitemap: resolves the viewer's perspective, never stega. */
export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString;
  params?: QueryParams;
  perspective: LivePerspective;
}) {
  'use cache';
  cacheTag(CONTENT_TAG);
  return sanityFetch({ query, params, perspective, stega: false });
}
