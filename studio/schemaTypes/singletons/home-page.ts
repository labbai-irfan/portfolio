import { defineArrayMember, defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons/Home';
import { HOME_SECTIONS } from '../constants';

export const homePage = defineType({
  name: 'homePage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'featuredProject',
      title: 'Flagship project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'The large card at the top of the Work section.',
    }),
    defineField({
      name: 'sections',
      type: 'array',
      description: 'Drag to change the order. Switch "Visible" off to hide a section.',
      of: [defineArrayMember({ type: 'homeSection' })],
      initialValue: HOME_SECTIONS.map(({ value }) => ({
        _type: 'homeSection',
        section: value,
        visible: true,
      })),
      validation: (rule) =>
        rule.custom((items) => {
          const keys = (items as { section?: string }[] | undefined)?.map((i) => i.section) ?? [];
          return new Set(keys).size === keys.length || 'Each section can appear only once';
        }),
    }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
});
