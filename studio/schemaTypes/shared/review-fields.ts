import { defineField } from 'sanity';

/**
 * Editorial flag for drafted text that only the owner can verify.
 * Listed under "Needs review" in the Studio. Never queried by the website.
 */
export function reviewFields(group?: string) {
  return [
    defineField({
      name: 'needsReview',
      title: 'Needs review',
      type: 'boolean',
      group,
      description:
        'On = this contains drafted text you still need to check. Switch off once it is accurate. Never shown on the site.',
      initialValue: false,
    }),
    defineField({
      name: 'reviewNote',
      title: 'What to check',
      type: 'text',
      rows: 2,
      group,
      hidden: ({ document }) => !document?.needsReview,
    }),
  ];
}
