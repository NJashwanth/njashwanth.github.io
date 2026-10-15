import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, RoundedBox } from '@react-three/drei';
import {
  AdditiveBlending,
  NormalBlending,
  BufferGeometry,
  Shape,
  Vector3,
  type Group,
  type LineBasicMaterial,
  type MeshStandardMaterial,
} from 'three';
import gsap from 'gsap';
import { stack } from '../content';

/*
 * The hero visual: five translucent layers of a product, Interface down to
 * AI Model. A packet carries a request down to the model and the response
 * back up every ~4s; each layer floats on its own phase. Hovering a layer
 * lifts it and lists the tools I use there.
 *
 * Scroll (full motion, 768px+): the hero is pinned for 60% of a viewport
 * (see Hero.tsx) while the layers separate and their labels spread; once the
 * pin releases, the stack scales down and fades as About comes in.
 *
 * Reduced motion: the same lit scene, held still. No float, no travelling
 * packet (it rests on Interface), no cursor tilt, no scroll explode. Frames
 * render only on demand; hovering a layer still highlights it and lists tools.
 */

const W = 2.6;
const D = 1.7;
const CORNER = 0.16;
const GAP = 0.5;
const SPREAD_GAP = 1.05;
const LOOP = 4;
/** Scroll distances, as fractions of the viewport height. PIN must match Hero.tsx. */
const PIN = 0.6;
const FADE = 0.5;

type Loop = 'always' | 'demand' | 'never';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Packet progress over one 4s loop: 0 = above Interface, 1 = at AI Model, then back. */
function packetPhase(t: number) {
  const p = t % LOOP;
  if (p < 1.6) return easeInOut(p / 1.6);
  if (p < 2) return 1;
  if (p < 3.6) return 1 - easeInOut((p - 2) / 1.6);
  return 0;
}

function outline(w: number, d: number, r: number) {
  const s = new Shape();
  s.moveTo(-w / 2 + r, -d / 2);
  s.lineTo(w / 2 - r, -d / 2);
  s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  s.lineTo(w / 2, d / 2 - r);
  s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
  s.lineTo(-w / 2 + r, d / 2);
  s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
  s.lineTo(-w / 2, -d / 2 + r);
  s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  return new BufferGeometry().setFromPoints(s.getPoints(6).map((p) => new Vector3(p.x, 0.032, p.y)));
}

/** Scene colours come from the same CSS theme tokens as the page (--stack-*). */
type Palette = {
  dark: boolean;
  panel: string;
  panelOpacity: number;
  edge: string;
  edgeOpacity: number;
  emissive: string;
  emissiveBase: number;
  packet: string;
  halo: string;
  haloOpacity: number;
  haloSize: number;
  haloAdditive: boolean;
  shadow: string;
};

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  return {
    dark: cs.colorScheme.includes('dark'),
    panel: v('--stack-panel'),
    panelOpacity: parseFloat(v('--stack-panel-opacity')),
    edge: v('--stack-edge'),
    edgeOpacity: parseFloat(v('--stack-edge-opacity')),
    emissive: v('--stack-emissive'),
    emissiveBase: parseFloat(v('--stack-emissive-base')),
    packet: v('--stack-packet'),
    halo: v('--stack-halo'),
    haloOpacity: parseFloat(v('--stack-halo-opacity')),
    haloSize: parseFloat(v('--stack-halo-size')),
    haloAdditive: v('--stack-halo-blend') === 'additive',
    shadow: v('--stack-shadow'),
  };
}

type SceneProps = {
  portal: RefObject<HTMLDivElement | null>;
  wrap: RefObject<HTMLDivElement | null>;
  onDone: (done: boolean) => void;
  onFirstFrame: () => void;
  reduced: boolean;
};

