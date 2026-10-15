import { useRef, useState } from 'react';
import gsap from 'gsap';
import { uiSpring } from '../lib/spring';
import { isReducedMotion } from '../lib/motion';

/** An install command with a copy button that briefly confirms "Copied". */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const label = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // Clipboard blocked (e.g. insecure context): select the text instead.
      const range = document.createRange();
      range.selectNodeContents(label.current!.closest('.cmd')!.querySelector('code')!);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
      return;
    }
    setCopied(true);
    if (!isReducedMotion()) {
      gsap.fromTo(label.current, { scale: 0.85 }, { scale: 1, duration: uiSpring.duration, ease: uiSpring.ease });
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="cmd">
      <code>{command}</code>
      <button type="button" className={`cmd__btn${copied ? ' is-copied' : ''}`} onClick={copy}>
        <span ref={label} aria-live="polite">
          {copied ? 'Copied' : 'Copy'}
        </span>
        <span className="sr-only"> install command</span>
      </button>
    </div>
  );
}
