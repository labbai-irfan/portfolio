import { stegaClean, type StegaBranded } from 'next-sanity';

/**
 * A query result as `sanityFetch` returns it with stega on (draft mode / Presentation tool):
 * every display string may carry invisible edit markers, so TypeScript brands them. Render
 * them as they are — that is what makes click-to-edit work — but run any value you COMPARE
 * (status, layout, kind, category, a lookup key) through `stegaClean` first.
 */
export type Fetched<T> = StegaBranded<T>;

export { stegaClean };
