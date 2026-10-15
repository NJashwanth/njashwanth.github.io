import { useSyncExternalStore } from 'react';

/*
 * The site's motion setting: one store that every animation reads.
 *
 * Resolution order:
 *   1. URL param ?motion=full | ?motion=reduced (also persisted to localStorage)
 *   2. localStorage "motion" (set by the URL param or the nav toggle)
 *   3. the OS prefers-reduced-motion setting
 *
 * index.html runs the same resolution inline before first paint and writes
 * <html data-motion="full|reduced">, which the CSS keys off. This module is
 * the only place allowed to read prefers-reduced-motion.
 *
 * Reduced is quieter, not static: opacity fades, colour and shadow
 * transitions, press states and focus rings stay; smooth scroll, SplitText,
 * scroll-scrubbed animation, cursor-follow and looping motion go.
 */

export type Motion = 'full' | 'reduced';

const KEY = 'motion';
const OS_QUERY = '(prefers-reduced-motion: reduce)';
const isMotion = (v: unknown): v is Motion => v === 'full' || v === 'reduced';

function readStored(): Motion | null {
  try {
    const v = localStorage.getItem(KEY);
    return isMotion(v) ? v : null;
  } catch {
    return null;
  }
}

function store(m: Motion) {
  try {
    localStorage.setItem(KEY, m);
  } catch {
    /* storage blocked: the setting still applies for this visit */
  }
}

function resolve(): Motion {
  const param = new URLSearchParams(location.search).get(KEY);
  if (isMotion(param)) {
    store(param);
    return param;
  }
  return readStored() ?? (window.matchMedia(OS_QUERY).matches ? 'reduced' : 'full');
}

let current: Motion | null = null;
const listeners = new Set<() => void>();

function apply(m: Motion) {
  current = m;
  document.documentElement.dataset.motion = m;
  listeners.forEach((l) => l());
}

/** Current setting. On the server (prerender) it is always "full". */
export function getMotion(): Motion {
  if (typeof window === 'undefined') return 'full';
  if (current === null) {
    current = resolve();
    document.documentElement.dataset.motion = current;
    // Follow the OS live, but only while the visitor hasn't chosen explicitly.
    window.matchMedia(OS_QUERY).addEventListener('change', () => {
      if (!readStored() && !isMotion(new URLSearchParams(location.search).get(KEY))) apply(resolve());
    });
  }
  return current;
}

export const isReducedMotion = () => getMotion() === 'reduced';

/** Visitor choice from the nav toggle; persisted. */
export function setMotion(m: Motion) {
  store(m);
  apply(m);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Calls `cb` whenever the setting changes. Returns an unsubscribe. */
export function onMotionChange(cb: (m: Motion) => void) {
  return subscribe(() => cb(getMotion()));
}

/**
 * The hook every component uses. It reports the real value on the client
 * from the first render (the inline head script already resolved it), so
 * markup that depends on it must wait until mount (see MotionToggle).
 */
export function useMotion() {
  const motion = useSyncExternalStore(subscribe, getMotion, getMotion);
  return { motion, reduced: motion === 'reduced', setMotion };
}
