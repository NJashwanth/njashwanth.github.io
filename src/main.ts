/**
 * Behaviour only: the page is complete without this script (render.ts).
 */
import './styles/fonts.css';
import './styles/site.css';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 64rem)');

/* ---------- Theme ---------- */

const darkOs = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : darkOs.matches);
const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

function syncThemeUi() {
  const dark = isDark();
  themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  const color = getComputedStyle(root).getPropertyValue('--bg').trim();
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => (m.content = color));
  window.dispatchEvent(new Event('themechange'));
}
themeButton?.addEventListener('click', () => {
  root.dataset.theme = isDark() ? 'light' : 'dark';
  try {
    localStorage.setItem('theme', root.dataset.theme);
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
  syncThemeUi();
});
darkOs.addEventListener('change', syncThemeUi);
syncThemeUi();

/* ---------- Stage: shows the active project's sheet ---------- */

const stage = document.querySelector<HTMLElement>('.stage');
const items = [...document.querySelectorAll<HTMLElement>('.work__item')];
const workList = document.querySelector<HTMLElement>('.work__list');
let current = stage?.dataset.show ?? '';
items.find((it) => it.dataset.item === current)?.classList.add('is-active');

function show(id: string) {
  if (!stage || id === current) return;
  current = id;
  stage.dataset.show = id;
  stage.querySelectorAll<HTMLElement>('[data-layer]').forEach((l) => l.classList.toggle('is-active', l.dataset.layer === id));
  items.forEach((it) => it.classList.toggle('is-active', it.dataset.item === id));
  syncVideos();
}

if (stage && workList) {
  // The row crossing the middle of the viewport is the active one; pointer and focus win over scroll.
  let pointerItem: string | null = null;
  let scrollItem: string | null = null;
  const pick = () => {
    const id = pointerItem ?? scrollItem;
    if (id) show(id);
  };
  const middle = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) scrollItem = (e.target as HTMLElement).dataset.item!;
      pick();
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  items.forEach((it) => {
    middle.observe(it);
    it.addEventListener('pointerenter', () => {
      pointerItem = it.dataset.item!;
      pick();
    });
    it.addEventListener('pointerleave', () => {
      pointerItem = null;
      pick();
    });
    it.addEventListener('focusin', () => {
      pointerItem = it.dataset.item!;
      pick();
    });
  });
  workList.addEventListener('focusout', (e) => {
    if (!workList.contains(e.relatedTarget as Node)) {
      pointerItem = null;
      pick();
    }
  });
}

/* ---------- genui_mock: replay the recorded fixture ---------- */

const replayButton = document.querySelector<HTMLButtonElement>('[data-replay]');
const replayStatus = document.querySelector<HTMLElement>('[data-replay-status]');
let replayTimers: number[] = [];

replayButton?.addEventListener('click', () => {
  replayTimers.forEach(clearTimeout);
  replayTimers = [];
  const sheets = document.querySelectorAll<HTMLElement>('[data-replay-target="genui-mock"]');
  const chunks = [...sheets].map((s) => [...s.querySelectorAll<HTMLElement>('[data-chunk]')]);
  sheets.forEach((s) => s.classList.add('is-replaying'));
  chunks.flat().forEach((c) => c.classList.remove('is-in'));
  if (replayStatus) replayStatus.textContent = 'Replaying 3 recorded chunks…';

  // Recorded delays are between chunks; replay them at their original pace.
  const delays = chunks[0]?.map((c) => Number(c.dataset.delay) || 0) ?? [];
  const speed = reduced.matches ? 0 : 1;
  let at = 0;
  delays.forEach((d, i) => {
    at += d * speed;
    replayTimers.push(window.setTimeout(() => chunks.forEach((list) => list[i]?.classList.add('is-in')), at));
  });
  replayTimers.push(
    window.setTimeout(() => {
      sheets.forEach((s) => s.classList.remove('is-replaying'));
      if (replayStatus) replayStatus.textContent = 'Rendered “Hello!” from the fixture, no network.';
    }, at + 250 * speed),
  );
});

/* ---------- broken_glass demo: plays only while seen, never under reduced motion ---------- */

const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-video]')];
const videoToggle = document.querySelector<HTMLButtonElement>('[data-video-toggle]');
let userPaused = reduced.matches;
const seen = new Set<HTMLVideoElement>();

