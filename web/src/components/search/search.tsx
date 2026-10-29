import { buildSearchIndex } from '@/lib/search-index';
import { cachedSanity, type DynamicFetchOptions } from '@/sanity/live';
import { NOTES_QUERY, PROJECTS_QUERY } from '@/sanity/queries';
import { SearchPalette } from './search-palette';

/** Builds the search index from published content and mounts the palette. Root layout only. */
export async function Search({ perspective }: DynamicFetchOptions) {
  'use cache';
  // Index text is matched as plain text, so it is fetched without stega markers.
  const [{ data: projects }, { data: notes }] = await Promise.all([
    cachedSanity({ query: PROJECTS_QUERY, perspective, stega: false }),
    cachedSanity({ query: NOTES_QUERY, perspective, stega: false }),
  ]);
  return <SearchPalette items={buildSearchIndex(projects, notes)} />;
}
