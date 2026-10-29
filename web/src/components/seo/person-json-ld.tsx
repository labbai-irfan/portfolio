import { absoluteUrl } from '@/lib/site-url';
import { sanityFetchMetadata } from '@/sanity/live';
import { SETTINGS_QUERY } from '@/sanity/queries';

/**
 * schema.org Person for the home page. Built only from published settings, without stega markers;
 * a field that isn't set is left out, never guessed (no email, links or job title unless given).
 */
export async function PersonJsonLd() {
  const { data: settings } = await sanityFetchMetadata({
    query: SETTINGS_QUERY,
    perspective: 'published',
  });
  if (!settings?.name) return null;

  const sameAs = [
    settings.linkedinUrl,
    settings.githubUrl,
    ...(settings.socials ?? []).map((s) => s.url),
  ].filter(Boolean);

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.name,
    description: settings.heroLine || undefined,
    url: absoluteUrl('/') ?? undefined,
    email: settings.email ? `mailto:${settings.email}` : undefined,
    address: settings.location
      ? { '@type': 'PostalAddress', addressLocality: settings.location }
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  // `<` is escaped so no field value can close the script tag.
  const json = JSON.stringify(person).replaceAll('<', '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
