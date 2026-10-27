/**
 * Geometry of the layered stack, shared by the prerendered SVG (render.ts)
 * and the three.js scene (stage3d.ts). Both use the same orthographic
 * projection, so the 3D scene lands exactly on top of the drawing.
 */

export const SLAB = { w: 3.2, d: 3.2, h: 0.16, gap: 0.66 };
export const PITCH = (30 * Math.PI) / 180;
export const YAW = (45 * Math.PI) / 180;
/** Screen units → SVG user units. */
export const SCALE = 100;
/** Room to the right of the stack for the layer labels, in world units. */
const LABEL_ROOM = 1.15;
export const LABEL_OFFSET = 0.22;

type Vec3 = [number, number, number];

/** Orthographic projection to screen units (x right, y down). */
export function project([x, y, z]: Vec3, yaw = YAW, pitch = PITCH): [number, number] {
  const sx = x * Math.cos(yaw) - z * Math.sin(yaw);
  const up = -x * Math.sin(pitch) * Math.sin(yaw) + y * Math.cos(pitch) - z * Math.sin(pitch) * Math.cos(yaw);
  return [sx, -up];
}

/** Bottom y of slab `i`, counting from the top layer. */
export const slabY = (i: number, count: number) => (count - 1 - i) * SLAB.gap;

/** World point the label of slab `i` hangs from: its right-most corner, mid-height. */
export const labelAnchor = (i: number, count: number): Vec3 => [SLAB.w / 2, slabY(i, count) + SLAB.h / 2, -SLAB.d / 2];

/** Centre of the stack in world units; the camera looks here. */
export const stackCenter = (count: number): Vec3 => [0, ((count - 1) * SLAB.gap + SLAB.h) / 2, 0];

/** The drawing's bounds in screen units, relative to the projected stack centre. */
export function viewBounds(count: number) {
  const c = project(stackCenter(count));
  const halfW = (SLAB.w / 2 + SLAB.d / 2) * Math.cos(YAW);
  const top = project([-SLAB.w / 2, slabY(0, count) + SLAB.h, -SLAB.d / 2])[1];
  const bottom = project([SLAB.w / 2, 0, SLAB.d / 2])[1];
  const pad = 0.1;
  return {
    left: -halfW - pad - c[0],
    right: halfW + LABEL_OFFSET + LABEL_ROOM - c[0],
    top: top - pad - c[1],
    bottom: bottom + pad - c[1],
  };
}

const pts = (points: Vec3[], c: [number, number]) =>
  points
    .map((p) => project(p))
    .map(([x, y]) => `${((x - c[0]) * SCALE).toFixed(1)},${((y - c[1]) * SCALE).toFixed(1)}`)
    .join(' ');

/** Polygons and label positions for the static drawing, painted bottom slab first. */
export function svgStack(labels: string[]) {
  const n = labels.length;
  const c = project(stackCenter(n));
  const { w, d, h } = SLAB;
  const b = viewBounds(n);
  const slabs = labels
    .map((label, i) => {
      const y0 = slabY(i, n);
      const y1 = y0 + h;
      const [lx, ly] = project(labelAnchor(i, n));
      return {
        label,
        top: pts([[-w / 2, y1, -d / 2], [w / 2, y1, -d / 2], [w / 2, y1, d / 2], [-w / 2, y1, d / 2]], c),
        right: pts([[w / 2, y0, -d / 2], [w / 2, y0, d / 2], [w / 2, y1, d / 2], [w / 2, y1, -d / 2]], c),
        front: pts([[-w / 2, y0, d / 2], [w / 2, y0, d / 2], [w / 2, y1, d / 2], [-w / 2, y1, d / 2]], c),
        labelX: (lx - c[0] + LABEL_OFFSET) * SCALE,
        labelY: (ly - c[1]) * SCALE,
      };
    })
    .reverse();
  const viewBox = [b.left, b.top, b.right - b.left, b.bottom - b.top].map((v) => (v * SCALE).toFixed(1)).join(' ');
  return { viewBox, slabs };
}
