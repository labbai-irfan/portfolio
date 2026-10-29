import { defineArrayMember, defineField, defineType } from 'sanity';
import { SearchIcon } from '@sanity/icons/Search';

/** The four-step debugging format: symptom → what I checked → root cause → fix & prevention. */
export const debugSteps = defineType({
  name: 'debugSteps',
  type: 'object',
  icon: SearchIcon,
  fieldsets: [
    { name: 'summary', title: 'One-line summary (shown at the top)', options: { columns: 3 } },
  ],
  fields: [
    defineField({ name: 'symptomLine', title: 'Symptom', type: 'string', fieldset: 'summary' }),
    defineField({ name: 'causeLine', title: 'Cause', type: 'string', fieldset: 'summary' }),
    defineField({ name: 'fixLine', title: 'Fix', type: 'string', fieldset: 'summary' }),

    defineField({
      name: 'symptom',
      title: '1 · Symptom',
      type: 'text',
      rows: 3,
      description: 'What you were trying to do, and what happened instead.',
    }),
    defineField({
      name: 'errorLog',
      title: 'Error log',
      type: 'codeBlock',
      description: 'The exact error line(s), pasted from the real log.',
    }),
    defineField({
      name: 'checks',
      title: '2 · What I checked (in order)',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'check',
          type: 'object',
          fields: [
            defineField({
              name: 'command',
              type: 'string',
              description: 'The command you ran.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'result',
              type: 'string',
              description: 'What it showed.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'outcome',
              type: 'string',
              options: {
                list: [
                  { title: 'Ruled out', value: 'ruledOut' },
                  { title: 'Found it', value: 'foundIt' },
                ],
                layout: 'radio',
              },
              initialValue: 'ruledOut',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'command', subtitle: 'outcome' } },
        }),
      ],
    }),
    defineField({
      name: 'rootCause',
      title: '3 · Root cause',
      type: 'text',
      rows: 3,
      description: 'What was actually wrong, and why the symptom pointed elsewhere at first.',
    }),
    defineField({
      name: 'explanation',
      type: 'string',
      description: 'The one-sentence explanation you would give a teammate.',
    }),
    defineField({
      name: 'fix',
      title: '4 · Fix',
      type: 'object',
      fields: [
        defineField({ name: 'before', type: 'text', rows: 3 }),
        defineField({ name: 'after', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'verification',
      type: 'text',
      rows: 2,
      description: 'How you confirmed it worked.',
    }),
    defineField({
      name: 'prevention',
      title: "Next time, I'd catch it by",
      type: 'string',
      description: 'A check, a habit, or an automation.',
    }),
  ],
});
