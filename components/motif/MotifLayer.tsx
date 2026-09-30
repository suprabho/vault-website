"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { useStillMedia } from "@/hooks/useStillMedia";
import {
  ELLIPSE,
  GLYPH_CENTRE,
  PHOTO_HOLDS,
  camera,
  ellipseRadii,
  keyframeY,
  motifKeyframes,
  resolve,
  sample,
  type Piece,
  type Point,
  type Resolved,
  type TrackKey,
  type TrackRects,
} from "@/lib/motif";
import styles from "./MotifLayer.module.css";

const PIECES: Piece[] = ["A", "B", "C", "D"];
/**
 * The photographs. The mark is on its side for the whole dive, so each one is turned back by the
 * same 90° and reads upright on screen. Rects are in that turned frame (glyph units, as the camera
 * sees it). Each image is built by scripts/motif-photos.py: the photograph framed on where the
 * camera holds, feathered into a blurred mirror of itself that fills the rest of the piece and an
 * overscan margin round it — rerun the script and copy its rects here if the framing changes.
 */
type Photo = "B" | "C" | "D";
type Drift = { x0: string; y0: string; x1: string; y1: string; dur: string; delay: string };
const PHOTOS: Record<Photo, { href: string; x: number; y: number; w: number; h: number; drift: Drift }> = {
  B: {
    href: "/images/motif-roundtable.webp", x: 387.5, y: 463.4, w: 374.1, h: 293.4,
    drift: { x0: "-1.2%", y0: "0.6%", x1: "1.2%", y1: "-0.8%", dur: "21s", delay: "-6s" },
  },
  C: {
    href: "/images/motif-dinner.webp", x: -74.7, y: 71.4, w: 404.3, h: 264.1,
    drift: { x0: "1.4%", y0: "-0.6%", x1: "-1%", y1: "0.8%", dur: "24s", delay: "-3s" },
  },
  D: {
    href: "/images/motif-breakfast.webp", x: -105.7, y: 334.5, w: 488.9, h: 429.6,
    drift: { x0: "-0.8%", y0: "-0.8%", x1: "1.4%", y1: "0.6%", dur: "19s", delay: "-11s" },
  },
};
/**
 * Scroll parallax: across its hold (and one hold-length either side) a photograph rises inside
 * its piece by twice this share of its height. The images carry just over 5% of overscan on every
 * side; this plus the drift loop's pan stays inside it, so a photo never pulls away from an edge.
 */
const PARALLAX = 0.03;
const UPRIGHT = `rotate(-90 ${GLYPH_CENTRE.x} ${GLYPH_CENTRE.y})`;
/** sits under the photographs so nothing shows through while they load */
const UNDER = "#0b0a17";
const TRACKS: TrackKey[] = ["hero", "problem", "continuation", "between"];
const STROKE = { fill: "none", stroke: "#C3AE87", strokeWidth: 1, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const };

/**
 * The motif. One fixed layer, painted between the section backgrounds and their copy, in which
 * the monogram is framed by a viewBox camera: keyframes from lib/motif.ts, keyed to the
 * `[data-motif-track]` sections. Nothing here uses React state per frame — the scroll handler
 * writes attributes and styles directly, like the section scrubs do.
 *
 * Everything lives in one SVG so the outline, the cream ellipse and the photographs share a
 * single frame. The ellipse is drawn at the glyph centre and left out of the rotation, so it
 * tracks the mark at every zoom while keeping the orientation the storyboard gives it.
 */
