import { easeCubic } from "@/lib/scrub";
import { BETWEEN } from "@/lib/choreography";

/**
 * The motif camera. The monogram lives in its 662 × 827 viewBox; the fixed layer shows a
 * window onto that space. A pose says which glyph point (the anchor) sits at which viewport
 * point, how tall the glyph is, and how it is rotated. Keyframes are placed relative to the
 * section tracks and resolved to absolute scroll positions at measure time.
 */

export type TrackKey = "hero" | "problem" | "continuation" | "between";
export type Piece = "A" | "B" | "C" | "D";
export type Point = { x: number; y: number };

export const GLYPH_W = 662;
export const GLYPH_H = 827;
export const GLYPH_CENTRE: Point = { x: 331, y: 413.5 };

/**
 * The cream ellipse of the "inside the room" beat, in glyph units — Figma "Ellipse 7"
 * (frame 35, node 120:2237): 443.35 × 307.21 at 0.7813 px per glyph unit, centred on the
 * mark. Kept in glyph space so it scales and sits with the mark instead of with the viewport.
 */
export const ELLIPSE = { rx: 283.7, ry: 196.6 } as const;

export type MotifState = {
  /** anchor in glyph units */
  ax: number;
  ay: number;
  /** where the anchor sits, as fractions of the viewport */
  sx: number;
  sy: number;
  /** pre-rotation glyph height in vh */
  h: number;
  /** degrees, positive = clockwise */
  rot: number;
  outline: number;
  photo: number;
  gold: number;
  /** ellipse opacity, and how far it has grown (0 = its drawn size, 1 = it covers the viewport) */
  ellipse: number;
  ellipseCover: number;
};

type Ease = (v: number) => number;
const linear: Ease = (v) => v;

/** A keyframe: partial pose, inherits whatever it leaves out from the previous keyframe. */
export type Keyframe = Partial<Omit<MotifState, "ax" | "ay">> & {
  track: TrackKey;
  /** -1 = track top at the viewport bottom · 0 = pin start · 1 = pin end · 2 = track bottom at the viewport top */
  at: number;
  /** which glyph point is the anchor: the centre, a piece's bounding-box centre, or a point in glyph units */
  anchor?: "centre" | Piece | Point;
  /** easing used to arrive at this keyframe from the previous one */
  ease?: Ease;
};

// ── the storyboard ────────────────────────────────────────────────────────────
const CENTRE = { anchor: "centre" as const };
const HOME = { ...CENTRE, sx: 0.47, sy: 0.53, h: 56, rot: 0 };
/** pre-rotation height of the mark while the camera is inside the photographs (vh) */
const ZOOM = 300;
/** points on the photograph bands (glyph units): a piece's box centre sits in the hole, these do not */
const ON_A: Point = { x: 105, y: 250 };
const ON_D: Point = { x: 430, y: 720 };
const ON_C: Point = { x: 95, y: 620 };

