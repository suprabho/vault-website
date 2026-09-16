"use client";

import { useEffect, useRef } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { useStillMedia } from "@/hooks/useStillMedia";
import { easeCubic, t, trackProgress } from "@/lib/scrub";
import styles from "./Request.module.css";

type Key = "A" | "B" | "C" | "D";
// wide starting positions: the pieces begin out at the edges of the viewport and drift in as the stage opens
const OFF: Record<Key, [number, number]> = { A: [-330, -260], B: [340, -280], C: [-350, 300], D: [330, 270] };
const DROP = 420;
const REST = 0.38;

/** 12 · pinned close: the identity assembles around the invitation, holds, then releases into the footer. */
export default function Request() {
  const still = useStillMedia("(prefers-reduced-motion:reduce)");
  const track = useRef<HTMLDivElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);
  const pieces = useRef<Record<Key, SVGGElement | null>>({ A: null, B: null, C: null, D: null });

  useEffect(() => {
    if (still === null) return;
    const tr = track.current, A = art.current, cp = copy.current, ct = cta.current;
    if (!tr || !A || !cp || !ct) return;
    const P = pieces.current;
    const imgs = Array.from(tr.querySelectorAll<SVGImageElement>("image"));
    const lines = Array.from(tr.querySelectorAll<SVGPathElement>(`.${styles.rl}`));
    const place = (k: Key, e: number, drop = 0) => {
      const o = OFF[k], el = P[k];
      if (el) el.style.transform = `translate(${(o[0] * e).toFixed(1)}px,${(o[1] * e + drop).toFixed(1)}px)`;
    };

    if (still) {
      (Object.keys(P) as Key[]).forEach((k) => place(k, REST));
      imgs.forEach((i) => (i.style.opacity = "0.18"));
      cp.style.opacity = "1"; cp.classList.add("in");
      ct.style.opacity = "1"; ct.style.transform = "none";
      A.style.opacity = "1";
      return;
    }

    const at = (pr: number) => {
      const born = easeCubic(t(pr, 0, 0.16)); // stage is fully on screen before anything shows
      A.style.opacity = born.toFixed(3);
      // gather from the edges to a resting composition that keeps clear air around the copy — then hold
      const sep = 1 - (1 - REST) * easeCubic(t(pr, 0.14, 0.7));
      (Object.keys(P) as Key[]).forEach((k) => place(k, sep, DROP * (1 - born)));
      lines.forEach((l) => (l.style.strokeOpacity = (0.42 + (0.28 * (1 - sep)) / (1 - REST)).toFixed(3)));
      imgs.forEach((i) => (i.style.opacity = (0.2 * t(pr, 0.5, 0.72)).toFixed(3)));
      // the invitation appears between the pieces, and the button lands last; both stay
      const c = t(pr, 0.16, 0.32);
      cp.style.opacity = c.toFixed(3);
      cp.style.transform = `translateY(${(10 - 10 * c).toFixed(1)}px)`;
      if (c > 0 && !cp.classList.contains("in")) cp.classList.add("in");
      const b = t(pr, 0.42, 0.56);
      ct.style.opacity = b.toFixed(3);
      ct.style.transform = `translateY(${(8 - 8 * b).toFixed(1)}px)`;
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        at(trackProgress(tr));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [still]);

  return (
    <section id="request" className={`c5 ${styles.request}`}>
      <div className={styles.track} ref={track}>
        <div className={styles.stage}>
          <div className={styles.field} aria-hidden="true" />
          {/* the identity assembles around the invitation: four pieces, one letter */}
          <svg className={styles.art} ref={art} viewBox="0 0 662 827" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <clipPath id="rqA" clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.A} /></clipPath>
              <clipPath id="rqD" clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.D} /></clipPath>
            </defs>
            <g className={styles.rp} ref={(el) => { pieces.current.A = el; }}>
              <g clipPath="url(#rqA)">
                <image className={styles.rqImg} x="-6" y="-11" width="370" height="405" preserveAspectRatio="xMidYMid slice" href="/images/private-dinner.webp" />
              </g>
              <path className={styles.rl} d={MONOGRAM.A} />
            </g>
            <g className={styles.rp} ref={(el) => { pieces.current.B = el; }}>
              <path className={styles.rl} d={MONOGRAM.B} />
            </g>
            <g className={styles.rp} ref={(el) => { pieces.current.C = el; }}>
              <path className={styles.rl} d={MONOGRAM.C} />
            </g>
            <g className={styles.rp} ref={(el) => { pieces.current.D = el; }}>
              <g clipPath="url(#rqD)">
                <image className={styles.rqImg} x="269" y="381" width="396" height="449" preserveAspectRatio="xMidYMid slice" href="/images/executive-breakfast.webp" />
              </g>
              <path className={styles.rl} d={MONOGRAM.D} />
            </g>
          </svg>
          <div className={`c5-sheet ${styles.copy}`} ref={copy}>
            <span className="c5-lab">12 — Request consideration</span>
            <h2 className={`c5-h2 ${styles.h2}`}>
              <span className="c5-ln"><span>If this is your room,</span></span>
              <span className="c5-ln"><span>tell us why.</span></span>
            </h2>
            <p className="c5-copy">
              Vault is built for professionals who believe the most valuable conversations in crypto compliance should
              continue after the conference ends.
            </p>
            <a className={`btn btn-primary ${styles.cta}`} href="#" ref={cta}>
              Request consideration
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
