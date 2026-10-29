import { defineArrayMember, defineField, defineType } from 'sanity';

/** Portable Text used by project bodies, sections and notes. */
export const richText = defineType({
  name: 'richText',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'codeBlock' }),
    defineArrayMember({ type: 'figure' }),
    defineArrayMember({ type: 'callout' }),
  ],
});
