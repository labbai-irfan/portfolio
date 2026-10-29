import { defineField, defineType } from 'sanity';

/** A label + value cell: home summary ("Targeting", "Now"), contact facts ("Roles", "Where"). */
export const labelledValue = defineType({
  name: 'labelledValue',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'value', type: 'string', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});
