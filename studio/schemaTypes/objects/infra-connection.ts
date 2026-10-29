import { defineField, defineType } from 'sanity';
import { CONNECTION_TYPES } from '../constants';

/** An outgoing edge in the infrastructure topology. */
export const infraConnection = defineType({
  name: 'infraConnection',
  type: 'object',
  fields: [
    defineField({
      name: 'target',
      type: 'reference',
      to: [{ type: 'infraNode' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'e.g. "git push", "deploys on pass".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: { list: CONNECTION_TYPES, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'target.name' } },
});
