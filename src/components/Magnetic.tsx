import { useRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { uiSpring } from '../lib/spring';
import { useMotion } from '../lib/motion';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; strength?: number };

/**
 * An anchor that leans toward the cursor. Only on fine pointers with motion
 * allowed; transforms only, driven by quickTo so it stays on the compositor.
 */
export function Magnetic({ children, strength = 0.3, className = '', ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const el = ref.current!;
        const inner = el.querySelector<HTMLElement>('.btn__inner')!;
        // Spring ease: the button follows with a little overshoot and settles on release.
        const opts = { duration: uiSpring.duration, ease: uiSpring.ease };
        const x = gsap.quickTo(el, 'x', opts);
        const y = gsap.quickTo(el, 'y', opts);
        const ix = gsap.quickTo(inner, 'x', opts);
        const iy = gsap.quickTo(inner, 'y', opts);

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          x(dx * strength);
          y(dy * strength);
          ix(dx * strength * 0.4);
          iy(dy * strength * 0.4);
        };
        // GSAP owns this element's transform (it writes inline `scale: none`),
        // so the press state is a GSAP tween here; CSS :active covers reduced motion.
        const press = () => gsap.to(el, { scale: 0.97, duration: 0.12, ease: 'power2.out' });
        const release = () => gsap.to(el, { scale: 1, duration: uiSpring.duration, ease: uiSpring.ease });
        const leave = () => {
          x(0);
          y(0);
          ix(0);
          iy(0);
          release();
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        el.addEventListener('pointerdown', press);
        el.addEventListener('pointerup', release);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
          el.removeEventListener('pointerdown', press);
          el.removeEventListener('pointerup', release);
          gsap.set([el, inner], { clearProps: 'transform' });
        };
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <a ref={ref} className={`btn ${className}`} {...rest}>
      <span className="btn__inner">{children}</span>
    </a>
  );
}
