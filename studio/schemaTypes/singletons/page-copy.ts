import { defineField, defineType } from 'sanity';
import { reviewFields } from '../shared/review-fields';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { COPY_PAGES } from '../constants';

/** Heading and intro for every page. Home copy lives in Site settings → Hero. */
export const pageCopy = defineType({
  name: 'pageCopy',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    ...reviewFields(),
    ...COPY_PAGES.map(({ title, value }) => defineField({ name: value, title, type: 'pageIntro' })),
  ],
  preview: { prepare: () => ({ title: 'Page copy' }) },
});
