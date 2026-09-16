"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  className?: string;
  pathClassName?: string;
  children: ReactNode;
} & Record<`data-${string}`, unknown>;

/**
 * Lays the rhythm items across the grid and draws one architectural path
 * beneath them, routed from the markers' real positions. The path traces
 * itself once the wrapper receives the `in` class from the reveal observer.
 */
export default function RhythmPath({ className, pathClassName, children, ...rest }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const rhy = wrap.current;
    const p = path.current;
    if (!rhy || !p) return;
    const still = window.matchMedia("(max-width:899px),(prefers-reduced-motion:reduce)");
    const items = Array.from(rhy.querySelectorAll<HTMLElement>("[data-marker]"));

    const build = () => {
      const r = rhy.getBoundingClientRect();
      const pts = items.map((mk) => {
        const m = mk.querySelector("i")!.getBoundingClientRect();
        const b = mk.parentElement!.getBoundingClientRect();
        return [m.left - r.left + m.width / 2, m.top - r.top + m.height / 2, b.bottom - r.top];
      });
      // same band: up into the lane above the higher marker, across, down.
      // next band: down into the gap between the bands, across, down.
      const LANE = 30;
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const y = b[1] > a[2] ? (a[2] + b[1]) / 2 - 8 : Math.min(a[1], b[1]) - LANE;
        d += ` V${y.toFixed(1)} H${b[0].toFixed(1)} V${b[1].toFixed(1)}`;
      }
      p.setAttribute("d", d);
      const L = p.getTotalLength();
      p.style.strokeDasharray = String(L);
      p.style.strokeDashoffset = rhy.classList.contains("in") ? "0" : String(L);
      p.style.transition = "stroke-dashoffset 2200ms cubic-bezier(.2,.75,.2,1) 150ms";
    };
    const draw = () => {
      if (rhy.classList.contains("in")) p.style.strokeDashoffset = "0";
    };
    const all = () => {
      if (still.matches) p.style.transition = "none";
      build();
      draw();
    };

    const mo = new MutationObserver(draw);
    mo.observe(rhy, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", all, { passive: true });
    document.fonts?.ready.then(all);
    all();
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", all);
    };
  }, []);

  return (
    <div ref={wrap} className={className} {...rest}>
      <svg className={pathClassName} aria-hidden="true">
        <path ref={path} fill="none" stroke="#C3AE87" strokeWidth="1" />
      </svg>
      {children}
    </div>
  );
}
