import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons/Image';

/** A diagram or screenshot. The text equivalent is required: every figure must be readable as text. */
export const figure = defineType({
  name: 'figure',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'Kicker, e.g. "Fig. 1 — How a command travels".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'textEquivalent',
      title: 'Text equivalent',
      type: 'text',
      rows: 3,
      description:
        'Required. Describe what the figure shows in words ("In words: …"). Shown as the caption and used as alt text.',
      validation: (rule) => rule.required().min(20),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'textEquivalent', media: 'image' } },
});
