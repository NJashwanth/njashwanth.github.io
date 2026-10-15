import { useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience, type Role } from '../content';
import { uiSpring } from '../lib/spring';
import { isReducedMotion } from '../lib/motion';
import { SectionTitle } from './SectionTitle';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const startKey = (r: Role) => {
  const [m, y] = r.start.split(' ');
  return Number(y) * 12 + MONTHS.indexOf(m);
};
// Strictly newest to oldest by start date, whatever order content.ts uses.
const roles = [...experience].sort((a, b) => startKey(b) - startKey(a));

function Row({ role, defaultOpen }: { role: Role; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panel = useRef<HTMLDivElement>(null);
  const chevron = useRef<SVGSVGElement>(null);
  const id = useId();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    const el = panel.current!;
    if (isReducedMotion()) {
      const body = el.firstElementChild;
      gsap.set(chevron.current, { rotation: next ? 180 : 0 });
      if (next) {
        gsap.set(el, { height: 'auto' });
        gsap.fromTo(body, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none', overwrite: true });
        ScrollTrigger.refresh();
      } else {
        gsap.to(body, {
          opacity: 0,
          duration: 0.15,
          ease: 'none',
          overwrite: true,
          onComplete: () => {
            gsap.set(el, { height: 0 });
            gsap.set(body, { opacity: 1 });
            ScrollTrigger.refresh();
          },
        });
      }
      return;
    }
    gsap.to(chevron.current, { rotation: next ? 180 : 0, duration: uiSpring.duration, ease: uiSpring.ease });
    gsap.fromTo(
      el,
      { height: el.offsetHeight },
      {
        height: next ? 'auto' : 0,
        duration: 0.32,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => ScrollTrigger.refresh(),
      },
    );
    if (next) gsap.fromTo(el.firstElementChild, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.05 });
  };

  return (
    <li className={`xp${open ? ' is-open' : ''}`} data-reveal>
      <h3 className="xp__heading">
        <button type="button" className="xp__row" aria-expanded={open} aria-controls={id} onClick={toggle}>
          <span className="xp__company">{role.company}</span>
          <span className="xp__title">{role.title}</span>
          <span className="xp__dates">
            {role.start} – {role.end}
          </span>
          <svg ref={chevron} className="xp__chevron" viewBox="0 0 16 16" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined }}>
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </h3>
      <div className="xp__panel" id={id} ref={panel} style={{ height: open ? 'auto' : 0 }} inert={!open}>
        <div className="xp__body">
          <ul className="xp__bullets">
            {role.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <ul className="tags" aria-label="Tech">
            {role.tags.map((t) => (
              <li className="tag" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  return (
    <section className="section container" id="experience" aria-labelledby="experience-title">
      <SectionTitle id="experience-title" title="Experience">
        {roles.length} roles since {roles[roles.length - 1].start.split(' ')[1]}, newest first. Select a row for details.
      </SectionTitle>
      <ol className="xp-list">
        {roles.map((role, i) => (
          <Row key={role.company} role={role} defaultOpen={i === 0} />
        ))}
      </ol>
    </section>
  );
}
