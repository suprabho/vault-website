"use client";

import { useCallback, useEffect, useRef } from "react";
import MotifGlyph from "@/components/motif/MotifGlyph";
import Lines from "@/components/type/Lines";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { BETWEEN } from "@/lib/choreography";
import { BETWEEN_POSE, COUNTER_CENTRE, INNER_RIGHT, RHYTHM_INSET, glyphToScreen } from "@/lib/motif";
import { easeCubic, easeQuad, t } from "@/lib/scrub";
import styles from "./Between.module.css";

/** weeks in a quarter: each stop lights the weeks it lands on */
const WEEKS = 13;

type Stop = {
  n: string;
  when: string;
  what: string;
  /** lit weeks out of WEEKS, or "always" drawn as one continuous line */
  beat: number[] | "always";
};

const RHYTHM: Stop[] = [
  { n: "01", when: "Monday", what: "Five things worth knowing before the week starts.", beat: Array.from({ length: WEEKS }, (_, i) => i) },
  { n: "02", when: "As needed", what: "The regulatory or enforcement signal that cannot wait until Monday.", beat: [1, 5, 6, 10] },
  { n: "03", when: "Monthly", what: "The cases, decisions and developments worth understanding properly.", beat: [4, 8, 12] },
  { n: "04", when: "Quarterly", what: "Where regulation, enforcement and the market appear to be heading next.", beat: [12] },
  { n: "05", when: "Always available", what: "Playbooks, recordings, tools and trusted introductions.", beat: "always" },
];

/** samples taken along the edge to draw it and to find where each stop sits */
const SAMPLES = 360;
/** gap between a stop's text and the line, in px */
const GUTTER = 36;

/** the cadence of one stop across a quarter, as a row of week ticks */
function Beat({ beat }: { beat: Stop["beat"] }) {
  const gap = 10;
  const w = (WEEKS - 1) * gap + 1;
  return (
    <svg className={styles.beat} viewBox={`0 0 ${w} 14`} width={w} height="14" aria-hidden="true">
      {beat === "always" ? (
        <path d={`M0.5 7H${w - 0.5}`} className={styles.beatOn} />
      ) : (
        Array.from({ length: WEEKS }, (_, i) => {
          const on = beat.includes(i);
          const x = i * gap + 0.5;
          return <path key={i} d={on ? `M${x} 1V13` : `M${x} 5V9`} className={on ? styles.beatOn : styles.beatOff} />;
        })
      )}
    </svg>
  );
}

/**
 * 05 · one pinned track inside the mark. The motif layer holds the mark large; this stage draws
 * the cadence down its inside right edge. The headline gives way, the line draws, and each stop
 * lands as the line reaches it. In still mode the stops are a plain list.
 */
