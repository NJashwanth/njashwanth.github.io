import { useEffect, useState } from 'react';
import { useMotion } from '../lib/motion';

/**
 * "Motion: on/off". Defaults to the OS setting until the visitor chooses;
 * the choice persists (localStorage "motion"). The label waits for mount
 * because the prerendered HTML can't know the visitor's setting.
 */
export function MotionToggle({ className = '' }: { className?: string }) {
  const { motion, setMotion } = useMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const on = motion === 'full';

  return (
    <button
      type="button"
      className={`motion-toggle ${className}`}
      aria-pressed={mounted ? on : undefined}
      onClick={() => setMotion(on ? 'reduced' : 'full')}
      title="Toggle animations"
    >
      <span className="motion-toggle__dot" aria-hidden="true" />
      Motion: <span className="motion-toggle__state">{mounted ? (on ? 'on' : 'off') : 'on'}</span>
    </button>
  );
}
