import { defineField, defineType } from 'sanity';
import { CodeIcon } from '@sanity/icons/Code';

export const codeBlock = defineType({
  name: 'codeBlock',
  type: 'object',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'filename',
      type: 'string',
      description: 'File path or source label, e.g. "c2/bin/c2" or "app container logs".',
    }),
    defineField({
      name: 'language',
      type: 'string',
      options: {
        list: [
          'bash',
          'shell',
          'yaml',
          'dockerfile',
          'typescript',
          'javascript',
          'json',
          'sql',
          'text',
        ],
      },
      initialValue: 'bash',
    }),
    defineField({
      name: 'code',
      type: 'text',
      rows: 10,
      description: 'Real code or output only, copied from the source.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'filename', subtitle: 'language' } },
});
