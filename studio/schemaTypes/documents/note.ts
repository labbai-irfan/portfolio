import { defineArrayMember, defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';

/** A blog post. Troubleshooting posts can use the optional four-step debug format. */
export const note = defineType({
  name: 'note',
  title: 'Blog post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'post', title: 'Post', default: true },
    { name: 'debug', title: 'Debug steps' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...reviewFields('post'),
    defineField({
      name: 'title',
      type: 'string',
      group: 'post',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'post',
      description: 'The page address: /notes/<slug>. Click Generate after typing the title.',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'post',
      to: [{ type: 'noteCategory' }],
      description: 'Troubleshooting, Write-up, Learning log, Tutorial… (edit the list under Blog).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      type: 'string',
      group: 'post',
      description: 'Optional short code shown on cards, e.g. N-01.',
      validation: (rule) => rule.regex(/^N-\d{2}$/, { name: 'note code (N-01)' }),
    }),
    defineField({
      name: 'date',
      title: 'Publish date',
      type: 'date',
      group: 'post',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      group: 'post',
      description: 'One or two sentences for the list, search and RSS.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({ name: 'coverImage', type: 'altImage', group: 'post' }),
    defineField({
      name: 'tags',
      type: 'array',
      group: 'post',
      description: 'Lower-case keywords, e.g. docker. Press Enter after each.',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'project',
      type: 'reference',
      group: 'post',
      to: [{ type: 'project' }],
      description: 'Optional. Links the post to the project it came from.',
    }),
    defineField({
      name: 'body',
      type: 'richText',
      group: 'post',
      description: 'The post. Add code blocks, figures and callouts with the + button.',
    }),
    defineField({
      name: 'debugSteps',
      title: 'Debug steps (optional)',
      type: 'debugSteps',
      group: 'debug',
      description: 'For troubleshooting posts: symptom → what I checked → root cause → fix.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: {
      code: 'code',
      title: 'title',
      date: 'date',
      category: 'category.title',
      media: 'coverImage',
    },
    prepare: ({ code, title, date, category, media }) => ({
      title: [code, title].filter(Boolean).join(' · '),
      subtitle: [category, date].filter(Boolean).join(' · '),
      media,
    }),
  },
});
