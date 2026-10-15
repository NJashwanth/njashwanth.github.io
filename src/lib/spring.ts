/**
 * Spring physics as a GSAP ease. Simulates a damped harmonic oscillator
 * (mass 1) from 0 to 1, samples it, and returns the curve plus the time the
 * spring takes to settle, so tweens get real overshoot and settle timing:
 *
 *   const s = spring({ stiffness: 220, damping: 20 });
 *   gsap.to(el, { x: 0, duration: s.duration, ease: s.ease });
 */
export function spring({ stiffness = 180, damping = 18 } = {}) {
  const dt = 1 / 240;
  const samples = [0];
  let x = 0;
  let v = 0;
  for (let t = 0; t < 3; t += dt) {
    v += (-stiffness * (x - 1) - damping * v) * dt;
    x += v * dt;
    samples.push(x);
    if (Math.abs(x - 1) < 5e-4 && Math.abs(v) < 5e-3) break;
  }
  const n = samples.length - 1;
  const ease = (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    const i = p * n;
    const i0 = Math.floor(i);
    return samples[i0] + (samples[i0 + 1] - samples[i0]) * (i - i0);
  };
  return { ease, duration: n * dt };
}

/** Snappy UI spring: small overshoot, settles in ~0.5s. */
export const uiSpring = spring({ stiffness: 260, damping: 22 });
