import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { CONTENT_TAG } from '@/sanity/live';

/**
 * Sanity publish webhook. Live Content only refreshes the cache while someone has the site open;
 * this makes a publish refresh pages, sitemap, feed, search index and terminal data on its own.
 * The request must carry a valid signature for SANITY_REVALIDATE_SECRET; without the secret
 * configured the endpoint refuses everything.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Revalidation is not configured.' }, { status: 503 });
  }

  const { isValidSignature } = await parseBody(request, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });
  }

  // `expire: 0`: the next request after a publish is a fresh read, never stale content.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
