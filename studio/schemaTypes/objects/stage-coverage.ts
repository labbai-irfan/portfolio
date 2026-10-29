import { defineField, defineType } from 'sanity';
import { NumberIcon } from '@sanity/icons/Number';
import { COVERAGE_STATES, STAGES } from '../constants';

/** Which delivery stages a project really covers. Defaults to "none". */
export const stageCoverage = defineType({
  name: 'stageCoverage',
  type: 'object',
  icon: NumberIcon,
  options: { columns: 3 },
  fields: STAGES.map((stage) =>
    defineField({
      name: stage,
      type: 'string',
      options: { list: COVERAGE_STATES, layout: 'dropdown' },
      initialValue: 'none',
      validation: (rule) => rule.required(),
    }),
  ),
});
