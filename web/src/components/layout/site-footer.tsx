import { getBuildInfo } from '@/lib/build-info';
import { FooterGroup } from './footer-group';
import { FooterLink } from './footer-link';
import { cachedSanity, type DynamicFetchOptions } from '@/sanity/live';
import { FOOTER_PROJECTS_QUERY, SETTINGS_QUERY } from '@/sanity/queries';

export async function SiteFooter({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: settings }, { data: projects }] = await Promise.all([
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
    cachedSanity({ query: FOOTER_PROJECTS_QUERY, perspective, stega }),
  ]);

  const { shortSha, builtLabel: builtAt } = getBuildInfo();
  const year = new Date().getFullYear();
  const contactLinks = [
    settings?.email && { href: `mailto:${settings.email}`, label: 'Email' },
    settings?.linkedinUrl && { href: settings.linkedinUrl, label: 'LinkedIn ↗' },
    settings?.githubUrl && { href: settings.githubUrl, label: 'GitHub ↗' },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <footer className="border-t border-rule-strong bg-surface print:hidden">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-page flex-wrap gap-10 px-10 py-14">
          <div className="flex min-w-70 flex-[1.4] flex-col gap-3.5">
            <span className="flex items-center gap-3">
              <span className="relative flex size-8.5 items-center justify-center bg-contrast font-mono text-13 font-semibold text-on-contrast">
                IN
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -bottom-1 size-2.5 bg-signal"
                />
              </span>
              <span className="text-16 font-semibold">{settings?.name}</span>
            </span>
            {settings?.footerTagline && (
              <p className="m-0 max-w-80 text-14 leading-[1.6] text-body">
                {settings.footerTagline}
              </p>
            )}
          </div>

          <nav aria-label="Site map" className="flex flex-[3] flex-wrap gap-8">
            <FooterGroup title="Work">
              <FooterLink href="/work">All projects</FooterLink>
              {projects.map((project) => (
                <FooterLink key={project.slug} href={`/work/${project.slug}`}>
                  {project.title}
                </FooterLink>
              ))}
            </FooterGroup>
            <FooterGroup title="About">
              <FooterLink href="/experience">Experience</FooterLink>
              <FooterLink href="/skills">Skills</FooterLink>
              <FooterLink href="/journey">Journey</FooterLink>
              <FooterLink href="/resume">Résumé</FooterLink>
            </FooterGroup>
            <FooterGroup title="Engineering">
              <FooterLink href="/notes">How I debug</FooterLink>
              <FooterLink href="/infrastructure">Infrastructure</FooterLink>
              <FooterLink href="/terminal">Terminal</FooterLink>
            </FooterGroup>
            {contactLinks.length > 0 && (
              <FooterGroup title="Elsewhere">
                {contactLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterGroup>
            )}
          </nav>
        </div>
        <div className="border-t border-rule font-mono text-12">
          <div className="mx-auto flex max-w-page flex-wrap">
            {shortSha && (
              <div className="flex flex-1 basis-40 gap-2.5 border-r border-rule px-10 py-4.5 first:pl-10">
                <span className="text-muted">Commit</span>
                <span>{shortSha}</span>
              </div>
            )}
            {builtAt && (
              <div className="flex flex-1 basis-40 gap-2.5 border-r border-rule px-4.5 py-4.5">
                <span className="text-muted">Built</span>
                <span>{builtAt}</span>
              </div>
            )}
            <div className="flex flex-1 basis-50 gap-2.5 border-r border-rule px-4.5 py-4.5">
              <span className="text-muted">Stack</span>
              <span>next.js · sanity · vercel</span>
            </div>
            <div className="flex flex-1 basis-50 py-4.5 pr-10 pl-4.5 text-muted">
              © {year} {settings?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="flex flex-col gap-4.5 px-4 py-6 lg:hidden">
        <nav aria-label="Site map" className="flex flex-wrap gap-x-6 gap-y-2">
          <FooterGroup title="Work">
            <FooterLink href="/work">All projects</FooterLink>
            <FooterLink href="/notes">How I debug</FooterLink>
            <FooterLink href="/infrastructure">Infrastructure</FooterLink>
          </FooterGroup>
          <FooterGroup title="About">
            <FooterLink href="/experience">Experience</FooterLink>
            <FooterLink href="/journey">Journey</FooterLink>
            <FooterLink href="/resume">Résumé</FooterLink>
          </FooterGroup>
        </nav>
        <p className="m-0 border-t border-rule pt-3.5 font-mono text-11 text-muted">
          {[shortSha && `Commit ${shortSha}`, builtAt && `Built ${builtAt}`, `© ${year}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </footer>
  );
}
