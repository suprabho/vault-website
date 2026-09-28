"use client";

import { useCallback, useEffect, useRef } from "react";
import MotifGlyph from "@/components/motif/MotifGlyph";
import Lines from "@/components/type/Lines";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { BETWEEN } from "@/lib/choreography";
import { BETWEEN_POSE, COUNTER_CENTRE, INNER_RIGHT, RHYTHM_INSET, glyphToScreen } from "@/lib/motif";
import { easeQuad, t } from "@/lib/scrub";
import styles from "./Between.module.css";

/** weeks in a quarter: each stop lights the weeks it lands on */
const WEEKS = 13;
const ALL_WEEKS = Array.from({ length: WEEKS }, (_, i) => i);

type Stop = {
  n: string;
  when: string;
  what: string;
  /** lit weeks out of WEEKS, or "always" drawn as one continuous run */
  beat: number[] | "always";
};

const RHYTHM: Stop[] = [
  { n: "01", when: "Monday", what: "Five things worth knowing before the week starts.", beat: ALL_WEEKS },
  { n: "02", when: "As needed", what: "The regulatory or enforcement signal that cannot wait until Monday.", beat: [1, 5, 6, 10] },
  { n: "03", when: "Monthly", what: "The cases, decisions and developments worth understanding properly.", beat: [4, 8, 12] },
  { n: "04", when: "Quarterly", what: "Where regulation, enforcement and the market appear to be heading next.", beat: [12] },
  { n: "05", when: "Always available", what: "Playbooks, recordings, tools and trusted introductions.", beat: "always" },
];
const lit = (s: Stop, k: number) => s.beat === "always" || s.beat.includes(k);

/** samples taken along the edge to draw it, place the ticks and move the marker */
const SAMPLES = 480;
/** the longest a tick may be, in px; it also never reaches more than 80% across the channel */
const TICK = 16;

type State = "next" | "active" | "past";

/** still mode only: the cadence of one stop across a quarter, as a row of week ticks */
function Beat({ beat }: { beat: Stop["beat"] }) {
  const gap = 10;
  const w = (WEEKS - 1) * gap + 1;
  return (
    <svg className={styles.beat} viewBox={`0 0 ${w} 14`} width={w} height="14" aria-hidden="true">
      {beat === "always" ? (
        <path d={`M0.5 7H${w - 0.5}`} className={styles.beatOn} />
      ) : (
        ALL_WEEKS.map((i) => {
          const on = beat.includes(i);
          const x = i * gap + 0.5;
          return <path key={i} d={on ? `M${x} 1V13` : `M${x} 5V9`} className={on ? styles.beatOn : styles.beatOff} />;
        })
      )}
    </svg>
  );
}

/**
 * 05 · one pinned track inside the mark. The motif layer holds the mark large; this stage turns
 * its inside right edge into a ruler — five runs of week ticks, one per stop — and draws a line
 * down it. As the line reaches each run, that stop's weeks light up and its copy takes the one
 * place on the stage, replacing the stop before. In still mode the stops are a plain list.
 */
