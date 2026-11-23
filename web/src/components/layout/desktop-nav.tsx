'use client';

import { AboutMenu } from './about-menu';
import { NavLink } from './nav-link';
import { TerminalNavLink } from './terminal-nav-link';

export function DesktopNav() {
  return (
    <>
      <NavLink href="/work">Work</NavLink>
      <AboutMenu />
      <NavLink href="/notes">Notes</NavLink>
      <NavLink href="/infrastructure">Infra</NavLink>
      <TerminalNavLink />
      <NavLink href="/contact">Contact</NavLink>
    </>
  );
}
