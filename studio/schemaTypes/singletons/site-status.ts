import { defineField, defineType } from 'sanity';
import { ActivityIcon } from '@sanity/icons/Activity';

/**
 * Written only by the uptime GitHub Actions workflow. Read-only in the Studio.
 * Empty = "not measured yet" on the site.
 */
export const siteStatus = defineType({
  name: 'siteStatus',
  type: 'document',
  icon: ActivityIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Up', value: 'up' },
          { title: 'Down', value: 'down' },
        ],
      },
    }),
    defineField({ name: 'checkedAt', type: 'datetime' }),
    defineField({
      name: 'uptime',
      type: 'number',
      description: 'Percentage from real checks, written by the workflow.',
      validation: (rule) => rule.min(0).max(100),
    }),
  ],
  preview: {
    select: { status: 'status', checkedAt: 'checkedAt' },
    prepare: ({ status, checkedAt }) => ({
      title: 'Site status',
      subtitle: status ? `${status} · ${checkedAt ?? ''}` : 'Not measured yet',
    }),
  },
});
