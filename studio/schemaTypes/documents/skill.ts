import { defineArrayMember, defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { WrenchIcon } from '@sanity/icons/Wrench';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { SKILL_GROUPS, SKILL_TIERS } from '../constants';

/** A tiered skill. No percentages or levels: the tier says how it has been used. */
export const skill = defineType({
  name: 'skill',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    ...reviewFields(),
    orderRankField({ type: 'skill' }),
    defineField({
      name: 'name',
      type: 'string',
      description: 'e.g. "React · TypeScript".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'group',
      type: 'string',
      description: 'The table section it appears in.',
      options: { list: SKILL_GROUPS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tier',
      type: 'string',
      description:
        'At work = used in production at a job. In projects = built something real. Learning = lab level.',
      options: { list: SKILL_TIERS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'usedIn',
      type: 'array',
      description: 'Projects, posts or roles where it is used, so the claim is traceable.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }, { type: 'note' }, { type: 'role' }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'usageNote',
      type: 'string',
      description: 'Plain-text context when there is nothing to link, e.g. "Daily".',
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'name', group: 'group', tier: 'tier' },
    prepare: ({ title, group, tier }) => ({
      title,
      subtitle: [
        SKILL_TIERS.find((t) => t.value === tier)?.title,
        SKILL_GROUPS.find((g) => g.value === group)?.title,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
