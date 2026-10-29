import { defineField, defineType } from 'sanity';

/** Heading + intro shown at the top of a page. */
export const pageIntro = defineType({
  name: 'pageIntro',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'The large page heading.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      type: 'text',
      rows: 3,
      description: 'One or two sentences under the heading. Leave empty to hide.',
    }),
  ],
  preview: { select: { title: 'heading', subtitle: 'intro' } },
});
