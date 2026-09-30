import { easeCubic } from "@/lib/scrub";

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

/**
 * The inside of the mark as one closed loop, clockwise from the top: B's inner curve, the gap to
 * D, D's inner curve, across to C, C's inner curve, the gap to A, A's inner curve, and back across
 * the top gap (glyph units, lifted from MONOGRAM). The cadence dial runs round it, pulled in
 * towards the counter's centre by RHYTHM_INSET so the rim sits just inside the outline.
 */
export const INNER_LOOP =
  "M396.647 146.5C431.647 160.5 505.647 218.6 521.647 337L528 387.5C536.453 624.5 410 722.525 274.955 683" +
  "L238.767 670C173.767 630.5 140.5 485.5 140.5 436.5L140.095 387.501C141.695 157.101 286.095 125.501 358.095 138.501Z";
export const COUNTER_CENTRE: Point = { x: 334, y: 412 };
/** the counter's extent around its centre, in glyph units */
export const COUNTER = { left: 140, right: 528, top: 138, bottom: 690 } as const;
export const RHYTHM_INSET = 0.94;

export type Pose = { anchor: Point; sx: number; sy: number; h: number };

/**
 * 05 · the mark to the left, sized so the whole counter sits below the header with room to spare,
 * and far enough in that the counter is never cut by the left edge; the copy takes the right.
 */
export function betweenPose(vw: number, vh: number, nav = vw >= 1024 ? 88 : 72): Pose {
  const px = (vh - nav - vh * 0.1) / (COUNTER.bottom - COUNTER.top);
  const cx = Math.max((COUNTER_CENTRE.x - COUNTER.left) * px + 32, vw * 0.33);
  const cy = nav + (vh - nav) / 2;
  return { anchor: COUNTER_CENTRE, sx: cx / vw, sy: cy / vh, h: ((px * GLYPH_H) / vh) * 100 };
}

/** A glyph point on screen for a rotation-free pose. */
export function glyphToScreen(p: Point, pose: Pose, vw: number, vh: number) {
  const px = ((pose.h / 100) * vh) / GLYPH_H;
  return { x: pose.sx * vw + (p.x - pose.anchor.x) * px, y: pose.sy * vh + (p.y - pose.anchor.y) * px, px };
}

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
/**
 * The three holds inside the photographs, fitted to the storyboard frames: a point on each band
 * (glyph units — a piece's box centre sits in the hole, these do not), where it sits on screen,
 * and the pre-rotation height of the mark (vh).
 */
const IN_C = { anchor: { x: 112, y: 637 } as Point, sx: 0.69, sy: 0.68, h: 403 };
const IN_D = { anchor: { x: 537, y: 596 } as Point, sx: 0.43, sy: 0.67, h: 446 };
const IN_B = { anchor: { x: 568, y: 162 } as Point, sx: 0.525, sy: 0.54, h: 425 };
/** where on the continuation track the camera rests in each photograph (the photos drift across these) */
export const PHOTO_HOLDS = { C: [0.7, 0.76], D: [0.82, 0.88], B: [0.94, 1] } as const;
const { C: HC, D: HD, B: HB } = PHOTO_HOLDS;

/** The storyboard for a viewport: 05 depends on its size; everything else is in viewport fractions. */
export const motifKeyframes = (vw: number, vh: number): Keyframe[] => {
  const between = betweenPose(vw, vh);
  const BETWEEN_KEY = { anchor: between.anchor, sx: between.sx, sy: between.sy, h: between.h };
  return [
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
    // between pieces it pulls back a little so the move reads as one camera, not a cut.
    // C holds the dinner, D the breakfast, B the roundtable — the order the captions run in.
    { track: "continuation", at: HC[0], ...IN_C, ellipse: 0, outline: 0 },
    { track: "continuation", at: HC[1], ...IN_C },
    { track: "continuation", at: 0.79, ...CENTRE, sx: 0.5, sy: 0.5, h: 150, ease: linear },
    { track: "continuation", at: HD[0], ...IN_D, ease: linear },
    { track: "continuation", at: HD[1], ...IN_D },
    { track: "continuation", at: 0.91, ...CENTRE, sx: 0.5, sy: 0.5, h: 150, ease: linear },
    { track: "continuation", at: HB[0], ...IN_B, ease: linear },
    { track: "continuation", at: HB[1], ...IN_B },
    // 05 · between: upright again, outline only, at the left, framing the cadence dial
    { track: "between", at: 0, ...BETWEEN_KEY, rot: 0, outline: 1, photo: 0, gold: 0, ellipseCover: 0 },
    { track: "between", at: 1, ...BETWEEN_KEY, outline: 1 },

  ];
};