export default function MotifLayer() {
  const still = useStillMedia();
  const layer = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const outG = useRef<SVGGElement>(null);
  const outPaths = useRef<Record<Piece, SVGPathElement | null>>({ A: null, B: null, C: null, D: null });
  const pieceMetrics = useRef<Record<Piece, { centre: Point; length: number }> | null>(null);
  const oval = useRef<SVGEllipseElement>(null);
  const phG = useRef<SVGGElement>(null);
  const gold = useRef<SVGPathElement>(null);
  const shift = useRef<Record<Photo, SVGGElement | null>>({ B: null, C: null, D: null });

  useEffect(() => {
    if (still !== false) return;
    const L = layer.current, S = svg.current, oG = outG.current, pG = phG.current, el = oval.current;
    if (!L || !S || !oG || !pG || !el) return;

    let frames: Resolved[] = [];
    let holds: Record<Photo, readonly [number, number]> | null = null;
    const measure = () => {
      const tracks = {} as TrackRects;
      for (const k of TRACKS) {
        const t = document.querySelector<HTMLElement>(`[data-motif-track="${k}"]`);
        if (!t) return;
        tracks[k] = { top: t.getBoundingClientRect().top + window.scrollY, height: t.offsetHeight };
      }
      const pieces = {} as Record<Piece, Point>;
      const metrics = {} as Record<Piece, { centre: Point; length: number }>;
      for (const k of PIECES) {
        const p = outPaths.current[k];
        if (!p) return;
        const b = p.getBBox();
        pieces[k] = b.width ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : GLYPH_CENTRE;
        metrics[k] = { centre: pieces[k], length: p.getTotalLength() };
      }
      pieceMetrics.current = metrics;
      const vh = window.innerHeight;
      frames = resolve(motifKeyframes(window.innerWidth, vh), tracks, vh, pieces);
      const at = (k: Photo) => PHOTO_HOLDS[k].map((a) => keyframeY(tracks.continuation, a, vh)) as [number, number];
      holds = { B: at("B"), C: at("C"), D: at("D") };
    };

    const draw = () => {
      if (!frames.length) return;
      const s = sample(frames, window.scrollY);
      const shown = s.outline > 0.001 || s.photo > 0.001 || s.ellipse > 0.001;
      L.style.visibility = shown ? "visible" : "hidden";
      if (!shown) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const cam = camera(s, vw, vh);
      S.setAttribute("viewBox", cam.viewBox);
      const rot = `rotate(${cam.rotate.toFixed(3)} ${GLYPH_CENTRE.x} ${GLYPH_CENTRE.y})`;
      oG.setAttribute("transform", rot);
      pG.setAttribute("transform", rot);
      oG.style.opacity = s.outline.toFixed(3);
      const metrics = pieceMetrics.current;
      if (metrics) {
        const margin = Math.min(cam.w, cam.h) * 0.08;
        const corners: Record<Piece, Point> = {
          A: { x: cam.x - margin, y: cam.y - margin },
          B: { x: cam.x + cam.w + margin, y: cam.y - margin },
          C: { x: cam.x - margin, y: cam.y + cam.h + margin },
          D: { x: cam.x + cam.w + margin, y: cam.y + cam.h + margin },
        };
        PIECES.forEach((k, index) => {
          const path = outPaths.current[k];
          if (!path) return;
          if (s.assemble >= 0.999) {
            path.removeAttribute("transform");
            path.style.removeProperty("stroke-dasharray");
            path.style.removeProperty("stroke-dashoffset");
            return;
          }
          const { centre, length } = metrics[k];
          const move = Math.max(0, Math.min(1, s.assemble * 1.08 - index * 0.025));
          const draw = Math.max(0, Math.min(1, s.assemble * 1.22 - index * 0.055));
          const dx = (corners[k].x - centre.x) * (1 - move);
          const dy = (corners[k].y - centre.y) * (1 - move);
          path.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
          path.style.strokeDasharray = `${length.toFixed(2)} ${length.toFixed(2)}`;
          path.style.strokeDashoffset = (length * (1 - draw)).toFixed(2);
        });
      }
      pG.style.opacity = s.photo.toFixed(3);
      // the drift loop only runs while the photographs are up
      const photos = s.photo > 0.001 ? "on" : "";
      if (L.dataset.photos !== photos) L.dataset.photos = photos;
      if (photos && holds) {
        for (const k of Object.keys(PHOTOS) as Photo[]) {
          const [a, b] = holds[k], g = shift.current[k];
          if (!g) continue;
          const t = Math.max(-1, Math.min(1, (window.scrollY - (a + b) / 2) / Math.max(b - a, 1)));
          g.setAttribute("transform", `translate(0 ${(-t * PARALLAX * PHOTOS[k].h).toFixed(2)})`);
        }
      }
      if (gold.current) gold.current.style.opacity = s.gold.toFixed(3);
      const r = ellipseRadii(s, vw, vh);
      el.setAttribute("rx", r.rx.toFixed(2));
      el.setAttribute("ry", r.ry.toFixed(2));
      el.style.opacity = s.ellipse.toFixed(3);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        draw();
        ticking = false;
      });
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    // late layout shifts above a track (images, fonts) move every keyframe: re-measure
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [still]);

  if (still !== false) return null;

  return (
    <div ref={layer} className={styles.layer} aria-hidden="true">
      <svg ref={svg} className={styles.svg} viewBox="0 0 662 827" preserveAspectRatio="none">
        <defs>
          {(Object.keys(PHOTOS) as Photo[]).map((k) => (
            <clipPath key={k} id={`motif-clip-${k}`} clipPathUnits="userSpaceOnUse">
              <path d={MONOGRAM[k]} />
            </clipPath>
          ))}
        </defs>

        <g ref={outG}>
          {PIECES.map((k) => (
            <path key={k} ref={(n) => { outPaths.current[k] = n; }} d={MONOGRAM[k]} {...STROKE} />
          ))}
        </g>

        <ellipse
          ref={oval}
          cx={GLYPH_CENTRE.x}
          cy={GLYPH_CENTRE.y}
          rx={ELLIPSE.rx}
          ry={ELLIPSE.ry}
          fill="#f2f1f3"
          style={{ opacity: 0 }}
        />

        <g ref={phG} style={{ opacity: 0 }}>
          {(Object.keys(PHOTOS) as Photo[]).map((k) => {
            const ph = PHOTOS[k];
            return (
              <g key={k} clipPath={`url(#motif-clip-${k})`}>
                <path d={MONOGRAM[k]} fill={UNDER} />
                <g transform={UPRIGHT}>
                  <g ref={(n) => { shift.current[k] = n; }}>
                    <image
                      className={styles.photo}
                      style={{
                        "--x0": ph.drift.x0, "--y0": ph.drift.y0, "--x1": ph.drift.x1, "--y1": ph.drift.y1,
                        "--dur": ph.drift.dur, "--delay": ph.drift.delay,
                      } as CSSProperties}
                      x={ph.x}
                      y={ph.y}
                      width={ph.w}
                      height={ph.h}
                      preserveAspectRatio="xMidYMid slice"
                      href={ph.href}
                    />
                  </g>
                </g>
              </g>
            );
          })}
          <path ref={gold} d={MONOGRAM.A} fill="#C3AE87" style={{ opacity: 0 }} />
          {PIECES.map((k) => (
            <path key={k} d={MONOGRAM[k]} {...STROKE} />
          ))}
        </g>
      </svg>
    </div>
  );
}
