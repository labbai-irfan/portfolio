// Seeds the dataset from seed/data.ts. Run with `npm run seed` (uses your Sanity CLI login).
// Safe to run repeatedly: a document is created only if none with the same natural key
// (or fixed singleton _id) exists as a draft or published. Existing documents are never patched,
// except that an infra part with no connections gets its seed connections.
import { randomUUID } from 'node:crypto';
import { getCliClient } from 'sanity/cli';
import { infraEdges, naturalKey, seedOrder, type SeedDoc } from './data';
import { oldContact } from './old-portfolio';

const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ perspective: 'raw' });
const ORDERED = new Set(['project', 'milestone', 'skill', 'infraNode']);
const ids = new Map<string, string>(); // `${type}:${key}` → published _id

const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
const rank = (i: number) => `0|${(100000 + i * 8).toString().padStart(6, '0')}:`;
const keyOf = (doc: SeedDoc) => {
  const path = naturalKey[doc._type];
  if (!path) return undefined;
  return path
    .split('.')
    .reduce<unknown>((v, k) => (v as Record<string, unknown>)?.[k], doc) as string;
};

/** Resolve ref placeholders and give every object in an array a _key. */
function prepare(value: unknown, inArray = false): unknown {
  if (Array.isArray(value)) return value.map((v) => prepare(v, true));
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('__ref' in obj) {
      const { type, key: k } = obj.__ref as { type: string; key: string };
      const id = ids.get(`${type}:${k}`);
      if (!id) throw new Error(`Seed reference not found: ${type} "${k}"`);
      return { _type: 'reference', _ref: id, ...(inArray ? { _key: key() } : {}) };
    }
    const out: Record<string, unknown> = inArray && !('_key' in obj) ? { _key: key() } : {};
    for (const [k, v] of Object.entries(obj)) out[k] = prepare(v);
    return out;
  }
  return value;
}

async function existingId(doc: SeedDoc): Promise<string | undefined> {
  if (doc._id) {
    const found = await client.fetch<string | null>('*[_id in [$id, "drafts." + $id]][0]._id', {
      id: doc._id,
    });
    return found ? doc._id : undefined;
  }
  const path = naturalKey[doc._type];
  const found = await client.fetch<string | null>(`*[_type == $type && ${path} == $value][0]._id`, {
    type: doc._type,
    value: keyOf(doc),
  });
  return found?.replace(/^drafts\./, '');
}

async function run() {
  let created = 0;
  let skipped = 0;

  for (const group of seedOrder) {
    for (const [i, doc] of group.entries()) {
      const label = `${doc._type} "${doc._id ?? keyOf(doc)}"`;
      const found = await existingId(doc);
      if (found) {
        if (!doc._id) ids.set(`${doc._type}:${keyOf(doc)}`, found);
        skipped++;
        console.log(`skip    ${label}`);
        continue;
      }
      const body = prepare(doc) as SeedDoc;
      if (ORDERED.has(doc._type)) body.orderRank = rank(i);
      const result = doc._id
        ? await client.createIfNotExists(body as SeedDoc & { _id: string })
        : await client.create(body);
      if (!doc._id) ids.set(`${doc._type}:${keyOf(doc)}`, result._id);
      created++;
      console.log(`create  ${label}`);
    }
  }

  // Infra connections need every node to exist first.
  const bySource = new Map<string, unknown[]>();
  for (const [from, to, label, type] of infraEdges) {
    const target = ids.get(`infraNode:${to}`);
    if (!target) throw new Error(`Infra part not found: ${to}`);
    bySource.set(from, [
      ...(bySource.get(from) ?? []),
      {
        _key: key(),
        _type: 'infraConnection',
        target: { _type: 'reference', _ref: target },
        label,
        type,
      },
    ]);
  }
  for (const [from, connections] of bySource) {
    const id = ids.get(`infraNode:${from}`)!;
    await client.patch(id).setIfMissing({ connections }).commit();
  }

  // Contact details from the previous portfolio. Written only into fields that are still empty,
  // so anything typed in the Studio is never overwritten.
  const contact = await client.fetch<{
    email: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    socials: unknown[] | null;
  } | null>('*[_id == "siteSettings"][0]{email, linkedinUrl, githubUrl, socials}');
  const fill: Record<string, unknown> = {};
  if (contact && !contact.email) fill.email = oldContact.email;
  if (contact && !contact.linkedinUrl) fill.linkedinUrl = oldContact.linkedinUrl;
  if (contact && !contact.githubUrl) fill.githubUrl = oldContact.githubUrl;
  if (contact && !contact.socials?.length) fill.socials = oldContact.socials;
  if (Object.keys(fill).length > 0) {
    await client.patch('siteSettings').set(fill).commit();
    console.log(`filled empty contact fields: ${Object.keys(fill).join(', ')}`);
  }

  console.log(`\nDone: ${created} created, ${skipped} already existed (left unchanged).`);
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
