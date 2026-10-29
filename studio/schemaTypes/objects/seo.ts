import { defineField, defineType } from 'sanity';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Overrides the page title in search results.',
      validation: (rule) =>
        rule.max(70).warning('Search engines cut titles near 60–70 characters.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Search and share description. Falls back to the site default.',
      validation: (rule) => rule.max(160).warning('Keep it under 160 characters.'),
    }),
    defineField({
      name: 'shareImage',
      type: 'altImage',
      description: 'Image for social shares (1200×630 works best). Falls back to the default card.',
    }),
  ],
});
