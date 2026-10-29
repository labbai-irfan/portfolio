// The search palette's index and filter, pure so they can be unit-tested. Pages and actions are
// fixed navigation labels; projects and notes come from Sanity at build time.

export type SearchGroup = 'Pages' | 'Projects' | 'Notes' | 'Actions';

export type SearchItem = {
  id: string;
  group: SearchGroup;
  badge: string;
  title: string;
  sub: string;
  /** Where Enter goes. Items with an `action` run it instead. */
  href?: string;
  action?: 'theme';
  keywords: string;
};

export const GROUP_ORDER: SearchGroup[] = ['Pages', 'Projects', 'Notes', 'Actions'];

const PAGES: { title: string; href: string; keywords: string }[] = [
  { title: 'Home', href: '/', keywords: 'start index' },
  { title: 'Work', href: '/work', keywords: 'projects portfolio' },
  { title: 'Notes', href: '/notes', keywords: 'blog posts debugging writing' },
  { title: 'Journey', href: '/journey', keywords: 'timeline history about milestones' },
  { title: 'Experience', href: '/experience', keywords: 'jobs career about work history' },
  { title: 'Skills', href: '/skills', keywords: 'stack tech about tools' },
  { title: 'Infrastructure', href: '/infrastructure', keywords: 'infra hosting devops topology' },
  { title: 'Terminal', href: '/terminal', keywords: 'shell cli command' },
  { title: 'Contact', href: '/contact', keywords: 'hire email reach' },
  { title: 'Résumé', href: '/resume', keywords: 'cv resume pdf' },
];

type ProjectSource = {
  code: string;
  title: string;
  slug: string;
  summary: string;
  tools: string[] | null;
};
type NoteSource = {
  code: string | null;
  title: string;
  slug: string;
  summary: string;
  tags: string[] | null;
  category: { title: string };
};

export function buildSearchIndex(projects: ProjectSource[], notes: NoteSource[]): SearchItem[] {
  return [
    ...PAGES.map<SearchItem>((p) => ({
      id: `page-${p.href}`,
      group: 'Pages',
      badge: 'PG',
      title: p.title,
      sub: p.href,
      href: p.href,
      keywords: p.keywords,
    })),
    ...projects.map<SearchItem>((p) => ({
      id: `project-${p.slug}`,
      group: 'Projects',
      badge: p.code,
      title: p.title,
      sub: p.summary,
      href: `/work/${p.slug}`,
      keywords: (p.tools ?? []).join(' '),
    })),
    ...notes.map<SearchItem>((n) => ({
      id: `note-${n.slug}`,
      group: 'Notes',
      badge: n.code ?? 'NT',
      title: n.title,
      sub: `${n.category.title} · ${n.summary}`,
      href: `/notes/${n.slug}`,
      keywords: (n.tags ?? []).join(' '),
    })),
    {
      id: 'action-terminal',
      group: 'Actions',
      badge: '>_',
      title: 'Open the terminal',
      sub: 'Explore the site from a shell',
      href: '/terminal',
      keywords: 'shell cli command',
    },
    {
      id: 'action-resume',
      group: 'Actions',
      badge: '↓',
      title: 'View résumé',
      sub: 'One page, ATS-friendly',
      href: '/resume',
      keywords: 'cv resume pdf download',
    },
    {
      id: 'action-theme',
      group: 'Actions',
      badge: '◐',
      title: 'Switch theme',
      sub: 'Light or dark',
      action: 'theme',
      keywords: 'theme dark light mode',
    },
  ];
}

/** Items matching every word of the query, in group order. An empty query returns everything. */
export function filterIndex(items: SearchItem[], query: string): SearchItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = items.filter((item) => {
    const haystack = `${item.title} ${item.sub} ${item.keywords}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
  return GROUP_ORDER.flatMap((group) => hits.filter((item) => item.group === group));
}
