import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getSiteUrl } from '@/lib/site-url';
import { shareImages } from '@/lib/metadata';
import { ProjectDetail } from '@/components/sections/project-detail';
import {
  cachedSanity,
  getDynamicFetchOptions,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/live';
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from '@/sanity/queries';

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: PROJECT_SLUGS_QUERY });
  return data.map(({ slug }) => ({ slug }));
}

async function getProject(slug: string, { perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const { data } = await cachedSanity({
    query: PROJECT_QUERY,
    params: { slug },
    perspective,
    stega,
  });
  return data;
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await sanityFetchMetadata({
    query: PROJECT_QUERY,
    params: { slug },
    perspective: 'published',
  });
  if (!project) return {};
  const description = project.seo?.description ?? project.summary;
  const title = project.seo?.title ?? project.title;
  return {
    title,
    description,
    alternates: getSiteUrl() ? { canonical: `/work/${slug}` } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      images: shareImages(project.seo?.shareImage, project.coverImage),
    },
  };
}

export default function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  // The slug is read inside Suspense: a route with a dynamic segment may not touch params while
  // its static shell is being built, and a cache refresh rebuilds that shell.
  return (
    <Suspense fallback={null}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: PageProps<'/work/[slug]'>['params'] }) {
  const { slug } = await params;
  const project = await getProject(slug, await getDynamicFetchOptions());
  // Outside the cache boundary, so a missing slug is a real 404.
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
