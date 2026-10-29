'use client';

import { AboutMenu } from './about-menu';
import { NavLink } from './nav-link';

export function DesktopNav() {
  return (
    <>
      <NavLink href="/work">Work</NavLink>
      <AboutMenu />
      <NavLink href="/notes">Notes</NavLink>
      <NavLink href="/infrastructure">Infra</NavLink>
      <NavLink href="/terminal">
        <span className="font-mono text-12 text-signal">&gt;_</span>Terminal
      </NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </>
  );
}
