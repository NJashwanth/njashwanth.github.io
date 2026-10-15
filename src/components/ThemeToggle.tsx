import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/** Icons swap in CSS (--sun/--moon tokens), so the prerendered markup is theme-agnostic. */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(isDark());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setDark(isDark());
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const toggle = () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage blocked: theme still applies for this visit */
    }
    setDark(next === 'dark');
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label={dark === null ? 'Toggle color theme' : dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <SunIcon className="i-sun" />
      <MoonIcon className="i-moon" />
    </button>
  );
}
