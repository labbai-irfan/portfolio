import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons/Link';

/** Extra profile link beyond LinkedIn and GitHub (e.g. Mastodon, Dev.to). */
export const socialLink = defineType({
  name: 'socialLink',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'Shown as the link text, e.g. "Dev.to".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
});
