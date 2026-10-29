import { defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { CalendarIcon } from '@sanity/icons/Calendar';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { MILESTONE_CATEGORIES } from '../constants';

export const milestone = defineType({
  name: 'milestone',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    ...reviewFields(),
    orderRankField({ type: 'milestone', newItemPosition: 'before' }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'What happened, in one line.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: MILESTONE_CATEGORIES, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'planned',
      type: 'boolean',
      description: 'Upcoming, not done yet. Shown under "Next".',
      initialValue: false,
    }),
    defineField({
      name: 'dateLabel',
      type: 'string',
      description:
        'Date as shown, e.g. "Apr 2026", "2023", "Next". Leave empty if the month is unknown.',
    }),
    defineField({
      name: 'sortDate',
      type: 'date',
      description:
        'Decides which year group it appears in. Not shown. Within a year, drag to reorder.',
      hidden: ({ document }) => Boolean(document?.planned),
      validation: (rule) =>
        rule.custom((value, context) =>
          value || (context.document as { planned?: boolean } | undefined)?.planned
            ? true
            : 'Required unless planned',
        ),
    }),
    defineField({
      name: 'latest',
      type: 'boolean',
      description: 'Marks the most recent milestone on the timeline. Only one can be latest.',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (latest, context) => {
          if (!latest) return true;
          const id = context.document?._id.replace(/^drafts\./, '');
          const count = await context
            .getClient({ apiVersion: '2026-10-01' })
            .fetch<number>(
              'count(*[_type == "milestone" && latest == true && !(_id in [$id, "drafts." + $id])])',
              { id },
            );
          return count === 0 || 'Another milestone is already marked latest';
        }),
    }),
    defineField({
      name: 'link',
      type: 'object',
      description: 'Optional. Link to a project, a blog post, or a page path.',
      fields: [
        defineField({ name: 'label', type: 'string', description: 'e.g. "Case study →".' }),
        defineField({
          name: 'reference',
          type: 'reference',
          to: [{ type: 'project' }, { type: 'note' }],
        }),
        defineField({
          name: 'path',
          type: 'string',
          description: 'Site path such as /experience, if not a project or post.',
          validation: (rule) => rule.regex(/^\/[\w\-/]*$/, { name: 'site path' }),
        }),
      ],
      validation: (rule) =>
        rule.custom((link) => {
          if (!link) return true;
          const { label, reference, path } = link as {
            label?: string;
            reference?: unknown;
            path?: string;
          };
          if (!label && !reference && !path) return true;
          if (!label) return 'Add a label';
          if (Boolean(reference) === Boolean(path)) return 'Choose either a reference or a path';
          return true;
        }),
    }),
  ],
  orderings: [
    orderRankOrdering,
    { title: 'Newest', name: 'sortDesc', by: [{ field: 'sortDate', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      dateLabel: 'dateLabel',
      sortDate: 'sortDate',
      category: 'category',
      planned: 'planned',
      latest: 'latest',
    },
    prepare: ({ title, dateLabel, sortDate, category, planned, latest }) => ({
      title,
      subtitle: [
        planned ? 'Planned' : (dateLabel ?? sortDate),
        MILESTONE_CATEGORIES.find((c) => c.value === category)?.title,
        latest && 'Latest',
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
