import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useMotion } from './lib/motion';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { OpenSource } from './components/OpenSource';
import { Work } from './components/Work';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

/**
 * Below-the-fold reveals, starting at "top 90%".
 *   Full:    section headings split into words that rise out of a line mask
 *            (SplitText); other content fades up 12px over 0.4s.
 *   Reduced: everything fades in over 0.3s, opacity only. No SplitText.
 * Anything already on screen (or scrolled past) shows immediately, so a
 * section is never left blank. The hero is never hidden: it renders instantly.
 */
function useReveals() {
  const { reduced } = useMotion();
  useGSAP(
    () => {
      const limit = window.innerHeight * 0.9;
      const below = (el: Element) => el.getBoundingClientRect().top > limit;
      const all = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter(below);
      const headings = reduced ? [] : all.filter((el) => el.matches('.section__title, .contact__headline'));
      const rest = all.filter((el) => !headings.includes(el));

      const show = (els: Element[]) =>
        gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0.3 : 0.4,
          ease: reduced ? 'none' : 'power2.out',
          stagger: reduced ? 0 : 0.05,
          overwrite: true,
        });
      gsap.set(rest, { autoAlpha: 0, y: reduced ? 0 : 12 });
      ScrollTrigger.batch(rest, { start: 'top 90%', once: true, onEnter: show, onLeave: show });

      headings.forEach((el) => {
        SplitText.create(el, {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            }),
        });
      });

      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
}

export function App() {
  useSmoothScroll();
  useReveals();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <OpenSource />
        <Experience />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
