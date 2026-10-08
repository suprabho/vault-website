/**
 * Stage geometry for 02 → 04 (components/sections/Signals.tsx), after the Figma storyboard
 * "The Vault — Scroll storyboard". Landscape screens keep the arrangement of the earlier
 * 1440 × 900 frames; portrait screens follow the storyboard's 1080 × 1440 frames.
 *
 * The mark takes three poses: small beside the intro; larger on the right, holding each theme's
 * photograph and then the room's; and finally grown and centred, where its foot opens into the
 * window. The dinner photograph is pinned to the screen rather than to the mark, so the window
 * shows the same picture the mark was holding, and becomes the full frame, then three panels.
 */

export type Rect = { x: number; y: number; w: number; h: number };
/** where the mark sits: its centre on screen, and its height (the full 662 × 827 glyph box) */
export type Pose = { cx: number; cy: number; h: number };
export type MarkPose = "intro" | "topic" | "focus";

/** the glyph's own box: every MONOGRAM path lives in 662 × 827 */
const GW = 662, GH = 827;
/** the foot of the mark (piece D's bottom-right block), in glyph units: the square that glows */
const FOOT: Rect = { x: 539.75, y: 677.366, w: 118.898, h: 146.634 };

export const navHeight = (vw: number) => (vw >= 1024 ? 88 : 72);
const gutter = (vw: number) => (vw >= 1440 ? 72 : vw >= 768 ? 40 : 20);
/** the storyboard's portrait frames apply when the screen is at least as tall as it is wide (CSS `orientation: portrait`) */
export const isPortrait = (vw: number, vh: number) => vh >= vw;

export type SignalsGeometry = {
  portrait: boolean;
  mark: Record<MarkPose, Pose>;
  /** the full image window, and the photograph behind it (the window plus a margin of overscan) */
  window: Rect;
  photo: Rect;
  /** space between the three panels */
  gap: number;
};

const inflate = (r: Rect, x: number, y: number): Rect => ({ x: r.x - x, y: r.y - y, w: r.w + 2 * x, h: r.h + 2 * y });

export function signalsGeometry(vw: number, vh: number): SignalsGeometry {
  const nav = navHeight(vw);

  if (isPortrait(vw, vh)) {
    // 1080 × 1440 frames: sizes scale to fit (u), heights on the frame spread over the screen's (v).
    // Mirrored as --u / --v in Signals.module.css.
    const u = Math.min(vw / 1080, vh / 1440), v = vh / 1440;
    const ox = (vw - 1080 * u) / 2;
    const pose = (x: number, y: number, h: number): Pose => ({ cx: ox + x * u, cy: y * v, h: h * u });
    const m = Math.max(10, 24 * u);
    const win = { x: m, y: nav + m, w: vw - 2 * m, h: vh - nav - 2 * m };
    return {
      portrait: true,
      mark: { intro: pose(911, 543.9, 249.85), topic: pose(734, 617.5, 737.05), focus: pose(539, 686.2, 1074.35) },
      window: win,
      photo: inflate(win, m, m),
      gap: Math.max(8, 24 * u),
    };
  }

  // 1440 × 900 frames, scaled to contain
  const s = Math.min(vw / 1440, vh / 900);
  // the canvas column (.canvas): the mark's centre sits 71% of the way across it
  const g = gutter(vw);
  const left = Math.max((vw - 1280) / 2, 0) + g;
  const width = Math.min(vw, 1280) - 2 * g;
  const cx = left + ((961.6 - 152) / 1136) * width;
  const cy = (nav + vh) / 2;
  // the window: 27px clear of the header and the foot of the screen, the photograph's aspect at most
  const m = 27 * s;
  const h = vh - nav - 2 * m;
  const w = Math.min((vw * 1253) / 1440, (h * 1253) / 758);
  const win = { x: (vw - w) / 2, y: nav + m, w, h };
  return {
    portrait: false,
    mark: { intro: { cx, cy, h: 306 * s }, topic: { cx, cy, h: 576 * s }, focus: { cx: vw / 2, cy, h: 774 * s } },
    window: win,
    photo: inflate(win, (w * 37.59) / 1253, (h * 22.74) / 758),
    gap: (w * 23.67) / 1253,
  };
}

/** The SVG transform that draws the glyph at `pose`. */
export function markTransform({ cx, cy, h }: Pose) {
  const k = h / GH;
  return `translate(${(cx - (GW / 2) * k).toFixed(2)} ${(cy - (GH / 2) * k).toFixed(2)}) scale(${k.toFixed(5)})`;
}

/** The foot square on screen, for the mark at `pose`. */
export function footRect({ cx, cy, h }: Pose): Rect {
  const k = h / GH;
  return { x: cx + (FOOT.x - GW / 2) * k, y: cy + (FOOT.y - GH / 2) * k, w: FOOT.w * k, h: FOOT.h * k };
}

/** Between two poses: the centre moves evenly, the size at a constant rate. */
export const mixPose = (a: Pose, b: Pose, e: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * e,
  cy: a.cy + (b.cy - a.cy) * e,
  h: a.h * Math.pow(b.h / a.h, e),
});

export const lerpRect = (a: Rect, b: Rect, e: number): Rect => ({
  x: a.x + (b.x - a.x) * e,
  y: a.y + (b.y - a.y) * e,
  w: a.w + (b.w - a.w) * e,
  h: a.h + (b.h - a.h) * e,
});
