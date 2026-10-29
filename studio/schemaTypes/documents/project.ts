import { defineArrayMember, defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { RocketIcon } from '@sanity/icons/Rocket';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { PROJECT_LAYOUTS, PROJECT_STATUSES } from '../constants';

export const project = defineType({
  name: 'project',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'evidence', title: 'Evidence' },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...reviewFields('overview'),
    orderRankField({ type: 'project' }),
    defineField({
      name: 'title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'overview',
      description: 'The page address: /work/<slug>. Click Generate after typing the title.',
      options: { source: 'title', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      type: 'string',
      group: 'overview',
      description: 'Project code shown on cards, e.g. P-01.',
      validation: (rule) => rule.required().regex(/^P-\d{2}$/, { name: 'project code (P-01)' }),
    }),
    defineField({
      name: 'status',
      type: 'string',
      group: 'overview',
      description: 'Labs stay "Learning lab"; anything not built yet stays "Planned".',
      options: { list: PROJECT_STATUSES, layout: 'radio' },
      initialValue: 'inDevelopment',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Show on Home',
      type: 'boolean',
      group: 'overview',
      description:
        'Adds this project to the Work section on the Home page. The large flagship card is chosen in Home.',
      initialValue: false,
    }),
    defineField({
      name: 'layout',
      type: 'string',
      group: 'overview',
      description:
        'Detail page layout: Case study (a project write-up), Pipeline (this site), Lab (a learning lab).',
      options: { list: PROJECT_LAYOUTS, layout: 'radio' },
      initialValue: 'caseStudy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      group: 'overview',
      description: 'One sentence for cards and lists.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'recruiterSummary',
      type: 'text',
      rows: 3,
      group: 'overview',
      description: 'The 60-second version at the top of the detail page. Facts only.',
    }),
    defineField({
      name: 'coverImage',
      type: 'altImage',
      group: 'overview',
      description: 'Optional. Shown on the card and at the top of the page.',
    }),
    defineField({
      name: 'tools',
      type: 'array',
      group: 'overview',
      description: 'Tools actually used, e.g. Bash, Docker. Press Enter after each.',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      group: 'overview',
      description: 'Your role, e.g. "Solo".',
    }),
    defineField({
      name: 'started',
      type: 'string',
      group: 'overview',
      description: 'Month as you want it shown, e.g. "Mar 2026". Leave empty if unsure.',
    }),
    defineField({
      name: 'stageCoverage',
      type: 'stageCoverage',
      group: 'overview',
      description: 'Which delivery stages this project really covers.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'evidence',
      type: 'array',
      group: 'evidence',
      description: 'Only real links (repository, docs, workflow run). Each needs a URL.',
      of: [defineArrayMember({ type: 'evidenceLink' })],
    }),
    defineField({
      name: 'body',
      title: 'Introduction',
      type: 'richText',
      group: 'content',
      description: 'Optional text before the numbered sections.',
    }),
    defineField({
      name: 'sections',
      type: 'array',
      group: 'content',
      description: 'Numbered sections, in order (e.g. Problem & goals, Architecture).',
      of: [defineArrayMember({ type: 'projectSection' })],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      code: 'code',
      title: 'title',
      status: 'status',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare: ({ code, title, status, featured, media }) => ({
      title: [code, title].filter(Boolean).join(' · '),
      subtitle: [PROJECT_STATUSES.find((s) => s.value === status)?.title, featured && 'On Home']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
});
