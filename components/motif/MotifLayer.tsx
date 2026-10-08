"use client";

import { useEffect, useRef } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { useStillMedia } from "@/hooks/useStillMedia";
import {
  GLYPH_CENTRE,
  camera,
  continueMotif,
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
const TRACKS: TrackKey[] = ["hero", "signals", "between"];
const STROKE = { fill: "none", stroke: "#C3AE87", strokeWidth: 1, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const };

/**
 * The motif. One fixed layer, painted between the section backgrounds and their copy, in which
 * the monogram is framed by a viewBox camera: keyframes from lib/motif.ts, keyed to the
 * `[data-motif-track]` sections. Nothing here uses React state per frame — the scroll handler
 * writes attributes and styles directly, like the section scrubs do.
 *
 * Through 02 → 04 the Signals stage draws the mark itself (it fills it with photographs and opens
 * a window from it); this layer hands over at that section's pin and picks the mark up again for
 * the cadence.
 */
export default function MotifLayer() {
  const still = useStillMedia();
  const layer = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const outG = useRef<SVGGElement>(null);
  const outPaths = useRef<Record<Piece, SVGPathElement | null>>({ A: null, B: null, C: null, D: null });
  const pieceMetrics = useRef<Record<Piece, { centre: Point; length: number }> | null>(null);

  useEffect(() => {
    if (still !== false) return;
    const L = layer.current, S = svg.current, oG = outG.current;
    if (!L || !S || !oG) return;

    let frames: Resolved[] = [];
    let continuationStart = Infinity;
    let disposed = false;
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
      const section = (id: string) => {
        const node = document.getElementById(id);
        return node ? { top: node.getBoundingClientRect().top + window.scrollY, height: node.offsetHeight } : null;
      };
      const dock = (name: string) => {
        const node = document.querySelector<SVGSVGElement>(`[data-motif-dock="${name}"]`);
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY, height: r.height };
      };
      document.documentElement.dataset.motifContinues = "true";
      const intelligence = section("intelligence"), pulse = section("pulse"), membership = section("membership");
      const membershipPanels = section("membership-panels");
      const process = section("process"), request = section("request");
      const peopleDock = dock("people"), membershipDock = dock("membership");
      if (intelligence && pulse && membership && membershipPanels && process && request && peopleDock && membershipDock) {
        continuationStart = frames[frames.length - 1].y;
        frames = continueMotif(frames, { intelligence, pulse, membership, membershipPanels, process, request, peopleDock, membershipDock }, window.innerWidth, vh);
        document.documentElement.dataset.motifContinues = "true";
      }
    };

    const draw = () => {
      if (!frames.length) return;
      const s = sample(frames, window.scrollY);
      L.dataset.continued = window.scrollY >= continuationStart ? "true" : "false";
      const shown = s.outline > 0.001;
      L.style.visibility = shown ? "visible" : "hidden";
      if (!shown) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const cam = camera(s, vw, vh);
      S.setAttribute("viewBox", cam.viewBox);
      const rot = `rotate(${cam.rotate.toFixed(3)} ${GLYPH_CENTRE.x} ${GLYPH_CENTRE.y})`;
      oG.setAttribute("transform", rot);
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
    };

    let ticking = false;
    let raf = 0;
    const onScroll = () => {
      if (disposed || ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        draw();
        ticking = false;
      });
    };
    const onResize = () => {
      if (disposed) return;
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
      disposed = true;
      cancelAnimationFrame(raf);
      delete document.documentElement.dataset.motifContinues;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [still]);

  if (still !== false) return null;

  return (
    <div ref={layer} className={styles.layer} aria-hidden="true">
      <svg ref={svg} className={styles.svg} viewBox="0 0 662 827" preserveAspectRatio="none">
        <g ref={outG}>
          {PIECES.map((k) => (
            <path key={k} ref={(n) => { outPaths.current[k] = n; }} d={MONOGRAM[k]} {...STROKE} />
          ))}
        </g>

      </svg>
    </div>
  );
}
