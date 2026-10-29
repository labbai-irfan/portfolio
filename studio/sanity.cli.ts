import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'hl13utpc',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    // Queries live in the web app; types are written there too.
    path: '../web/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/src/sanity/types.ts',
    overloadClientMethods: true,
  },
});
