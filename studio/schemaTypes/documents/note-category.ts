import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons/Tag';

export const noteCategory = defineType({
  name: 'noteCategory',
  title: 'Blog category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. Troubleshooting, Write-up, Learning log, Tutorial.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Used in filter links. Click Generate.',
      options: { source: 'title', maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