export const MOTIF_KEYFRAMES: Keyframe[] = [
  // 01 · hero: the mark surfaces once the copy has gone
  { track: "hero", at: 0, ...HOME, h: 50, outline: 0, photo: 0, gold: 0, ellipse: 0, ellipseCover: 0 },
  { track: "hero", at: 0.3, ...HOME, h: 50, outline: 0 },
  { track: "hero", at: 0.65, ...HOME, outline: 1 },
  { track: "hero", at: 1, ...HOME },
  // 02 · problem: it swells to frame the headline while the cream sheet slides up
  { track: "problem", at: 0, ...CENTRE, sx: 0.5, sy: 0.61, h: 142 },
  { track: "problem", at: 1, ...CENTRE, sx: 0.5, sy: 0.61, h: 146 },
  // 03 · continuation: it withdraws to the right of the headline
  { track: "continuation", at: 0, ...CENTRE, sx: 0.71, sy: 0.57, h: 49 },
  { track: "continuation", at: 0.1, ...CENTRE, sx: 0.71, sy: 0.57, h: 49 },
  // turns on its side and grows around the closing line
  { track: "continuation", at: 0.18, ...CENTRE, sx: 0.5, sy: 0.57, h: 89, rot: 90 },
  { track: "continuation", at: 0.3, ...CENTRE, sx: 0.5, sy: 0.57, h: 89 },
  // 04 · settles a little so the ellipse can sit in its centre
  { track: "continuation", at: 0.36, ...CENTRE, sx: 0.5, sy: 0.57, h: 74 },
  { track: "continuation", at: 0.4, ...CENTRE, sx: 0.5, sy: 0.57, h: 74, ellipse: 1, ellipseCover: 0 },
  { track: "continuation", at: 0.52, ...CENTRE, sx: 0.5, sy: 0.57, h: 74, ellipse: 1, ellipseCover: 0 },
  // the ellipse becomes the ground; the photographs arrive
  { track: "continuation", at: 0.58, ...CENTRE, sx: 0.5, sy: 0.57, h: 74, ellipseCover: 1, photo: 1, gold: 1 },
  // the camera dives into the photographs: each one framed off-centre so the caption sits on cream;
  // between pieces it pulls back a little so the move reads as one camera, not a cut
  { track: "continuation", at: 0.7, anchor: ON_A, sx: 0.78, sy: 0.72, h: ZOOM, ellipse: 0, outline: 0 },
  { track: "continuation", at: 0.76, anchor: ON_A, sx: 0.78, sy: 0.72, h: ZOOM },
  { track: "continuation", at: 0.79, ...CENTRE, sx: 0.5, sy: 0.5, h: 150, ease: linear },
  { track: "continuation", at: 0.82, anchor: ON_D, sx: 0.3, sy: 0.56, h: ZOOM, ease: linear },
  { track: "continuation", at: 0.88, anchor: ON_D, sx: 0.3, sy: 0.56, h: ZOOM },
  { track: "continuation", at: 0.91, ...CENTRE, sx: 0.5, sy: 0.5, h: 150, ease: linear },
  { track: "continuation", at: 0.94, anchor: ON_C, sx: 0.74, sy: 0.3, h: ZOOM, ease: linear },
  { track: "continuation", at: 1, anchor: ON_C, sx: 0.74, sy: 0.3, h: ZOOM },
  // 05 · between: upright again, outline only, at the right of the headline
  { track: "between", at: 0, ...CENTRE, sx: 0.79, sy: 0.58, h: 120, rot: 0, outline: 1, photo: 0, gold: 0, ellipseCover: 0 },
  { track: "between", at: BETWEEN.fadeOut[0], ...CENTRE, sx: 0.79, sy: 0.58, h: 120, outline: 1 },
  { track: "between", at: BETWEEN.fadeOut[1], ...CENTRE, sx: 0.79, sy: 0.58, h: 120, outline: 0 },
];

// ── resolution ────────────────────────────────────────────────────────────────
export type TrackRect = { top: number; height: number };
export type TrackRects = Record<TrackKey, TrackRect>;
export type Resolved = { y: number; state: MotifState; ease: Ease };

/** `{track, at}` → document scrollY. Pinned span S = height − viewport (0 for unpinned sections). */
export const keyframeY = (r: TrackRect, at: number, vh: number) => {
  const span = Math.max(r.height - vh, 0);
  if (at < 0) return r.top + at * vh;
  if (at > 1) return r.top + span + (at - 1) * vh;
  return r.top + at * span;
};

