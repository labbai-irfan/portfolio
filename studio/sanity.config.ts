import { defineConfig } from 'sanity';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGLETON_TYPES } from './schemaTypes';
import { structure } from './structure';

// Where the website runs: the live site once deployed, localhost while developing.
const PREVIEW_ORIGIN = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000';

// Singletons can't be created again, duplicated or deleted from the Studio.
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'hl13utpc',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({ structure }),
    // Click any text on the live site to edit it. The site's draft-mode routes switch previews on.
    presentationTool({
      previewUrl: {
        initial: PREVIEW_ORIGIN,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: {
          project: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    { title: doc.title || 'Untitled', href: `/work/${doc.slug}` },
                    { title: 'All work', href: '/work' },
                  ]
                : [],
            }),
          }),
          note: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    { title: doc.title || 'Untitled', href: `/notes/${doc.slug}` },
                    { title: 'All notes', href: '/notes' },
                  ]
                : [],
            }),
          }),
          siteSettings: defineLocations({
            message: 'Used on every page.',
            locations: [{ title: 'Home', href: '/' }],
          }),
          homePage: defineLocations({ locations: [{ title: 'Home', href: '/' }] }),
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.includes(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : actions,
  },
});