function syncVideos() {
  for (const v of videos) {
    const visible = seen.has(v) && (!stage || !stage.contains(v) || current === v.dataset.video);
    if (visible && !userPaused) {
      if (v.preload !== 'auto') v.preload = 'auto';
      v.play().catch(() => {});
    } else v.pause();
  }
  if (videoToggle) {
    videoToggle.textContent = userPaused ? 'Play Demo' : 'Pause Demo';
    videoToggle.setAttribute('aria-pressed', String(userPaused));
  }
}
if (videos.length) {
  const vio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) seen.add(v);
      else seen.delete(v);
    }
    syncVideos();
  });
  videos.forEach((v) => vio.observe(v));
  videoToggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    syncVideos();
  });
  syncVideos();
}

/* ---------- Contact: the field opens a written email ---------- */

document.querySelector<HTMLFormElement>('[data-mail-form]')?.addEventListener('submit', (e) => {
  const form = e.currentTarget as HTMLFormElement;
  const body = (form.elements.namedItem('body') as HTMLInputElement).value.trim();
  if (!body) return;
  e.preventDefault();
  const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
  location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

/* ---------- StringTune: scroll and cursor motion ---------- */

// Loaded after first paint so it never blocks the page; everything it drives has a finished
// state without it. Native scroll is kept (no smooth-scroll takeover), so anchors, keyboard
// scrolling and find-in-page behave normally.
const fine = matchMedia('(pointer: fine)');
async function startTune() {
  const { default: StringTune, StringLazy, StringResponsive, StringProgress, StringSplit, StringParallax, StringMagnetic } =
    await import('@fiddle-digital/string-tune');
  const tune = StringTune.getInstance();
  tune.scrollDesktopMode = 'default';
  tune.scrollMobileMode = 'default';

  // Not motion: lazy pictures and the screen-size events run for everyone. StringProgress only
  // writes --progress, which moves nothing unless html.st-motion is set, but its per-frame
  // geometry pass is what tells StringLazy an image has come into view.
  tune.use(StringLazy);
  tune.use(StringProgress);
  tune.use(StringResponsive, {
    settings: { mobile: { max: 767 }, tablet: { min: 768, max: 1023 }, laptop: { min: 1024, max: 1439 }, desktop: { min: 1440 } },
  });
  for (const screen of ['mobile', 'tablet', 'laptop', 'desktop']) {
    tune.on(`screen:${screen}`, (active: boolean) => {
      if (active) root.dataset.screen = screen;
    });
  }

  const motion = !reduced.matches;
  if (motion) {
    // The hero name splits into characters only where the intro plays (desktop, fine pointer).
    const name = document.querySelector<HTMLElement>('[data-split-intro]');
    if (name && root.classList.contains('st-intro')) {
      name.setAttribute('string', 'split');
      name.setAttribute('string-split', 'char-line[start]');
    }
    tune.use(StringSplit);
    // Heavier effects only with a mouse on a wide screen.
    if (fine.matches && desktop.matches) {
      tune.use(StringParallax);
      tune.use(StringMagnetic);
    }
    tune.on('object:progress:hero', (p: number) => dispatchEvent(new CustomEvent('heroprogress', { detail: p })));
    root.classList.add('st-motion');
  }
  tune.start(60);
  requestAnimationFrame(() => root.classList.remove('st-intro'));
}
startTune().catch(() => root.classList.remove('st-intro'));

// Backstop for StringLazy: an instant jump (an anchor link under reduced motion) can land on a
// picture before the runtime's in-view pass has run. Anything on screen and still unloaded
// shortly after gets its real source.
const lazyBackstop = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const img = e.target as HTMLImageElement;
    setTimeout(() => {
      if (img.classList.contains('-loaded') || img.naturalWidth > 1) return lazyBackstop.unobserve(img);
      img.src = img.getAttribute('string-lazy')!;
      lazyBackstop.unobserve(img);
    }, 400);
  }
});
document.querySelectorAll<HTMLImageElement>('img[string-lazy]').forEach((img) => lazyBackstop.observe(img));

/* ---------- The 3D stack: desktop, motion allowed, WebGL, after load ---------- */

function want3d() {
  if (reduced.matches || !desktop.matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData || new URLSearchParams(location.search).has('static')) return false;
  const c = document.createElement('canvas');
  return !!(c.getContext('webgl2') || c.getContext('webgl'));
}
const host = document.querySelector<HTMLElement>('[data-stack-3d]');
if (host) {
  const start = () => {
    if (!want3d()) return;
    import('./stage3d.ts').then((m) => m.mountStack(host)).catch(() => {
      /* keep the drawing */
    });
  };
  const idle = (fn: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200));
  if (document.readyState === 'complete') idle(start);
  else addEventListener('load', () => idle(start), { once: true });
}
