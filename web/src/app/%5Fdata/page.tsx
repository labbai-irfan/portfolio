import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  CREDENTIALS_QUERY,
  HOME_QUERY,
  INFRA_QUERY,
  MILESTONES_QUERY,
  NOTE_CATEGORIES_QUERY,
  NOTE_QUERY,
  NOTES_QUERY,
  PAGE_COPY_QUERY,
  PROJECT_QUERY,
  PROJECTS_QUERY,
  ROLES_QUERY,
  SETTINGS_QUERY,
  SITE_STATUS_QUERY,
  SKILLS_QUERY,
} from '@/sanity/queries';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';

// Dev-only data-layer check: fetches every query with its generated type and nothing cast to
// `any`. Confirms the Sanity client, defineLive and TypeGen are wired correctly end to end.
export const metadata: Metadata = { title: 'Data layer check', robots: { index: false } };

function Row({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <tr className="border-b border-rule">
      <td className="py-2 pr-4 font-mono text-13">{label}</td>
      <td className="py-2 pr-4 text-13">{ok ? '✅' : '❌ empty'}</td>
      <td className="py-2 text-13 text-muted">{detail}</td>
    </tr>
  );
}

async function CachedCheck({ perspective, stega }: DynamicFetchOptions) {
  'use cache';

  const [
    settings,
    pageCopy,
    home,
    status,
    projects,
    notes,
    categories,
    milestones,
    roles,
    skills,
    credentials,
    infra,
  ] = await Promise.all([
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: HOME_QUERY, perspective, stega }),
    cachedSanity({ query: SITE_STATUS_QUERY, perspective, stega }),
    cachedSanity({ query: PROJECTS_QUERY, perspective, stega }),
    cachedSanity({ query: NOTES_QUERY, perspective, stega }),
    cachedSanity({ query: NOTE_CATEGORIES_QUERY, perspective, stega }),
    cachedSanity({ query: MILESTONES_QUERY, perspective, stega }),
    cachedSanity({ query: ROLES_QUERY, perspective, stega }),
    cachedSanity({ query: SKILLS_QUERY, perspective, stega }),
    cachedSanity({ query: CREDENTIALS_QUERY, perspective, stega }),
    cachedSanity({ query: INFRA_QUERY, perspective, stega }),
  ]);

  const firstProjectSlug = projects.data[0]?.slug;
  const firstNoteSlug = notes.data[0]?.slug;
  const [project, note] = await Promise.all([
    firstProjectSlug
      ? cachedSanity({
          query: PROJECT_QUERY,
          params: { slug: firstProjectSlug },
          perspective,
          stega,
        })
      : null,
    firstNoteSlug
      ? cachedSanity({ query: NOTE_QUERY, params: { slug: firstNoteSlug }, perspective, stega })
      : null,
  ]);

  const rows: { label: string; ok: boolean; detail: string }[] = [
    { label: 'siteSettings', ok: Boolean(settings.data?.name), detail: settings.data?.name ?? '' },
    {
      label: 'pageCopy',
      ok: Boolean(pageCopy.data?.work?.heading),
      detail: pageCopy.data?.work?.heading ?? '',
    },
    {
      label: 'homePage',
      ok: Boolean(home.data?.home?.featuredProject),
      detail: home.data?.home?.featuredProject?.title ?? '',
    },
    {
      label: 'siteStatus',
      ok: true,
      detail: status.data?.status ?? 'not measured yet (empty is correct)',
    },
    {
      label: 'project (list)',
      ok: projects.data.length > 0,
      detail: `${projects.data.length} projects`,
    },
    {
      label: 'project (detail)',
      ok: Boolean(project?.data),
      detail: project?.data
        ? `${project.data.code} · ${project.data.sections?.length ?? 0} sections`
        : '',
    },
    { label: 'note (list)', ok: notes.data.length > 0, detail: `${notes.data.length} posts` },
    {
      label: 'note (detail)',
      ok: Boolean(note?.data),
      detail: note?.data
        ? `${note.data.code ?? note.data.title} · debug: ${Boolean(note.data.debugSteps)}`
        : '',
    },
    {
      label: 'noteCategory',
      ok: categories.data.length > 0,
      detail: `${categories.data.length} categories`,
    },
    {
      label: 'milestone',
      ok: milestones.data.length > 0,
      detail: `${milestones.data.length} milestones`,
    },
    { label: 'role', ok: roles.data.length > 0, detail: `${roles.data.length} roles` },
    { label: 'skill', ok: skills.data.length > 0, detail: `${skills.data.length} skills` },
    {
      label: 'credential',
      ok: true,
      detail: `${credentials.data.length} certifications (0 is the correct empty state)`,
    },
    { label: 'infraNode', ok: infra.data.length > 0, detail: `${infra.data.length} parts` },
  ];

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-rule-strong text-left font-mono text-11 tracking-label text-muted uppercase">
          <th className="py-2 pr-4">Query</th>
          <th className="py-2 pr-4">Typed data</th>
          <th className="py-2">Detail</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Row key={row.label} {...row} />
        ))}
      </tbody>
    </table>
  );
}

export default async function DataCheckPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  const dynamic = await getDynamicFetchOptions();
  return (
    <main id="main" className="mx-auto max-w-page p-8">
      <h1 className="mb-4 text-32 font-semibold">Data layer check</h1>
      <CachedCheck {...dynamic} />
    </main>
  );
}
