import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons/Image';

/** Image with hotspot and required alt text. Use for every content image. */
export const altImage = defineType({
  name: 'altImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for people who can’t see it. Required.',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as { asset?: unknown } | undefined;
          return !parent?.asset || Boolean(alt?.trim()) || 'Alt text is required';
        }),
    }),
  ],
});
