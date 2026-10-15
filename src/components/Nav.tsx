import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nav, person } from '../content';
import { ThemeToggle } from './ThemeToggle';
import { MotionToggle } from './MotionToggle';
import { ArrowUpRight } from './Icons';

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Blur/hairline once the page leaves the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: mark the link whose section spans the upper third of the viewport.
  useEffect(() => {
    const triggers = nav.map(({ href }) =>
      ScrollTrigger.create({
        trigger: href,
        start: 'top 35%',
        end: 'bottom 35%',
        onToggle: (self) => setActive((cur) => (self.isActive ? href : cur === href ? null : cur)),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Close the mobile sheet on Escape, outside click, or navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector<HTMLButtonElement>('.nav__menu-btn')?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <nav ref={ref} className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`} aria-label="Primary">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label={`${person.name}, back to top`}>
          {person.name}
        </a>
        <div className="nav__right">
          <ul className="nav__links">
            {nav.map(({ label, href }) => (
              <li key={href}>
                <a className="nav__link" href={href} aria-current={active === href ? 'location' : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="nav__menu-btn"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
          <MotionToggle className="motion-toggle--nav" />
          <ThemeToggle />
        </div>
      </div>
      <div className="nav__sheet" id="nav-sheet">
        <ul className="container">
          {nav.map(({ label, href }) => (
            <li key={href}>
              <a href={href} tabIndex={open ? undefined : -1} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            </li>
          ))}
          <li className="nav__sheet-motion">
            <MotionToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
