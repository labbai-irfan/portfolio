import { defineArrayMember, defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { CubeIcon } from '@sanity/icons/Cube';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { INFRA_CATEGORIES } from '../constants';

/** One box in the infrastructure topology. Connections are stored on the source node. */
export const infraNode = defineType({
  name: 'infraNode',
  title: 'Infrastructure part',
  type: 'document',
  icon: CubeIcon,
  fields: [
    ...reviewFields(),
    orderRankField({ type: 'infraNode' }),
    defineField({
      name: 'kicker',
      type: 'string',
      description: 'Small label above the name, e.g. "CI", "HOSTING".',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'name', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'sub',
      title: 'Sub-label',
      type: 'string',
      description: 'e.g. "check · build · audit". Leave empty if unknown.',
    }),
    defineField({
      name: 'category',
      type: 'string',
      description: 'Sets the box style in the diagram.',
      options: { list: INFRA_CATEGORIES, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'state',
      type: 'string',
      description: 'Planned parts are drawn dashed, in the lower row.',
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Planned', value: 'planned' },
        ],
        layout: 'radio',
      },
      initialValue: 'live',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'text',
      rows: 2,
      description: 'What this part does. Shown in the detail panel and the text equivalent.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'connections',
      type: 'array',
      description: 'Arrows from this part to others.',
      of: [defineArrayMember({ type: 'infraConnection' })],
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'name', kicker: 'kicker', state: 'state' },
    prepare: ({ title, kicker, state }) => ({
      title,
      subtitle: [kicker, state === 'planned' && 'Planned'].filter(Boolean).join(' · '),
    }),
  },
});