// ── resolution ────────────────────────────────────────────────────────────────
export type TrackRect = { top: number; height: number };
export type TrackRects = Record<TrackKey, TrackRect>;
export type Resolved = { y: number; state: MotifState; ease: Ease; outlineEase?: Ease };

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
  const outlineE = b.outlineEase && span > 0 ? b.outlineEase((y - a.y) / span) : e;
  const A = a.state, B = b.state;
  return {
    ax: mix(A.ax, B.ax, e), ay: mix(A.ay, B.ay, e),
    sx: mix(A.sx, B.sx, e), sy: mix(A.sy, B.sy, e),
    h: mixLog(A.h, B.h, e), rot: mix(A.rot, B.rot, e),
    outline: mix(A.outline, B.outline, outlineE), photo: mix(A.photo, B.photo, e), gold: mix(A.gold, B.gold, e),
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


export type MotifDock = { x: number; y: number; height: number };
export type LaterGeometry = {
  intelligence: TrackRect;
  pulse: TrackRect;
  membership: TrackRect;
  membershipPanels: TrackRect;
  process: TrackRect;
  request: TrackRect;
  peopleDock: MotifDock;
  membershipDock: MotifDock;
};

/** Continue the original camera from the cadence hold; no replacement glyph or handoff. */
export function continueMotif(frames: Resolved[], g: LaterGeometry, vw: number, vh: number): Resolved[] {
  const last = frames[frames.length - 1];
  const base = { ...last.state, ax: GLYPH_CENTRE.x, ay: GLYPH_CENTRE.y, rot: 0 };
  const add = (y: number, pose: Partial<MotifState>, ease: Ease = easeCubic) => {
    frames.push({ y, state: { ...base, ...pose }, ease });
  };
  // The large cadence outline moves across to become the quiet, cropped right-hand motif.
  // Its actual curves provide the background texture through both editorial sections.
  const field = { sx: 1.04, sy: .43, h: 180, outline: .16 };
  add(g.intelligence.top + vh * .12, field);
  add(Math.max(g.intelligence.top + vh * .13, g.pulse.top - vh * .55), field, linear);
  add(g.pulse.top + vh * .12, { ...field, outline: .14 });
  const arrival = Math.max(g.pulse.top + vh * .4, g.peopleDock.y - vh * .68);
  const dock = (d: MotifDock, y: number) => ({ sx: d.x / vw, sy: (d.y - y) / vh, h: d.height / vh * 100, outline: 1 });
  add(Math.max(g.pulse.top + vh * .13, arrival - vh * .9), { ...field, outline: .14 }, linear);
  add(arrival, dock(g.peopleDock, arrival));
  // Stay quiet while crossing the outer seats; brighten only during the final approach.
  // Opacity has its own timing so the existing camera trajectory stays unchanged.
  frames[frames.length - 1].outlineEase = (v) => easeCubic(Math.max(0, Math.min(1, (v - .8) / .2)));
  const leave = Math.max(arrival + 1, g.membership.top - vh * .85);
  add(leave, dock(g.peopleDock, leave), linear);
  const sealArrival = Math.max(leave + vh * .5, g.membershipDock.y - vh * .53);
  add(sealArrival, dock(g.membershipDock, sealArrival));
  // Hold the seal until the membership panels reach the top of the reading area.
  // Then expand behind those panels on the way into the process section.
  const sealLeave = Math.max(sealArrival + 1, g.membershipPanels.top - vh * .12);
  add(sealLeave, dock(g.membershipDock, sealLeave), linear);
  const processApproach = Math.max(sealLeave + vh * .6, g.process.top - vh * .6);
  const processPose = { sx: .94, sy: .54, h: 110, outline: .1 };
  add(processApproach, processPose);
  add(g.process.top, processPose, linear);
  // A slow drift accompanies the four existing step reveals without competing with them.
  const processSpan = Math.max(0, g.process.height - vh);
  add(g.process.top + processSpan * .35, { ...processPose, sx: .90, h: 114 });
  add(g.process.top + processSpan * .7, { ...processPose, sx: .86, h: 118 });
  add(g.process.top + processSpan, { ...processPose, sx: .82, h: 122 });
  // Turn the original mark on its side to frame the invitation in its open counter.
  const requestSpan = Math.max(0, g.request.height - vh);
  const closingHeight = Math.max(120, Math.min(190, (vw * .72 * GLYPH_H) / (vh * (COUNTER.bottom - COUNTER.top)) * 100));
  const close = { sx: .5, sy: .55, h: closingHeight, rot: 90, outline: .38 };
  add(g.request.top + requestSpan * .14, { ...close, outline: .2 });
  add(g.request.top + requestSpan * .56, close);
  add(g.request.top + requestSpan, close, linear);
  // Release with the closing stage rather than leaving a fixed mark over the footer.
  add(g.request.top + g.request.height, { ...close, sy: close.sy - 1, outline: 0 }, linear);
  return frames;
}