export default function Between() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const edge = useRef<SVGPathElement>(null);
  const line = useRef<SVGPathElement>(null);
  const stops = useRef<(HTMLLIElement | null)[]>([]);
  const marks = useRef<(HTMLSpanElement | null)[]>([]);
  /** where along the line (0..1) each stop sits, from the last layout */
  const at = useRef<number[]>(RHYTHM.map((_, i) => (i + 0.5) / RHYTHM.length));

  // lay the line and the stops out on the mark for this viewport
  const layout = useCallback(() => {
    const E = edge.current, L = line.current, hd = head.current;
    if (!E || !L || !hd) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const len = E.getTotalLength();
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const g = E.getPointAtLength((i / SAMPLES) * len);
      // pull the edge in towards the counter's centre so the line sits inside the outline
      const inset = {
        x: COUNTER_CENTRE.x + (g.x - COUNTER_CENTRE.x) * RHYTHM_INSET,
        y: COUNTER_CENTRE.y + (g.y - COUNTER_CENTRE.y) * RHYTHM_INSET,
      };
      pts.push(glyphToScreen(inset, BETWEEN_POSE, vw, vh));
    }
    L.setAttribute("d", `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L")}`);

    // the stops are spaced evenly down the visible stage, then placed where the line crosses that height
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navh")) || 88;
    const top = nav + vh * 0.06, bottom = vh * 0.8;
    RHYTHM.forEach((_, i) => {
      const y = top + ((bottom - top) * i) / (RHYTHM.length - 1);
      let k = pts.findIndex((p) => p.y >= y);
      if (k < 0) k = pts.length - 1;
      const p = pts[k];
      at.current[i] = k / SAMPLES;
      const s = stops.current[i], m = marks.current[i];
      if (s) {
        // clear the line over the stop's whole height: lower down, the curve turns in under the copy
        const h = s.offsetHeight;
        const minX = pts.reduce((m, q) => (q.y >= p.y - 12 && q.y <= p.y + h ? Math.min(m, q.x) : m), p.x);
        s.style.right = `${(vw - minX + GUTTER).toFixed(1)}px`;
        s.style.top = `${p.y.toFixed(1)}px`;
      }
      if (m) {
        m.style.left = `${p.x.toFixed(1)}px`;
        m.style.top = `${p.y.toFixed(1)}px`;
      }
    });

    // the headline sits in the middle of the counter
    const c = glyphToScreen(COUNTER_CENTRE, BETWEEN_POSE, vw, vh);
    const counterW = (BETWEEN_POSE.anchor.x - 140) * c.px;
    hd.style.left = `${c.x.toFixed(1)}px`;
    hd.style.top = `${c.y.toFixed(1)}px`;
    hd.style.width = `${Math.min(counterW * 0.82, 620).toFixed(0)}px`;
  }, []);

  const scrub = useCallback((p: number) => {
    const hd = head.current, L = line.current;
    if (!hd || !L) return;
    const h = 1 - easeQuad(t(p, BETWEEN.headOut[0], BETWEEN.headOut[1]));
    hd.style.opacity = h.toFixed(3);
    hd.style.transform = `translate(-50%, -50%) translateY(${(-24 * (1 - h)).toFixed(1)}px)`;
    const [d0, d1] = BETWEEN.draw;
    L.style.strokeDashoffset = (1 - t(p, d0, d1)).toFixed(4);
    RHYTHM.forEach((_, i) => {
      const s = stops.current[i], m = marks.current[i];
      const from = d0 + at.current[i] * (d1 - d0);
      const v = easeCubic(t(p, from, from + BETWEEN.stopIn));
      if (m) m.style.opacity = t(p, from - 0.005, from + 0.01).toFixed(3);
      if (s) {
        s.style.opacity = v.toFixed(3);
        s.style.transform = `translateX(${(-16 * (1 - v)).toFixed(1)}px)`;
      }
    });
  }, []);

  const settle = useCallback(() => {
    [head.current, ...stops.current, ...marks.current].forEach((el) => {
      if (!el) return;
      el.removeAttribute("style");
    });
  }, []);

  useTrackScrub(track, still, scrub, settle);

  useEffect(() => {
    if (still !== false) return;
    const onResize = () => layout();
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [still, layout]);

  return (
    <section id="between" data-motif-track="between" className={`c5 ${styles.between}`}>
      <MotifGlyph className={styles.stillGlyph} />
      <div className={styles.track} ref={track}>
        <div className={styles.stage}>
          {/* the edge in glyph units, measured but never shown */}
          <svg className={styles.measure} viewBox="0 0 662 827" aria-hidden="true">
            <path ref={edge} d={INNER_RIGHT} />
          </svg>
          <svg className={styles.curve} aria-hidden="true">
            <path ref={line} pathLength={1} />
          </svg>

          <div className={styles.head} ref={head}>
            <span className="c5-lab">05 — Between the rooms</span>
            <h2 className="c5-h2 mt-[22px]" data-reveal>
              <Lines lines={["Membership should make", "the working week easier."]} />
            </h2>
          </div>

          <ol className={styles.rhy} aria-label="The Vault cadence">
            {RHYTHM.map((r, i) => (
              <li
                key={r.n}
                className={`${styles.rm} ${i === RHYTHM.length - 1 ? styles.rmLast : ""}`}
                ref={(el) => { stops.current[i] = el; }}
              >
                <p className={styles.rmHead}>
                  <span className="c5-lab">{r.when}</span>
                  <span className={styles.rmN}>{r.n}</span>
                </p>
                <Beat beat={r.beat} />
                <p className={styles.rmWhat}>{r.what}</p>
              </li>
            ))}
          </ol>
          {RHYTHM.map((r, i) => (
            <span key={r.n} className={styles.mark} ref={(el) => { marks.current[i] = el; }} aria-hidden="true" />
          ))}
        </div>
      </div>
    </section>
  );
}
