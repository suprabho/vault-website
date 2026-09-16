"use client";

import { useEffect, useRef } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import { useStillMedia } from "@/hooks/useStillMedia";
import { easeCubic, t, trackProgress } from "@/lib/scrub";
import styles from "./Continuation.module.css";

type Key = "A" | "B" | "C" | "D";
// outward paths: [dx, dy, lateral bulge] in svg units — each piece takes its own arc
const PATH: Record<Key, [number, number, number]> = {
  A: [-175, -135, -18],
  B: [180, -145, 18],
  C: [-185, 160, 18],
  D: [175, 140, -18],
};
// photographs are discovered inside the pieces as they return
const REVEAL: Record<"A" | "D" | "C", [number, number]> = { A: [0.62, 0.7], D: [0.7, 0.78], C: [0.78, 0.86] };

/**
 * 03 → 04 · one pinned stage: the room, the mark separates, the message, the reform.
 * A 900vh track drives a continuous scrub; on narrow viewports and reduced
 * motion the stage unpins and settles into its final composition.
 */
export default function Continuation() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ph = useRef<HTMLDivElement>(null);
  const phImg = useRef<HTMLImageElement>(null);
  const st = useRef<HTMLDivElement>(null);
  const co = useRef<HTMLParagraphElement>(null);
  const close = useRef<HTMLDivElement>(null);
  const msg = useRef<HTMLDivElement>(null);
  const pieces = useRef<Record<Key, SVGGElement | null>>({ A: null, B: null, C: null, D: null });
  const images = useRef<Record<"A" | "C" | "D", SVGImageElement | null>>({ A: null, C: null, D: null });
  const gold = useRef<SVGPathElement>(null);
  const callouts = useRef<Record<"A" | "C" | "D", HTMLDivElement | null>>({ A: null, C: null, D: null });

  useEffect(() => {
    if (still === null) return;
    const tr = track.current, sg = stage.current, p = ph.current;
    if (!tr || !sg || !p) return;
    const P = pieces.current, IM = images.current, CO = callouts.current;

    const settle = () => {
      (Object.keys(P) as Key[]).forEach((k) => P[k] && (P[k]!.style.transform = "none"));
      (Object.keys(IM) as ("A" | "C" | "D")[]).forEach((k) => IM[k] && (IM[k]!.style.opacity = "1"));
      if (gold.current) gold.current.style.opacity = "1";
    };
    if (still) {
      settle();
      return;
    }

    let dx = 0, dy = 0;
    const measure = () => {
      const s = sg.getBoundingClientRect(), r = p.getBoundingClientRect();
      dx = s.left + s.width / 2 - (r.left + r.width / 2);
      dy = s.top + s.height / 2 - (r.top + r.height / 2);
    };
    const measureLater = () => {
      p.style.transform = "none";
      measure();
    };
    const place = (k: Key, e: number) => {
      const d = PATH[k], nx = -d[1], ny = d[0], L = Math.hypot(nx, ny) || 1, bulge = Math.sin(Math.PI * e) * d[2];
      const el = P[k];
      if (el) el.style.transform = `translate(${(d[0] * e + (nx / L) * bulge).toFixed(2)}px,${(d[1] * e + (ny / L) * bulge).toFixed(2)}px)`;
    };

    const at = (pr: number) => {
      if (pr < 0.05) {
        p.style.transform = "none";
        measure();
      }
      // 03 · the closing line takes the paragraph's place, then everything on the left clears
      if (co.current) co.current.style.opacity = (1 - t(pr, 0.04, 0.1)).toFixed(3);
      if (close.current) close.current.style.opacity = (t(pr, 0.06, 0.12) * (1 - t(pr, 0.16, 0.22))).toFixed(3);
      if (st.current) st.current.style.opacity = (1 - t(pr, 0.16, 0.24)).toFixed(3);
      // the photograph and the black fills release; the pieces become outlines
      const free = t(pr, 0.16, 0.28);
      if (phImg.current) phImg.current.style.opacity = (1 - free).toFixed(3);
      p.style.setProperty("--nf", (1 - free).toFixed(3));
      // 04 · separate (→1), hold, then draw back to a balanced composition
      const sep = pr < 0.42 ? easeCubic(t(pr, 0.18, 0.42)) : pr < 0.6 ? 1 : 1 - easeCubic(t(pr, 0.6, 0.8));
      (Object.keys(P) as Key[]).forEach((k) => place(k, sep));
      // the composition migrates from the right column to the centre of the stage as it opens
      const mig = easeCubic(t(pr, 0.18, 0.4));
      p.style.transform = `translate(${(dx * mig).toFixed(1)}px,${(dy * mig).toFixed(1)}px) scale(${(1 + 0.06 * mig).toFixed(4)})`;
      // the centre message, between the pieces
      const m = t(pr, 0.42, 0.5) * (1 - t(pr, 0.56, 0.62));
      if (msg.current) {
        msg.current.style.opacity = m.toFixed(3);
        msg.current.style.transform = `translate(-50%,-50%) translateY(${(10 - 10 * m).toFixed(1)}px)`;
      }
      (Object.keys(REVEAL) as ("A" | "C" | "D")[]).forEach((k) => {
        if (IM[k]) IM[k]!.style.opacity = t(pr, REVEAL[k][0], REVEAL[k][1]).toFixed(3);
      });
      if (gold.current) gold.current.style.opacity = t(pr, 0.64, 0.74).toFixed(3);
      // annotations arrive once the pieces have settled, and stay
      (["A", "D", "C"] as const).forEach((k) => {
        const v = t(pr, REVEAL[k][0] + 0.05, REVEAL[k][1] + 0.05);
        const el = CO[k];
        if (el) {
          el.style.opacity = v.toFixed(3);
          el.style.transform = `translateY(${(8 - 8 * v).toFixed(1)}px)`;
        }
      });
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
    const onResize = () => {
      measureLater();
      onScroll();
    };
    measureLater();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [still]);

  const outline = { fill: "none", stroke: "#C3AE87", strokeWidth: 2.4, strokeLinejoin: "round" as const };

  return (
    <section id="continuation" className={`c5 ${styles.continuation}`}>
      <div className={styles.track} ref={track}>
        <div className={styles.stage} ref={stage}>
          <span id="room" className={styles.roomAnchor} aria-hidden="true" />
          <div className={`c5-sheet c5-grid ${styles.c3}`} data-reveal>
            <div className={`c5c ${styles.st}`} ref={st}>
              <span className="c5-lab">03 — The continuation</span>
              <h2 className="c5-h2 mt-[22px]" data-reveal>
                <span className="c5-ln"><span>The event ends.</span></span>
                <span className="c5-ln"><span>The conversation should not.</span></span>
              </h2>
            </div>
            <div className={`c5c ${styles.slot}`}>
              <p className="c5-copy c5-fade d1" ref={co} data-reveal>
                The industry already has places to meet. Vault is built for what happens next: the follow-up question,
                the trusted introduction, the context shared in confidence and the relationship that remains useful
                long after the badge comes off.
              </p>
              <div className={styles.close} ref={close}>
                <div className="c5-rule" />
                <p className="mt-7">
                  <span className="c5-ln"><span>Conferences create introductions.</span></span>
                  <span className="c5-ln"><span>Vault creates relationships.</span></span>
                </p>
              </div>
            </div>

            <div className={`c5c c5-fade d2 ${styles.ph}`} ref={ph} data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element -- absolutely positioned inside an SVG-composited plate */}
              <img
                ref={phImg}
                className={styles.phImg}
                src="/images/room.webp"
                alt="A Vault room mid-conversation: participants around a single table in low light."
                decoding="async"
              />
              <svg
                className={styles.phPat}
                viewBox="-40 -40 742 907"
                preserveAspectRatio="xMidYMid slice"
                role="img"
                aria-label="The Vault monogram over the room, later separating into four parts that hold photographs of a private dinner, an executive breakfast and a closed-door roundtable."
              >
                <defs>
                  <clipPath id="rkA" clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.A} /></clipPath>
                  <clipPath id="rkD" clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.D} /></clipPath>
                  <clipPath id="rkC" clipPathUnits="userSpaceOnUse"><path d={MONOGRAM.C} /></clipPath>
                </defs>
                <g className={styles.piece} ref={(el) => { pieces.current.A = el; }}>
                  <path className={styles.nfill} d={MONOGRAM.A} fill="#000" />
                  <g clipPath="url(#rkA)">
                    <image ref={(el) => { images.current.A = el; }} className={styles.pimg} x="-6" y="-11" width="370" height="405" preserveAspectRatio="xMidYMid slice" href="/images/private-dinner.webp" />
                  </g>
                  <path className={styles.outline} pathLength={1} d={MONOGRAM.A} {...outline} />
                </g>
                <g className={styles.piece} ref={(el) => { pieces.current.B = el; }}>
                  <path className={styles.nfill} d={MONOGRAM.B} fill="#000" />
                  <path ref={gold} className={styles.pgold} d={MONOGRAM.B} fill="#C3AE87" />
                  <path className={styles.outline} pathLength={1} d={MONOGRAM.B} {...outline} />
                </g>
                <g className={styles.piece} ref={(el) => { pieces.current.C = el; }}>
                  <path className={styles.nfill} d={MONOGRAM.C} fill="#000" />
                  <g clipPath="url(#rkC)">
                    <image ref={(el) => { images.current.C = el; }} className={styles.pimg} x="-3" y="430" width="248" height="374" preserveAspectRatio="xMidYMid slice" href="/images/roundtable.webp" />
                  </g>
                  <path className={styles.outline} pathLength={1} d={MONOGRAM.C} {...outline} />
                </g>
                <g className={styles.piece} ref={(el) => { pieces.current.D = el; }}>
                  <path className={styles.nfill} d={MONOGRAM.D} fill="#000" />
                  <g clipPath="url(#rkD)">
                    <image ref={(el) => { images.current.D = el; }} className={styles.pimg} x="269" y="381" width="396" height="449" preserveAspectRatio="xMidYMid slice" href="/images/executive-breakfast.webp" />
                  </g>
                  <path className={styles.outline} pathLength={1} d={MONOGRAM.D} {...outline} />
                </g>
              </svg>
              <div className={`${styles.callout} ${styles.coA}`} ref={(el) => { callouts.current.A = el; }}>
                <p className={styles.coT}>Private dinners</p>
                <span className={styles.coArrow} aria-hidden="true" />
              </div>
              <div className={`${styles.callout} ${styles.coD}`} ref={(el) => { callouts.current.D = el; }}>
                <span className={styles.coArrow} aria-hidden="true" />
                <p className={styles.coT}>Executive breakfasts</p>
              </div>
              <div className={`${styles.callout} ${styles.coC}`} ref={(el) => { callouts.current.C = el; }}>
                <p className={styles.coT}>Closed-door roundtables</p>
                <span className={styles.coArrow} aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* 04 · the centre message, between the separated pieces */}
          <div className={styles.roomMsg} ref={msg}>
            <span className="c5-lab">04 — Inside the room</span>
            <h2 className={styles.roomH2}>
              Small by design.
              <br />
              Relevant by construction.
            </h2>
            <p className="c5-copy">
              Vault convenings are curated around who would genuinely benefit from knowing one another. The objective
              is not attendance. It is the quality of the conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
