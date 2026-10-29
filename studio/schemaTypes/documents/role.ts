import { defineArrayMember, defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { CaseIcon } from '@sanity/icons/Case';
import { ROLE_KINDS } from '../constants';

/** A job, internship, or course of study. Shown on Experience and Résumé. */
export const role = defineType({
  name: 'role',
  type: 'document',
  icon: CaseIcon,
  fields: [
    ...reviewFields(),
    defineField({
      name: 'kind',
      type: 'string',
      options: { list: ROLE_KINDS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'Job title, or degree for education.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organisation',
      type: 'string',
      description: 'Company or institution.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'location', type: 'string' }),
    defineField({
      name: 'startDate',
      type: 'date',
      options: { dateFormat: 'MMM YYYY' },
      description: 'Use the 1st of the month; only month and year are shown.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      options: { dateFormat: 'MMM YYYY' },
      description: 'Leave empty if current / in progress.',
      validation: (rule) =>
        rule.custom((end, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate;
          return !end || !start || end >= start || 'End must be after start';
        }),
    }),
    defineField({
      name: 'yearsOnly',
      type: 'boolean',
      description: 'Show dates as years only (e.g. 2023 — 2026).',
      initialValue: false,
    }),
    defineField({
      name: 'context',
      type: 'text',
      rows: 3,
      description: 'What the organisation does and where you fit.',
    }),
    defineField({
      name: 'highlights',
      title: 'What I built / worked on',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'alsoInRole', title: 'Also in the role', type: 'text', rows: 2 }),
    defineField({
      name: 'stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'infrastructureNote',
      title: 'Where this meets infrastructure',
      type: 'text',
      rows: 2,
    }),
  ],
  orderings: [
    { title: 'Newest', name: 'startDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      organisation: 'organisation',
      kind: 'kind',
      start: 'startDate',
      end: 'endDate',
    },
    prepare: ({ title, organisation, kind, start, end }) => ({
      title,
      subtitle: [
        ROLE_KINDS.find((k) => k.value === kind)?.title,
        organisation,
        start && `${start.slice(0, 7)} → ${end ? end.slice(0, 7) : 'now'}`,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
