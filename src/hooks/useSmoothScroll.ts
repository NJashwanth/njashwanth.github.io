import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, onMotionChange } from '../lib/motion';

let lenis: Lenis | null = null;

/** Scroll to an in-page target, through Lenis when it's running. */
export function scrollToHash(hash: string) {
  const target = hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const offset = hash === '#top' ? 0 : -parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) - 16;
  if (lenis) lenis.scrollTo(target, { offset });
  else target.scrollIntoView();
  // Move focus for keyboard and screen-reader users without a second jump.
  if (target !== document.body) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
}

/**
 * Lenis smooth scroll driven by GSAP's ticker (one loop, ScrollTrigger in
 * sync). Never instantiated when motion is reduced; follows the motion store live.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const update = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    };
    const stop = () => {
      if (!lenis) return;
      gsap.ticker.remove(update);
      lenis.destroy();
      lenis = null;
    };
    const sync = () => (isReducedMotion() ? stop() : start());
    sync();
    const unsubscribe = onMotionChange(sync);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      scrollToHash(a.getAttribute('href')!);
    };
    document.addEventListener('click', onClick);

    return () => {
      unsubscribe();
      document.removeEventListener('click', onClick);
      stop();
    };
  }, []);
}