export default function Between() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const edge = useRef<SVGPathElement>(null);
  const line = useRef<SVGPathElement>(null);
  const always = useRef<SVGPathElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLOListElement>(null);
  const runs = useRef<(SVGGElement | null)[]>([]);
  const ticks = useRef<(SVGPathElement | null)[][]>(RHYTHM.map(() => []));
  const stops = useRef<(HTMLLIElement | null)[]>([]);
  /** the visible stretch of the line on screen, for the marker */
  const path = useRef<{ x: number; y: number }[]>([]);
  const states = useRef<State[]>(RHYTHM.map(() => "next"));

  // lay the ruler, the line and the copy out on the mark for this viewport
  const layout = useCallback(() => {
    const E = edge.current, L = line.current, hd = head.current, bx = box.current;
    if (!E || !L || !hd || !bx) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navh")) || 88;
    const len = E.getTotalLength();

    // the edge, pulled in towards the counter's centre so the line sits inside the outline;
    // `room` is how far the outline is from the line at each point, for the ticks
    const all: { x: number; y: number; room: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const g = E.getPointAtLength((i / SAMPLES) * len);
      const inset = {
        x: COUNTER_CENTRE.x + (g.x - COUNTER_CENTRE.x) * RHYTHM_INSET,
        y: COUNTER_CENTRE.y + (g.y - COUNTER_CENTRE.y) * RHYTHM_INSET,
      };
      const p = glyphToScreen(inset, BETWEEN_POSE, vw, vh);
      all.push({ x: p.x, y: p.y, room: Math.hypot(g.x - inset.x, g.y - inset.y) * p.px });
    }
    // only the stretch that sits on the stage, clear of the header and the bottom edge,
    // and only while the curve is still heading down (it turns back up at its very end)
    const top = nav + vh * 0.04, bottom = vh * 0.95;
    const pts: typeof all = [];
    for (const p of all) {
      if (pts.length && p.y < pts[pts.length - 1].y) break;
      if (p.y >= top && p.y <= bottom) pts.push(p);
    }
    path.current = pts;
    L.setAttribute("d", `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L")}`);

    // five runs of week ticks, each pointing out from the line towards the outline
    const n = pts.length - 1;
    const at = (f: number) => {
      const i = Math.min(n - 1, Math.max(1, Math.round(f * n)));
      const a = pts[i - 1], b = pts[i + 1], p = pts[i];
      const tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1;
      let nx = ty / tl, ny = -tx / tl;
      if (nx < 0) { nx = -nx; ny = -ny; } // the outline is to the right of the line
      return { p, nx, ny, reach: Math.min(TICK, p.room * 0.8) };
    };
    const run: string[] = [];
    RHYTHM.forEach((s, i) => {
      ticks.current[i].forEach((el, k) => {
        if (!el) return;
        const { p, nx, ny, reach } = at((i + (k + 0.5) / WEEKS) / RHYTHM.length);
        el.setAttribute("d", `M${(p.x + nx * 3).toFixed(1)} ${(p.y + ny * 3).toFixed(1)}l${(nx * reach).toFixed(1)} ${(ny * reach).toFixed(1)}`);
        el.style.setProperty("--reach", reach.toFixed(1));
        if (s.beat === "always") run.push(`${(p.x + nx * (reach + 3)).toFixed(1)} ${(p.y + ny * (reach + 3)).toFixed(1)}`);
      });
    });
    always.current?.setAttribute("d", run.length ? `M${run.join("L")}` : "");

    // the copy takes one place, to the left of the line at the middle of the stage
    const mid = pts.find((p) => p.y >= vh * 0.47) ?? pts[Math.floor(n / 2)];
    bx.style.right = `${(vw - mid.x + Math.min(120, vw * 0.08)).toFixed(1)}px`;
    bx.style.top = `${(vh * 0.47).toFixed(1)}px`;

    // the headline sits in the middle of the counter
    const c = glyphToScreen(COUNTER_CENTRE, BETWEEN_POSE, vw, vh);
    const counterW = (BETWEEN_POSE.anchor.x - 140) * c.px;
    hd.style.left = `${c.x.toFixed(1)}px`;
    hd.style.top = `${c.y.toFixed(1)}px`;
    hd.style.width = `${Math.min(counterW * 0.82, 620).toFixed(0)}px`;
  }, []);

  const scrub = useCallback((p: number) => {
    const hd = head.current, L = line.current, mk = marker.current;
    if (!hd || !L || !mk) return;
    const h = 1 - easeQuad(t(p, BETWEEN.headOut[0], BETWEEN.headOut[1]));
    hd.style.opacity = h.toFixed(3);
    hd.style.transform = `translate(-50%, -50%) translateY(${(-24 * (1 - h)).toFixed(1)}px)`;

    // the line and its marker travel down the ruler
    const pr = t(p, BETWEEN.draw[0], BETWEEN.draw[1]);
    L.style.strokeDashoffset = (1 - pr).toFixed(4);
    const pts = path.current;
    if (pts.length) {
      const q = pts[Math.round(pr * (pts.length - 1))];
      mk.style.transform = `translate(${q.x.toFixed(1)}px, ${q.y.toFixed(1)}px)`;
      mk.style.opacity = t(p, BETWEEN.draw[0] - 0.01, BETWEEN.draw[0] + 0.01).toFixed(3);
    }

    // one stop at a time: each holds its fifth of the line, then gives way to the next
    const started = p >= BETWEEN.draw[0];
    const along = pr * RHYTHM.length;
    const active = started ? Math.min(RHYTHM.length - 1, Math.floor(along)) : -1;
    RHYTHM.forEach((_, i) => {
      const local = along - i;
      const last = i === RHYTHM.length - 1;
      const v = started ? easeQuad(t(local, 0, 0.16)) * (last ? 1 : 1 - easeQuad(t(local, 0.84, 1))) : 0;
      const s = stops.current[i];
      if (s) {
        s.style.opacity = v.toFixed(3);
        s.style.transform = `translateY(${((local < 0.5 ? 14 : -14) * (1 - v)).toFixed(1)}px)`;
        s.style.visibility = v < 0.01 ? "hidden" : "visible";
      }
      const state: State = i < active ? "past" : i === active ? "active" : "next";
      if (states.current[i] !== state) {
        states.current[i] = state;
        runs.current[i]?.setAttribute("data-state", state);
      }
    });
  }, []);

  const settle = useCallback(() => {
    [head.current, box.current, marker.current, ...stops.current].forEach((el) => el?.removeAttribute("style"));
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
            {RHYTHM.map((s, i) => (
              <g key={s.n} className={styles.run} data-state="next" ref={(el) => { runs.current[i] = el; }}>
                {ALL_WEEKS.map((k) => (
                  <path
                    key={k}
                    className={lit(s, k) ? styles.tickOn : styles.tickOff}
                    style={{ transitionDelay: `${k * 28}ms` }}
                    ref={(el) => { ticks.current[i][k] = el; }}
                  />
                ))}
                {s.beat === "always" && <path ref={always} className={styles.alwaysRun} pathLength={1} />}
              </g>
            ))}
            <path ref={line} className={styles.line} pathLength={1} />
          </svg>
          <span className={styles.marker} ref={marker} aria-hidden="true" />

          <div className={styles.head} ref={head}>
            <span className="c5-lab">05 — Between the rooms</span>
            <h2 className="c5-h2 mt-[22px]" data-reveal>
              <Lines lines={["Membership should make", "the working week easier."]} />
            </h2>
          </div>

          <ol className={styles.box} ref={box} aria-label="The Vault cadence">
            {RHYTHM.map((r, i) => (
              <li key={r.n} className={styles.rm} ref={(el) => { stops.current[i] = el; }}>
                <p className={styles.rmHead}>
                  <span className={styles.rmN}>
                    {r.n}
                    <span className={styles.rmOf}> / {String(RHYTHM.length).padStart(2, "0")}</span>
                  </span>
                  <span className="c5-lab">{r.when}</span>
                </p>
                <Beat beat={r.beat} />
                <p className={styles.rmWhat}>{r.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
