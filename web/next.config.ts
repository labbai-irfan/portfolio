import type { NextConfig } from 'next';
import { sanity } from 'next-sanity/live/cache-life';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  partialPrefetching: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  turbopack: {
    // web/ is the app root; the repo root only holds tooling (its lockfile confuses inference).
    root: __dirname,
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  env: {
    // Baked in at build time from CI/Vercel; see src/lib/build-info.ts.
    BUILD_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA,
    BUILD_TIME: new Date().toISOString(),
    BUILD_RUN_URL:
      process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : undefined,
  },
};

export default nextConfig;
