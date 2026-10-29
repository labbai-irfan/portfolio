import { Geist, Geist_Mono } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { Search } from '@/components/search/search';
import { siteMetadata } from '@/lib/metadata';
import { getDynamicFetchOptions, SanityLive } from '@/sanity/live';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Site-wide defaults come from siteSettings; each route adds its own title and description.
export const generateMetadata = siteMetadata;

// Runs synchronously while the browser parses <head>, before first paint (see Next's
// "preventing flash before hydration" guide). Without a stored choice, the OS preference
// already applies via the @media rule in globals.css with zero JS; this only handles the
// case where a *stored* choice disagrees with the OS preference. The resulting data-theme
// mismatch against the server-rendered <html> is expected — see suppressHydrationWarning
// below and the matching re-apply in ThemeToggle (dev-only Strict Mode remount).
const THEME_INIT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const { isEnabled: isDraftMode } = await draftMode();
  const dynamic = await getDynamicFetchOptions();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only bg-signal px-4 py-3 text-14 font-semibold text-on-signal focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 print:hidden"
        >
          Skip to content
        </a>
        <SiteHeader {...dynamic} />
        {children}
        <SiteFooter {...dynamic} />
        <Search {...dynamic} />
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
