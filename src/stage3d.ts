/**
 * The hero's stack in WebGL. Loaded lazily by main.ts on desktop when motion
 * is allowed; until then (and otherwise) the prerendered SVG shows. The
 * orthographic camera reproduces the SVG's projection, so the swap is seamless.
 *
 * A request (the accent cube) travels down through the layers to the model
 * and back up; the layer it touches tints toward the accent. The pointer
 * turns the stack up to ±8°, and scrolling the hero away (StringProgress,
 * relayed by main.ts as `heroprogress`) opens the layers apart. It renders
 * only while the stack is on screen.
 */
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, OrthographicCamera, SRGBColorSpace, Scene, WebGLRenderer } from 'three';
import { LABEL_OFFSET, PITCH, SLAB, YAW, labelAnchor, project, slabY, stackCenter, viewBounds } from './stack-geometry.ts';

const MAX_TURN = (8 * Math.PI) / 180;
/** How far the layers open apart when the hero has scrolled away. */
const MAX_SPREAD = 0.45;

/** Resolves any CSS colour (including color-mix) to an sRGB three.js Color. */
function cssColor(value: string) {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function mountStack(host: HTMLElement) {
  const stage = host.closest<HTMLElement>('.hero__art')!;
  const svg = host.parentElement!.querySelector<SVGSVGElement>('.stack-svg')!;
  const labels = [...host.querySelectorAll<HTMLElement>('.stack-3d__label')];
  const n = labels.length;
  const { w, d, h } = SLAB;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.prepend(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const center = stackCenter(n);

  // Faces of a BoxGeometry, in order: +x, -x, +y, -y, +z, -z.
  const tops: MeshBasicMaterial[] = [];
  const meshes: Mesh[] = [];
  const slabs = labels.map((_, i) => {
    const side = new MeshBasicMaterial();
    const top = new MeshBasicMaterial();
    const front = new MeshBasicMaterial();
    tops.push(top);
    const mesh = new Mesh(new BoxGeometry(w, h, d), [side, side, top, side, front, side]);
    mesh.position.set(0, slabY(i, n) + h / 2, 0);
    scene.add(mesh);
    meshes.push(mesh);
    return { side, top, front };
  });
  const packetMat = new MeshBasicMaterial();
  const packet = new Mesh(new BoxGeometry(0.26, 0.26, 0.26), packetMat);
  scene.add(packet);

  let topBase: Color[] = [];
  let accent = new Color();
  function readColors() {
    const style = (sel: string, i: number) => getComputedStyle(svg.querySelectorAll(sel)[i]).fill;
    // SVG slabs are painted bottom first, so index n-1-i is layer i.
    topBase = labels.map((_, i) => cssColor(style('.slab__top', n - 1 - i)));
    slabs.forEach((s, i) => {
      s.top.color.copy(topBase[i]);
      s.side.color.copy(cssColor(style('.slab__right', n - 1 - i)));
      s.front.color.copy(cssColor(style('.slab__front', n - 1 - i)));
    });
    accent = cssColor(getComputedStyle(stage).getPropertyValue('--accent'));
    packetMat.color.copy(accent);
  }

  // Frame the camera to match the SVG's viewBox as laid out (preserveAspectRatio: meet).
  const b = viewBounds(n);
  let k = 1;
  let W = 1;
  let H = 1;
  let dx = 0;
  let dy = 0;
  const vbCx = (b.left + b.right) / 2;
  const vbCy = (b.top + b.bottom) / 2;
  function layout() {
    const hr = host.getBoundingClientRect();
    const sr = svg.getBoundingClientRect();
    if (!hr.width || !hr.height || !sr.width) return; // the stack layer is hidden
    W = hr.width;
    H = hr.height;
    k = Math.min(sr.width / (b.right - b.left), sr.height / (b.bottom - b.top));
    dx = sr.left + sr.width / 2 - (hr.left + W / 2);
    dy = sr.top + sr.height / 2 - (hr.top + H / 2);
    camera.left = vbCx + (-W / 2 - dx) / k;
    camera.right = vbCx + (W / 2 - dx) / k;
    camera.top = -(vbCy + (-H / 2 - dy) / k);
    camera.bottom = -(vbCy + (H / 2 - dy) / k);
    camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
  }

  // Layers open apart around the stack's centre as the hero scrolls away.
  let spread = 0;
  let spreadTarget = 0;
  const spreadY = (y: number) => center[1] + (y - center[1]) * (1 + spread * MAX_SPREAD);
  addEventListener('heroprogress', (e) => {
    spreadTarget = (e as CustomEvent<number>).detail;
    run();
  });

  let yaw = YAW;
  function aim() {
    const dist = 20;
    camera.position.set(
      center[0] + dist * Math.sin(yaw) * Math.cos(PITCH),
      center[1] + dist * Math.sin(PITCH),
      center[2] + dist * Math.cos(yaw) * Math.cos(PITCH),
    );
    camera.lookAt(center[0], center[1], center[2]);
    const [cx, cy] = project(center, yaw);
    labels.forEach((el, i) => {
      const a = labelAnchor(i, n);
      const [lx, ly] = project([a[0], spreadY(a[1]), a[2]], yaw);
      const px = (lx - cx - vbCx + LABEL_OFFSET) * k + W / 2 + dx;
      const py = (ly - cy - vbCy) * k + H / 2 + dy;
      el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translateY(-50%)`;
    });
  }

  // The request's path: rest on each layer going down, then come back up.
  const restY = (i: number) => slabY(i, n) + h + 0.13;
  const stops = [restY(0) + 0.9, ...labels.map((_, i) => restY(i)), ...labels.slice(0, -1).map((_, i) => restY(n - 2 - i)), restY(0) + 0.9];
  const stopLayer = [-1, ...labels.map((_, i) => i), ...labels.slice(0, -1).map((_, i) => n - 2 - i), -1];
  const MOVE = 0.55;
  const DWELL = 0.4;
  const PAUSE = 1.4;
  const loop = (stops.length - 1) * (MOVE + DWELL) + PAUSE;
  const glow = labels.map(() => 0);
  packet.position.set(w / 2 - 0.4, stops[0], d / 2 - 0.4);

  let turnTarget = 0;
  let turn = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    turnTarget = ((e.clientX - r.left) / r.width - 0.5) * 2;
  });
  stage.addEventListener('pointerleave', () => (turnTarget = 0));

  let raf = 0;
  let last = 0;
  let clock = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    clock = (clock + dt) % loop;

    turn += (turnTarget - turn) * Math.min(1, dt * 4);
    spread += (spreadTarget - spread) * Math.min(1, dt * 6);
    meshes.forEach((m, i) => (m.position.y = spreadY(slabY(i, n) + h / 2)));
    yaw = YAW + turn * MAX_TURN + Math.sin(now / 2600) * 0.03;
    aim();

    const seg = Math.min(Math.floor(clock / (MOVE + DWELL)), stops.length - 2);
    const t = Math.min(1, (clock - seg * (MOVE + DWELL)) / MOVE);
    packet.position.y = spreadY(stops[seg] + (stops[seg + 1] - stops[seg]) * ease(t));
    packet.visible = clock < loop - PAUSE + MOVE;
    const touching = t >= 1 ? stopLayer[seg + 1] : -1;

    glow.forEach((g, i) => {
      const target = i === touching && i < n - 1 ? 1 : 0;
      glow[i] = g + (target - g) * Math.min(1, dt * 6);
      tops[i].color.copy(topBase[i]).lerp(accent, glow[i] * 0.35);
    });
    renderer.render(scene, camera);
  }

  let onScreen = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function run() {
    const go = onScreen && !document.hidden && !reduced.matches;
    if (go && !raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    } else if (!go && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    host.classList.toggle('is-ready', !reduced.matches);
  }

  readColors();
  layout();
  aim();
  renderer.render(scene, camera);
  requestAnimationFrame(() => run());

  new ResizeObserver(() => {
    layout();
    aim();
    renderer.render(scene, camera);
  }).observe(host);
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    run();
  }).observe(stage);
  document.addEventListener('visibilitychange', run);
  reduced.addEventListener('change', run);
  addEventListener('themechange', () => {
    readColors();
    renderer.render(scene, camera);
  });
}

