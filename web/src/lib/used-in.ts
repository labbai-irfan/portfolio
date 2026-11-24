import { type Fetched, stegaClean } from '@/lib/stega';
import type { SKILLS_QUERY_RESULT } from '@/sanity/types';

type UsedIn = NonNullable<Fetched<SKILLS_QUERY_RESULT[number]>['usedIn']>[number];

/** Where a skill is used: a link to the project, note or experience it comes from. */
export function usedInLink(item: UsedIn | null) {
  if (!item) return null;
  const type = stegaClean(item._type);
  if (type === 'role') return { href: '/experience', label: 'Experience' };
  if (type === 'project' && item.slug)
    return { href: `/work/${item.slug}`, label: item.title ?? item.code ?? 'Project' };
  if (type === 'note' && item.slug)
    return { href: `/notes/${item.slug}`, label: item.title ?? 'Note' };
  return null;
}