function Scene({ portal, wrap, onDone, onFirstFrame, reduced }: SceneProps) {
  const group = useRef<Group>(null);
  const layers = useRef<(Group | null)[]>([]);
  const mats = useRef<(MeshStandardMaterial | null)[]>([]);
  const lines = useRef<(LineBasicMaterial | null)[]>([]);
  const packet = useRef<Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pal, setPal] = useState<Palette>(readPalette);

  const edge = useMemo(() => outline(W, D, CORNER), []);
  const scroll = useMemo(() => ({ spread: 0, shrink: 1 }), []);
  const pointer = useRef({ x: 0, y: 0 });
  const lift = useRef(stack.map(() => 0));
  const time = useRef(0);
  const firstFrame = useRef(false);

  // Follow the site theme so panels read on both backgrounds.
  useEffect(() => {
    const sync = () => {
      setPal(readPalette());
      invalidate();
    };
    sync();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', sync);
    window.addEventListener('themechange', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('themechange', sync);
    };
  }, [invalidate]);

  // Repaint on hover: in reduced mode nothing else asks for frames.
  useEffect(() => invalidate(), [hovered, reduced, invalidate]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      pointer.current.x = pointer.current.y = 0;
    };
  }, [reduced]);

  // Scroll: layers separate during the hero pin, then the stack shrinks and
  // fades over the next half viewport. Full motion at 768px+ only.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    if (reduced || !desktop) {
      scroll.spread = 0;
      scroll.shrink = 1;
      onDone(false);
      invalidate();
      return;
    }
    let done = false;
    const total = PIN + FADE;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        // Explicit scroll positions: '#top' is the element the hero pin holds,
        // and ScrollTrigger offsets triggers on a pinned element by the pin
        // length, which pushed this whole timeline 60vh too late. The hero
        // always starts at scroll 0, so measure from there.
        start: 0,
        end: () => window.innerHeight * total,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          invalidate();
          const now = self.progress > 0.99;
          if (now !== done) onDone((done = now));
        },
      },
    });
    tl.to(scroll, { spread: 1, duration: PIN, ease: 'power1.inOut' })
      .to(scroll, { shrink: 0.7, duration: FADE, ease: 'power1.in' })
      .to(wrap.current, { autoAlpha: 0, duration: FADE * 0.8 }, PIN + FADE * 0.2);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(wrap.current, { clearProps: 'opacity,visibility' });
    };
  }, [scroll, wrap, invalidate, onDone, reduced]);

  useFrame((_, rawDelta) => {
    if (!group.current) return;
    // Signal readiness only after a frame has actually been drawn.
    if (!firstFrame.current) {
      firstFrame.current = true;
      requestAnimationFrame(onFirstFrame);
    }
    const delta = Math.min(rawDelta, 1 / 20);
    if (!reduced) time.current += delta;
    const t = time.current;
    const gap = GAP + (SPREAD_GAP - GAP) * scroll.spread;
    const top = ((stack.length - 1) / 2) * gap;
    // Reduced: snap straight to the target state instead of easing toward it.
    const k = reduced ? 1 : 1 - Math.exp(-delta * 8);

    const py = reduced ? top + 0.04 : top + 0.32 - (2 * top + 0.32) * packetPhase(t);
    packet.current?.position.set(0, py, 0);

    layers.current.forEach((g, i) => {
      if (!g) return;
      lift.current[i] += ((hovered === i && !reduced ? 0.12 : 0) - lift.current[i]) * k;
      const y = top - i * gap;
      // Each layer floats on its own phase so the stack breathes, not bobs.
      const float = reduced ? 0 : Math.sin(t * 0.9 + i * 0.8) * 0.02;
      g.position.y = y + float + lift.current[i];
      const glow = Math.exp(-((py - y) ** 2) * 28);
      const m = mats.current[i];
      if (m) m.emissiveIntensity = pal.emissiveBase + glow * 0.9 + (hovered === i ? 0.35 : 0);
      const l = lines.current[i];
      if (l) l.opacity = Math.min(1, pal.edgeOpacity + glow * 0.3 + (hovered === i ? 0.3 : 0));
    });

    // Mild compensation so the spread stack still fits the canvas, without cancelling the spread.
    const s = scroll.shrink / (1 + scroll.spread * 0.3);
    group.current.scale.setScalar(s);
    const ry = scroll.spread * 0.3 + pointer.current.x * 0.12;
    const rx = pointer.current.y * 0.06;
    group.current.rotation.y += (ry - group.current.rotation.y) * k;
    group.current.rotation.x += (rx - group.current.rotation.x) * k;
  });

  return (
    <>
      <ambientLight intensity={pal.dark ? 0.5 : 0.9} />
      <directionalLight position={[2, 6, 3]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={2.2} color="#54C5F8" />
      <group ref={group}>
        {stack.map((layer, i) => (
          <group key={layer.label} ref={(g) => void (layers.current[i] = g)}>
            <RoundedBox
              args={[W, 0.3, D]}
              radius={CORNER}
              smoothness={4}
              scale={[1, 0.2, 1]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(i);
              }}
              onPointerOut={() => setHovered((h) => (h === i ? null : h))}
            >
              <meshStandardMaterial
                ref={(m) => void (mats.current[i] = m)}
                color={pal.panel}
                emissive={pal.emissive}
                transparent
                opacity={pal.panelOpacity}
                roughness={0.7}
                metalness={0.05}
                depthWrite={false}
              />
            </RoundedBox>
            <lineLoop geometry={edge}>
              <lineBasicMaterial ref={(m) => void (lines.current[i] = m)} color={pal.edge} transparent />
            </lineLoop>
            <Html
              portal={portal as RefObject<HTMLElement>}
              position={[W / 2 + 0.06, 0, -D / 2 + 0.05]}
              pointerEvents="none"
              zIndexRange={[10, 0]}
            >
              <div className={`stack-label${hovered === i ? ' is-open' : ''}`}>
                <span className="stack-label__name">{layer.label}</span>
                <span className="stack-label__tools">{layer.tools}</span>
              </div>
            </Html>
          </group>
        ))}
        <group ref={packet}>
          <mesh>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={pal.packet} />
          </mesh>
          <mesh scale={pal.haloSize}>
            <sphereGeometry args={[1, 16, 16]} />
            {/* Additive glow vanishes on a light background, so light mode blends normally. */}
            <meshBasicMaterial
              color={pal.halo}
              transparent
              opacity={pal.haloOpacity}
              blending={pal.haloAdditive ? AdditiveBlending : NormalBlending}
              depthWrite={false}
            />
          </mesh>
          <pointLight color={pal.halo} intensity={pal.dark ? 1.4 : 2} distance={1.6} decay={2} />
        </group>
      </group>
      {/* Rendered once: the layers only float ±0.02, and re-rendering the shadow
          pass (depth + two blurs) every frame tripled the per-frame cost. Placed
          below the fully spread stack so separating layers never cut through it. */}
      <ContactShadows
        frames={1}
        position={[0, -1.85, 0]}
        opacity={0.25}
        scale={7}
        blur={2.6}
        far={3.6}
        resolution={256}
        color={pal.shadow}
      />
    </>
  );
}

export default function Stack3D({ onReady, reduced }: { onReady: () => void; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // Pause entirely off-screen or in a background tab.
  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(wrap.current!);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, []);

  // Full motion: render every frame while the hero is in view (float + packet
  // loop). Reduced: on demand only. Never while hidden or faded out.
  const frameloop: Loop = done || !onScreen || !tabVisible ? 'never' : reduced ? 'demand' : 'always';

  const onFirstFrame = () => {
    setReady(true);
    onReady();
  };

  return (
    <div ref={wrap} className="stack3d" aria-hidden="true">
      <div className={`stack3d__fade${ready ? ' is-ready' : ''}`}>
        <Canvas
          frameloop={frameloop}
          dpr={[1, 1.5]}
          camera={{ fov: 30, position: [4.3, 5.2, 5.4], near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}
        >
          <Scene portal={portal} wrap={wrap} onDone={setDone} onFirstFrame={onFirstFrame} reduced={reduced} />
        </Canvas>
        <div ref={portal} className="stack3d__labels" />
      </div>
    </div>
  );
}
