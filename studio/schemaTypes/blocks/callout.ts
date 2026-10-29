import { defineField, defineType } from 'sanity';
import { InfoOutlineIcon } from '@sanity/icons/InfoOutline';

export const callout = defineType({
  name: 'callout',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      options: {
        list: [
          { title: 'Note', value: 'note' },
          { title: 'Warning', value: 'warning' },
        ],
        layout: 'radio',
      },
      initialValue: 'note',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'Optional kicker, e.g. "Trade-off".',
    }),
    defineField({ name: 'text', type: 'text', rows: 3, validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'text' } },
});
