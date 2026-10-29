import { createClient } from 'next-sanity';

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export const projectId = required(
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
export const dataset = required(
  'NEXT_PUBLIC_SANITY_DATASET',
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-10-01';
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? 'http://localhost:3333';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { studioUrl },
});
