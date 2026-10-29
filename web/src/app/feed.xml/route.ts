import { absoluteUrl } from '@/lib/site-url';
import { sanityFetchMetadata } from '@/sanity/live';
import { FEED_QUERY, SETTINGS_QUERY } from '@/sanity/queries';

const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

/** RSS 2.0 feed of the notes. Needs the site's domain: without one there are no valid item links. */
export async function GET() {
  const home = absoluteUrl('/');
  if (!home)
    return new Response('Feed unavailable: the site domain is not configured.', { status: 404 });

  const [{ data: notes }, { data: settings }] = await Promise.all([
    sanityFetchMetadata({ query: FEED_QUERY, perspective: 'published' }),
    sanityFetchMetadata({ query: SETTINGS_QUERY, perspective: 'published' }),
  ]);

  const items = notes
    .map((note) => {
      const link = absoluteUrl(`/notes/${note.slug}`) ?? home;
      return [
        '    <item>',
        `      <title>${escape(note.title)}</title>`,
        `      <link>${escape(link)}</link>`,
        `      <guid isPermaLink="true">${escape(link)}</guid>`,
        `      <pubDate>${new Date(`${note.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        note.category ? `      <category>${escape(note.category)}</category>` : null,
        `      <description>${escape(note.summary)}</description>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escape(settings?.name ?? 'Notes')} — Notes</title>`,
    `    <link>${escape(home)}</link>`,
    `    <atom:link href="${escape(absoluteUrl('/feed.xml') ?? home)}" rel="self" type="application/rss+xml" />`,
    `    <description>${escape(settings?.heroLine ?? 'Notes')}</description>`,
    '    <language>en</language>',
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
