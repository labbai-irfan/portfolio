import { defineField, defineType } from 'sanity';
import { HOME_SECTIONS } from '../constants';

/** One Home section. Drag to reorder; switch off to hide. */
export const homeSection = defineType({
  name: 'homeSection',
  type: 'object',
  fields: [
    defineField({
      name: 'section',
      type: 'string',
      options: { list: HOME_SECTIONS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visible',
      type: 'boolean',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { section: 'section', visible: 'visible' },
    prepare: ({ section, visible }) => ({
      title: HOME_SECTIONS.find((s) => s.value === section)?.title ?? section,
      subtitle: visible ? 'Shown' : 'Hidden',
    }),
  },
});
