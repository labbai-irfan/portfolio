import { defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle';

/** A certification. Only add one that can be verified: the verify URL is required. */
export const credential = defineType({
  name: 'credential',
  title: 'Certification',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    ...reviewFields(),
    defineField({
      name: 'name',
      type: 'string',
      description: 'e.g. "AWS Certified Cloud Practitioner".',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'issuer', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'issued',
      title: 'Issue date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'credentialId', title: 'Credential ID', type: 'string' }),
    defineField({
      name: 'verifyUrl',
      title: 'Verify URL',
      type: 'url',
      description: 'The issuer’s public verification page. Required.',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({ name: 'badge', title: 'Badge image', type: 'altImage' }),
  ],
  orderings: [
    { title: 'Newest', name: 'issuedDesc', by: [{ field: 'issued', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', issuer: 'issuer', issued: 'issued', media: 'badge' },
    prepare: ({ title, issuer, issued, media }) => ({
      title,
      subtitle: [issuer, issued].filter(Boolean).join(' · '),
      media,
    }),
  },
});
