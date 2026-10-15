import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { links, person } from '../content';
import { useMotion } from '../lib/motion';
import { Magnetic } from './Magnetic';
import { StackStatic } from './StackStatic';
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const Stack3D = lazy(() => import('./Stack3D'));

/** Hero pin length while the stack explodes, as a fraction of the viewport.
 *  Must match PIN in Stack3D.tsx (not imported: that would pull the 3D chunk in). */
const PIN = 0.6;
/** Matches the .stack-static / .stack3d__fade crossfade duration in CSS. */
const CROSSFADE_MS = 300;

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** WebGL stack only at 768px+, with WebGL available and decent hardware. Under
 *  reduced motion it still renders, but as a still, lit scene. */
function canRender3D() {
  if (!window.matchMedia('(min-width: 768px)').matches) return false;
  if (new URLSearchParams(location.search).has('static')) return false;
  const nav = navigator as NavigatorHints;
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4 || nav.connection?.saveData) return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function Hero() {
  const [want3D, setWant3D] = useState(false);
  const [ready3D, setReady3D] = useState(false);
  const [staticGone, setStaticGone] = useState(false);
  const section = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  // The static stack is prerendered and paints instantly. The WebGL stack
  // (a separate lazy chunk) loads after first paint: once the page has loaded
  // and the main thread is idle, or sooner on the first pointer/scroll/key.
  useEffect(() => {
    if (!canRender3D()) return;
    const events = ['pointermove', 'wheel', 'keydown', 'touchstart'] as const;
    let idleId = 0;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener('load', schedule);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
    const go = () => {
      cleanup();
      setWant3D(true);
    };
    const schedule = () => {
      idleId =
        'requestIdleCallback' in window ? window.requestIdleCallback(go, { timeout: 1500 }) : (setTimeout(go, 600) as unknown as number);
    };
    events.forEach((e) => window.addEventListener(e, go, { passive: true }));
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return cleanup;
  }, []);

  const onReady = useCallback(() => setReady3D(true), []);

  // After the canvas has faded in over the static stack, take the static one out entirely.
  useEffect(() => {
    if (!ready3D) return;
    const id = setTimeout(() => setStaticGone(true), CROSSFADE_MS);
    return () => clearTimeout(id);
  }, [ready3D]);

  // Pin the hero (copy + stack together) for 60% of a viewport so the stack
  // stays in view while its layers separate. Full motion, 768px+, WebGL only.
  // Pinning the section rather than just .hero__visual keeps the layout
  // intact: pin spacing on a grid cell would re-centre the copy.
  useGSAP(
    () => {
      if (reduced || !canRender3D()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        ScrollTrigger.create({
          trigger: section.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * PIN}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={section} className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__name" id="hero-title">
            {person.name}
          </h1>
          <p className="hero__role">{person.roleLine}</p>
          <p className="hero__lead">{person.valueProp}</p>
          <div className="hero__ctas">
            <Magnetic href={`mailto:${links.email}`} className="btn--primary">
              <MailIcon />
              Email
            </Magnetic>
            <Magnetic href={links.github} target="_blank" rel="noreferrer">
              <GitHubIcon />
              GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </Magnetic>
            <Magnetic href={links.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon />
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </Magnetic>
          </div>
        </div>

        <div className="hero__visual">
          <StackStatic hidden={ready3D} gone={staticGone} />
          {want3D && (
            <Suspense fallback={null}>
              <Stack3D onReady={onReady} reduced={reduced} />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
}
