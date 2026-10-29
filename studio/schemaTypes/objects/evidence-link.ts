import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons/Link';

/** One evidence row. Both fields required: a row with no real link is never stored. */
export const evidenceLink = defineType({
  name: 'evidenceLink',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'e.g. "Repository", "README / docs", "Workflow run".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Full https:// link, or a site path such as /notes/my-note.',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'], allowRelative: true }),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
});