export function resolve(keys: Keyframe[], tracks: TrackRects, vh: number, pieces: Record<Piece, Point>): Resolved[] {
  const out: Resolved[] = [];
  let prev: MotifState | null = null;
  for (const k of keys) {
    const { track, at, anchor, ease, ...pose } = k;
    const base: MotifState = prev ?? {
      ax: GLYPH_CENTRE.x, ay: GLYPH_CENTRE.y, sx: 0.5, sy: 0.5, h: 56, rot: 0,
      outline: 0, photo: 0, gold: 0, ellipse: 0, ellipseCover: 0,
    };
    const a = anchor === undefined ? null : anchor === "centre" ? GLYPH_CENTRE : typeof anchor === "string" ? pieces[anchor] : anchor;
    const state: MotifState = { ...base, ...pose, ...(a ? { ax: a.x, ay: a.y } : {}) };
    out.push({ y: keyframeY(tracks[track], at, vh), state, ease: ease ?? easeCubic });
    prev = state;
  }
  return out.sort((p, q) => p.y - q.y);
}

// ── sampling ──────────────────────────────────────────────────────────────────
const mix = (a: number, b: number, e: number) => a + (b - a) * e;
/** geometric interpolation: a constant-rate zoom rather than a lurch at the end */
const mixLog = (a: number, b: number, e: number) => (a > 0 && b > 0 ? a * Math.pow(b / a, e) : mix(a, b, e));

export function sample(frames: Resolved[], y: number): MotifState {
  if (!frames.length) throw new Error("no keyframes");
  if (y <= frames[0].y) return frames[0].state;
  const last = frames[frames.length - 1];
  if (y >= last.y) return last.state;
  let i = 0;
  while (i < frames.length - 2 && frames[i + 1].y <= y) i++;
  const a = frames[i], b = frames[i + 1];
  const span = b.y - a.y;
  const e = span <= 0 ? 1 : b.ease((y - a.y) / span);
  const A = a.state, B = b.state;
  return {
    ax: mix(A.ax, B.ax, e), ay: mix(A.ay, B.ay, e),
    sx: mix(A.sx, B.sx, e), sy: mix(A.sy, B.sy, e),
    h: mixLog(A.h, B.h, e), rot: mix(A.rot, B.rot, e),
    outline: mix(A.outline, B.outline, e), photo: mix(A.photo, B.photo, e), gold: mix(A.gold, B.gold, e),
    ellipse: mix(A.ellipse, B.ellipse, e), ellipseCover: mix(A.ellipseCover, B.ellipseCover, e),
  };
}

// ── camera ────────────────────────────────────────────────────────────────────
/** Rotate a glyph point about the glyph centre by `deg` (clockwise, screen coordinates). */
export function rotated(p: Point, deg: number): Point {
  const th = (deg * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
  const dx = p.x - GLYPH_CENTRE.x, dy = p.y - GLYPH_CENTRE.y;
  return { x: GLYPH_CENTRE.x + dx * c - dy * s, y: GLYPH_CENTRE.y + dx * s + dy * c };
}

/** The viewBox that shows `state` in a `vw × vh` viewport, plus the rotation for the inner group. */
export function camera(state: MotifState, vw: number, vh: number) {
  const px = ((state.h / 100) * vh) / GLYPH_H; // px per glyph unit
  const p = rotated({ x: state.ax, y: state.ay }, state.rot);
  const w = vw / px, h = vh / px;
  const x = p.x - state.sx * w, y = p.y - state.sy * h;
  return { viewBox: `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`, rotate: state.rot };
}

/**
 * The ellipse's radii in glyph units. At `ellipseCover` 0 it is the size Figma draws it;
 * at 1 it just contains the viewport, which depends on the viewport's aspect and on where
 * the mark's centre currently sits — hence computed per frame rather than a fixed scale.
 */
export function ellipseRadii(state: MotifState, vw: number, vh: number) {
  const px = ((state.h / 100) * vh) / GLYPH_H; // px per glyph unit
  const cx = state.sx * vw, cy = state.sy * vh;
  let k = 1;
  for (const x of [-cx, vw - cx]) {
    for (const y of [-cy, vh - cy]) {
      k = Math.max(k, Math.hypot(x / (ELLIPSE.rx * px), y / (ELLIPSE.ry * px)));
    }
  }
  const grow = 1 + (k - 1) * state.ellipseCover;
  return { rx: ELLIPSE.rx * grow, ry: ELLIPSE.ry * grow };
}
