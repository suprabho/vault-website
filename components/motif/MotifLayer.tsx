"use client";

import { useEffect, useRef } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { useStillMedia } from "@/hooks/useStillMedia";
import {
  ELLIPSE,
  GLYPH_CENTRE,
  MOTIF_KEYFRAMES,
  camera,
  ellipseRadii,
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
const PHOTOS: Record<"A" | "C" | "D", string> = {
  A: "/images/private-dinner.webp",
  C: "/images/roundtable.webp",
  D: "/images/executive-breakfast.webp",
};
/** the photographs are cut with transparent margins; this sits under them so nothing shows through */
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
  const oval = useRef<SVGEllipseElement>(null);
  const phG = useRef<SVGGElement>(null);
  const gold = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (still !== false) return;
    const L = layer.current, S = svg.current, oG = outG.current, pG = phG.current, el = oval.current;
    if (!L || !S || !oG || !pG || !el) return;

    let frames: Resolved[] = [];
    const measure = () => {
      const tracks = {} as TrackRects;
      for (const k of TRACKS) {
        const t = document.querySelector<HTMLElement>(`[data-motif-track="${k}"]`);
        if (!t) return;
        tracks[k] = { top: t.getBoundingClientRect().top + window.scrollY, height: t.offsetHeight };
      }
      const pieces = {} as Record<Piece, Point>;
      for (const k of PIECES) {
        const p = outPaths.current[k];
        if (!p) return;
        const b = p.getBBox();
        pieces[k] = b.width ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : GLYPH_CENTRE;
      }
      frames = resolve(MOTIF_KEYFRAMES, tracks, window.innerHeight, pieces);
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
      pG.style.opacity = s.photo.toFixed(3);
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
          {(Object.keys(PHOTOS) as ("A" | "C" | "D")[]).map((k) => (
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
          <g clipPath="url(#motif-clip-A)">
            <path d={MONOGRAM.A} fill={UNDER} />
            <image x="-6" y="-11" width="370" height="405" preserveAspectRatio="xMidYMid slice" href={PHOTOS.A} />
          </g>
          <g clipPath="url(#motif-clip-C)">
            <path d={MONOGRAM.C} fill={UNDER} />
            <image x="-3" y="430" width="248" height="374" preserveAspectRatio="xMidYMid slice" href={PHOTOS.C} />
          </g>
          <g clipPath="url(#motif-clip-D)">
            <path d={MONOGRAM.D} fill={UNDER} />
            <image x="269" y="381" width="396" height="449" preserveAspectRatio="xMidYMid slice" href={PHOTOS.D} />
          </g>
          <path ref={gold} d={MONOGRAM.B} fill="#C3AE87" style={{ opacity: 0 }} />
          {PIECES.map((k) => (
            <path key={k} d={MONOGRAM[k]} {...STROKE} />
          ))}
        </g>
      </svg>
    </div>
  );
}
