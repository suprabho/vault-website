/**
 * Stage geometry for 02 → 04 (components/sections/Signals.tsx), fitted to the Figma storyboard
 * "Experiment 2 — Intelligence → The Room → Experiences" (1440 × 900 frames).
 *
 * The mark keeps one centre through every beat — level with the middle of the space under the
 * header, on the right of the canvas — and only changes size: small beside the intro, holding
 * the photographs for the three themes, larger again for the room. The dinner photograph is
 * pinned to the screen rather than to the mark, so the window that opens from the mark's foot
 * shows the same picture the mark was holding, and becomes the full frame, then three panels.
 */

export type Rect = { x: number; y: number; w: number; h: number };

/** the glyph's own box: every MONOGRAM path lives in 662 × 827 */
const GW = 662, GH = 827;
/** the foot of the mark (piece D's bottom-right block), in glyph units: the square that glows */
const FOOT: Rect = { x: 539.75, y: 677.366, w: 118.898, h: 146.634 };

/** Figma: the mark's height in each pose (the full 662 × 827 box), at 1440 × 900 */
const MARK_H = { intro: 306, topic: 576, room: 774 } as const;
export type MarkPose = keyof typeof MARK_H;

export const navHeight = (vw: number) => (vw >= 1024 ? 88 : 72);
const gutter = (vw: number) => (vw >= 1440 ? 72 : vw >= 768 ? 40 : 20);

export type SignalsGeometry = {
  /** scale against the 1440 × 900 frame (contain) */
  s: number;
  /** the mark's centre on screen */
  cx: number;
  cy: number;
  /** the mark's height in each pose */
  mark: Record<MarkPose, number>;
  /** the full image window, and the photograph behind it (the window plus a little overscan) */
  window: Rect;
  photo: Rect;
  /** space between the three panels */
  gap: number;
};

export function signalsGeometry(vw: number, vh: number): SignalsGeometry {
  const nav = navHeight(vw);
  const s = Math.min(vw / 1440, vh / 900);
  // the canvas column (.canvas): Figma's mark centre sits 71% of the way across it
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
  const ox = (w * 37.59) / 1253, oy = (h * 22.74) / 758;
  return {
    s,
    cx,
    cy,
    mark: { intro: MARK_H.intro * s, topic: MARK_H.topic * s, room: MARK_H.room * s },
    window: win,
    photo: { x: win.x - ox, y: win.y - oy, w: w + 2 * ox, h: h + 2 * oy },
    gap: (w * 23.67) / 1253,
  };
}

/** The SVG transform that draws the glyph `height` px tall, centred on (cx, cy). */
export function markTransform(cx: number, cy: number, height: number) {
  const k = height / GH;
  return `translate(${(cx - (GW / 2) * k).toFixed(2)} ${(cy - (GH / 2) * k).toFixed(2)}) scale(${k.toFixed(5)})`;
}

/** The foot square on screen, for the mark `height` px tall centred on (cx, cy). */
export function footRect(cx: number, cy: number, height: number): Rect {
  const k = height / GH;
  return { x: cx + (FOOT.x - GW / 2) * k, y: cy + (FOOT.y - GH / 2) * k, w: FOOT.w * k, h: FOOT.h * k };
}

export const lerpRect = (a: Rect, b: Rect, e: number): Rect => ({
  x: a.x + (b.x - a.x) * e,
  y: a.y + (b.y - a.y) * e,
  w: a.w + (b.w - a.w) * e,
  h: a.h + (b.h - a.h) * e,
});
