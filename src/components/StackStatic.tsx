import type { CSSProperties } from 'react';
import { stack } from '../content';

/**
 * The hero stack as plain HTML/CSS 3D: prerendered, so it paints instantly.
 * It is the final visual on mobile, under reduced motion and without WebGL,
 * and the placeholder until the WebGL stack is ready elsewhere.
 */
export function StackStatic({ hidden = false, gone = false }: { hidden?: boolean; gone?: boolean }) {
  return (
    <div className={`stack-static${hidden ? ' is-hidden' : ''}${gone ? ' is-gone' : ''}`} aria-hidden="true">
      {stack.map((layer, i) => (
        <div className="ss-layer" key={layer.label} style={{ '--i': i } as CSSProperties}>
          <div className="ss-plane">{i === 0 && <span className="ss-packet" />}</div>
          <span className="ss-label">{layer.label}</span>
        </div>
      ))}
    </div>
  );
}
