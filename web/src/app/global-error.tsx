'use client';

import '@/styles/globals.css';

/**
 * Last-resort boundary for errors in the root layout itself, where the normal header, footer and
 * fonts are gone. It must render its own <html> and <body>, and uses only the token stylesheet.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col items-start justify-center gap-5 px-6 py-16">
        <h1 className="m-0 text-48 leading-none font-semibold">Something went wrong.</h1>
        <p className="m-0 max-w-140 text-17 leading-[1.6] text-body">
          The site couldn’t load. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="min-h-13 cursor-pointer bg-signal px-6 text-15 font-medium text-on-signal"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
