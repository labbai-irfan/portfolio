import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getSiteUrl } from '@/lib/site-url';
import { shareImages } from '@/lib/metadata';
import { NoteDetail } from '@/components/sections/note-detail';
import {
  cachedSanity,
  getDynamicFetchOptions,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/live';
import { NOTE_QUERY, NOTE_SLUGS_QUERY } from '@/sanity/queries';

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: NOTE_SLUGS_QUERY });
  return data.map(({ slug }) => ({ slug }));
}

async function getNote(slug: string, { perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const { data } = await cachedSanity({ query: NOTE_QUERY, params: { slug }, perspective, stega });
  return data;
}

export async function generateMetadata({ params }: PageProps<'/notes/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const { data: note } = await sanityFetchMetadata({
    query: NOTE_QUERY,
    params: { slug },
    perspective: 'published',
  });
  if (!note) return {};
  const description = note.seo?.description ?? note.summary;
  const title = note.seo?.title ?? note.title;
  return {
    title,
    description,
    alternates: getSiteUrl() ? { canonical: `/notes/${slug}` } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: note.date,
      tags: note.tags ?? undefined,
      images: shareImages(note.seo?.shareImage, note.coverImage),
    },
  };
}

export default function NotePage({ params }: PageProps<'/notes/[slug]'>) {
  // The slug is read inside Suspense: a route with a dynamic segment may not touch params while
  // its static shell is being built, and a cache refresh rebuilds that shell.
  return (
    <Suspense fallback={null}>
      <NoteContent params={params} />
    </Suspense>
  );
}

async function NoteContent({ params }: { params: PageProps<'/notes/[slug]'>['params'] }) {
  const { slug } = await params;
  const note = await getNote(slug, await getDynamicFetchOptions());
  // Outside the cache boundary, so a missing slug is a real 404.
  if (!note) notFound();
  return <NoteDetail note={note} />;
}
