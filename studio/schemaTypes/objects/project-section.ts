import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';

/** A numbered section of a project page ("Problem & goals", "Architecture", …). */
export const projectSection = defineType({
  name: 'projectSection',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'navLabel',
      title: 'Short label for "On this page"',
      type: 'string',
      description: 'Optional. Falls back to the heading.',
    }),
    defineField({ name: 'body', type: 'richText' }),
  ],
  preview: { select: { title: 'heading' } },
});
