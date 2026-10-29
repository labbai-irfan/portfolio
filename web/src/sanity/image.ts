import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from './client';

const builder = createImageUrlBuilder({ projectId, dataset });

/** Image URL builder; respects the editor's hotspot and crop. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format');
}
