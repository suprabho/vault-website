"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import MotifGlyph from "@/components/motif/MotifGlyph";
import Lines from "@/components/type/Lines";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { BETWEEN } from "@/lib/choreography";
import { COUNTER, COUNTER_CENTRE, GLYPH_W, INNER_LOOP, RHYTHM_INSET, betweenPose, glyphToScreen } from "@/lib/motif";
import { easeQuad, t } from "@/lib/scrub";
import { CADENCE_ASSETS } from "./CadenceAssets";
import styles from "./Between.module.css";

/** the dial is a year: one spoke per day, 1 January at the top, running clockwise */
const DAYS = 365;
const DAY = Array.from({ length: DAYS }, (_, d) => d);
/** the first day of each month, as a day of the year */
const MONTHS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

type Stop = {
  /** named in the still list; on the pinned stage the dial and its preview say when, so it is only read out */
  when: string;
  what: string;
  /** the days this stop lands on, or "all" */
  days: number[] | "all";
  /** still mode: lit weeks out of a 13-week quarter, or "always" */
  beat: number[] | "always";
};

const RHYTHM: Stop[] = [
  // 52 Mondays: the year used for the dial starts on a Thursday, so the first Monday is day 4
  { when: "Monday", what: "Five things worth knowing before the week starts.", days: Array.from({ length: 52 }, (_, k) => 4 + 7 * k), beat: Array.from({ length: 13 }, (_, i) => i) },
  { when: "As needed", what: "The regulatory or enforcement signal that cannot wait until Monday.", days: [19, 47, 51, 96, 138, 170, 204, 233, 237, 281, 318, 344], beat: [1, 5, 6, 10] },
  { when: "Monthly", what: "The cases, decisions and developments worth understanding properly.", days: MONTHS, beat: [4, 8, 12] },
  { when: "Quarterly", what: "Where regulation, enforcement and the market appear to be heading next.", days: [0, 90, 181, 273], beat: [12] },
  { when: "Always available", what: "Playbooks, recordings, tools and trusted introductions.", days: "all", beat: "always" },
];
const ON = RHYTHM.map((s) => new Set(s.days === "all" ? DAY : s.days));

/** samples taken round the loop: a few per spoke, for the rim and the spokes' direction */
const SAMPLES = DAYS * 4;
/** the longest a spoke may be, in px; it also never reaches more than 85% across the channel */
const SPOKE = 18;

/** still mode only: the cadence of one stop across a quarter, as a row of week ticks */
function Beat({ beat }: { beat: Stop["beat"] }) {
  const gap = 10, weeks = 13;
  const w = (weeks - 1) * gap + 1;
  return (
    <svg className={styles.beat} viewBox={`0 0 ${w} 14`} width={w} height="14" aria-hidden="true">
      {beat === "always" ? (
        <path d={`M0.5 7H${w - 0.5}`} className={styles.beatOn} />
      ) : (
        Array.from({ length: weeks }, (_, i) => {
          const on = beat.includes(i);
          const x = i * gap + 0.5;
          return <path key={i} d={on ? `M${x} 1V13` : `M${x} 5V9`} className={on ? styles.beatOn : styles.beatOff} />;
        })
      )}
    </svg>
  );
}

/** a week tick's pose, as [height scale, opacity]: off, on, or folded into the always-on line */
const TICK_OFF = [4 / 14, 0.28] as const;
const TICK_ON = [1, 1] as const;
const TICK_LINE = [1.4 / 14, 1] as const;
const WEEKS = 13;
const tickPose = (stop: Stop, week: number) =>
  stop.beat === "always" ? TICK_LINE : stop.beat.includes(week) ? TICK_ON : TICK_OFF;
const lerp = (a: number, b: number, v: number) => a + (b - a) * v;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * still mode, narrow only: the swipe's timeline. One row of week ticks stays at the foot of the
 * section and turns from each stop's rhythm into the next as the cards move, the change sweeping
 * across the quarter; "always" folds the ticks into one line. Beneath it, five segments say where
 * the swipe rests and jump to a stop.
 */
function Timeline({ list }: { list: RefObject<HTMLOListElement | null> }) {
  const [at, setAt] = useState(0);
  const ticks = useRef<(HTMLElement | null)[]>([]);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const items = Array.from(el.children) as HTMLElement[];
      if (items.length < 2) return;
      const s = el.scrollLeft, max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return; // not a swipe here
      // where each card rests (the row ends in a spacer so the last one reaches the start too)
      const rest = items.map((it) => Math.min(it.offsetLeft - items[0].offsetLeft, max));
      let k = 0;
      while (k < rest.length - 2 && s > rest[k + 1]) k++;
      const span = rest[k + 1] - rest[k];
      const along = span > 0 ? clamp01((s - rest[k]) / span) : 0;
      const from = RHYTHM[k], to = RHYTHM[k + 1];
      ticks.current.forEach((tk, w) => {
        if (!tk) return;
        // the change runs left to right across the weeks
        const v = clamp01((along - (w / (WEEKS - 1)) * 0.35) / 0.65);
        const a = tickPose(from, w), b = tickPose(to, w);
        tk.style.transform = `scaleY(${lerp(a[0], b[0], v).toFixed(3)})`;
        tk.style.opacity = lerp(a[1], b[1], v).toFixed(3);
      });
      if (line.current) {
        const v = lerp(from.beat === "always" ? 1 : 0, to.beat === "always" ? 1 : 0, along);
        line.current.style.transform = `scaleX(${v.toFixed(3)})`;
      }
      setAt(Math.round(k + along));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    draw();
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [list]);

  const go = (i: number) => {
    const el = list.current;
    const items = el ? (Array.from(el.children) as HTMLElement[]) : [];
    if (el && items[i]) el.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.weeks} aria-hidden="true">
        <span className={styles.weeksLine} ref={line} />
        {Array.from({ length: WEEKS }, (_, w) => (
          <i key={w} ref={(el) => { ticks.current[w] = el; }} />
        ))}
      </div>
      <div className={styles.pager}>
        {RHYTHM.map((r, i) => (
          <button
            key={r.when}
            type="button"
            className={styles.pagerStop}
            aria-label={`Show ${r.when}`}
            aria-current={at === i ? "true" : undefined}
            onClick={() => go(i)}
          />
        ))}
        <span className={styles.pagerCount} aria-hidden="true">
          {String(at + 1).padStart(2, "0")} / {String(RHYTHM.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

/**
 * 05 · one pinned track inside the mark. The motif layer holds the mark to the left; this stage
 * turns its counter into a year dial of 365 spokes. Each stop in turn lights the days it lands on
 * — 52 Mondays, the signals between, 12 months, 4 quarters, then every day — with a preview of
 * what it delivers in the middle of the dial and its copy to the right. In still mode each stop
 * is a card: the same preview, then its name, its week ticks and what it delivers; a row of five
 * where there is room, a swipe on a phone.
 */
export default function Between() {
  const still = useStillMedia();
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<SVGPathElement>(null);
  const dial = useRef<SVGSVGElement>(null);
  const rim = useRef<SVGPathElement>(null);
  const spokes = useRef<(SVGPathElement | null)[]>([]);
  const head = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLOListElement>(null);
  const stops = useRef<(HTMLLIElement | null)[]>([]);
  const art = useRef<HTMLDivElement>(null);
  const assets = useRef<(HTMLDivElement | null)[]>([]);
  const stopNow = useRef<string>("");

  // lay the dial, the preview and the copy out on the mark for this viewport
  const layout = useCallback(() => {
    const P = loop.current, R = rim.current, hd = head.current, bx = box.current, ar = art.current;
    if (!P || !R || !hd || !bx || !ar) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navh")) || 88;
    const pose = betweenPose(vw, vh, nav);
    const len = P.getTotalLength();

    // the loop, pulled in towards the counter's centre so the rim sits inside the outline;
    // `room` is how far the outline is from the rim at each point, for the spokes
    const pts: { x: number; y: number; room: number }[] = [];
    for (let i = 0; i < SAMPLES; i++) {
      const g = P.getPointAtLength((i / SAMPLES) * len);
      const inset = {
        x: COUNTER_CENTRE.x + (g.x - COUNTER_CENTRE.x) * RHYTHM_INSET,
        y: COUNTER_CENTRE.y + (g.y - COUNTER_CENTRE.y) * RHYTHM_INSET,
      };
      const p = glyphToScreen(inset, pose, vw, vh);
      pts.push({ x: p.x, y: p.y, room: Math.hypot(g.x - inset.x, g.y - inset.y) * p.px });
    }
    R.setAttribute("d", `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L")}Z`);

    // one spoke per day, pointing out from the rim towards the outline
    const c = glyphToScreen(COUNTER_CENTRE, pose, vw, vh);
    DAY.forEach((d) => {
      const el = spokes.current[d];
      if (!el) return;
      const i = Math.round(((d + 0.5) / DAYS) * SAMPLES) % SAMPLES;
      const a = pts[(i - 1 + SAMPLES) % SAMPLES], b = pts[(i + 1) % SAMPLES], p = pts[i];
      const tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1;
      let nx = ty / tl, ny = -tx / tl;
      if (nx * (p.x - c.x) + ny * (p.y - c.y) < 0) { nx = -nx; ny = -ny; }
      const reach = Math.min(SPOKE, p.room * 0.85);
      el.setAttribute("d", `M${(p.x + nx * 2).toFixed(1)} ${(p.y + ny * 2).toFixed(1)}l${(nx * reach).toFixed(1)} ${(ny * reach).toFixed(1)}`);
      el.style.setProperty("--reach", reach.toFixed(1));
    });

    // the preview sits in the middle of the counter
    const counterW = (COUNTER.right - COUNTER.left) * c.px;
    const w = Math.min(counterW * 0.56, 300);
    ar.style.left = `${c.x.toFixed(1)}px`;
    ar.style.top = `${c.y.toFixed(1)}px`;
    ar.style.width = `${w.toFixed(0)}px`;

    // the copy, and the headline before it, take the space to the right of the mark
    const markRight = c.x + (GLYPH_W - COUNTER_CENTRE.x) * c.px;
    const left = markRight + Math.max(40, vw * 0.04);
    const width = Math.min(460, vw - left - (vw >= 1024 ? 96 : 48));
    for (const el of [hd, bx]) {
      el.style.left = `${left.toFixed(1)}px`;
      el.style.top = `${c.y.toFixed(1)}px`;
      el.style.width = `${width.toFixed(0)}px`;
    }
  }, []);

  const scrub = useCallback((p: number) => {
    const hd = head.current, R = rim.current, D = dial.current;
    if (!hd || !R || !D) return;

    // the rim draws round the counter, and the days appear behind it
    R.style.strokeDashoffset = (1 - easeQuad(t(p, BETWEEN.dialIn[0], BETWEEN.dialIn[1]))).toFixed(4);
    const shown = p >= BETWEEN.dialIn[0] + 0.02 ? "in" : "";
    if (D.dataset.days !== shown) D.dataset.days = shown;

    const h = 1 - easeQuad(t(p, BETWEEN.headOut[0], BETWEEN.headOut[1]));
    hd.style.opacity = h.toFixed(3);
    hd.style.transform = `translateY(-50%) translateY(${(-20 * (1 - h)).toFixed(1)}px)`;

    // one stop at a time: each holds its fifth of the track, then gives way to the next
    const [s0, s1] = BETWEEN.stops;
    const started = p >= s0;
    const along = t(p, s0, s1) * RHYTHM.length;
    const active = started ? Math.min(RHYTHM.length - 1, Math.floor(along)) : -1;
    RHYTHM.forEach((_, i) => {
      const local = along - i;
      const last = i === RHYTHM.length - 1;
      const v = started ? easeQuad(t(local, 0, 0.14)) * (last ? 1 : 1 - easeQuad(t(local, 0.86, 1))) : 0;
      const lift = (local < 0.5 ? 14 : -14) * (1 - v);
      const s = stops.current[i], a = assets.current[i];
      if (s) {
        s.style.opacity = v.toFixed(3);
        s.style.transform = `translateY(${lift.toFixed(1)}px)`;
        s.style.visibility = v < 0.01 ? "hidden" : "visible";
      }
      if (a) {
        a.style.opacity = v.toFixed(3);
        a.style.transform = `translateY(${(lift * 1.4).toFixed(1)}px) scale(${(0.97 + 0.03 * v).toFixed(4)})`;
        a.style.visibility = v < 0.01 ? "hidden" : "visible";
      }
    });
    const now = active < 0 ? "" : String(active);
    if (stopNow.current !== now) {
      stopNow.current = now;
      D.dataset.stop = now;
    }
  }, []);

  const settle = useCallback(() => {
    [head.current, box.current, art.current, ...stops.current, ...assets.current].forEach((el) => el?.removeAttribute("style"));
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
          {/* the loop in glyph units, measured but never shown */}
          <svg className={styles.measure} viewBox="0 0 662 827" aria-hidden="true">
            <path ref={loop} d={INNER_LOOP} />
          </svg>

          <svg className={styles.dial} ref={dial} aria-hidden="true">
            <g>
              {DAY.map((d) => (
                <path
                  key={d}
                  className={[
                    styles.day,
                    MONTHS.includes(d) ? styles.month : "",
                    ...ON.map((set, i) => (set.has(d) ? styles[`on${i}`] : "")),
                  ].join(" ")}
                  style={{ "--d": d } as React.CSSProperties}
                  ref={(el) => { spokes.current[d] = el; }}
                />
              ))}
            </g>
            <path ref={rim} className={styles.rim} pathLength={1} />
          </svg>

          <div className={styles.art} ref={art} aria-hidden="true">
            {CADENCE_ASSETS.map((Asset, i) => (
              <div key={RHYTHM[i].when} className={styles.asset} ref={(el) => { assets.current[i] = el; }}>
                <Asset />
              </div>
            ))}
          </div>

          <div className={styles.head} ref={head}>
            <h2 className="c5-h2" data-reveal>
              <Lines lines={["Membership should make", "the working week easier."]} />
            </h2>
          </div>

          <ol className={styles.box} ref={box} aria-label="The Vault cadence">
            {RHYTHM.map((r, i) => {
              const Asset = CADENCE_ASSETS[i];
              return (
                <li key={r.when} className={styles.rm} ref={(el) => { stops.current[i] = el; }}>
                  {/* still mode: the stop's preview heads its card (on the pinned stage it sits in the dial) */}
                  <div className={styles.rmArt} aria-hidden="true">
                    <Asset />
                  </div>
                  <p className={styles.rmWhen}>
                    <span>{r.when}</span>
                    <Beat beat={r.beat} />
                  </p>
                  <p className={styles.rmWhat}>{r.what}</p>
                </li>
              );
            })}
          </ol>
          <Timeline list={box} />
        </div>
      </div>
    </section>
  );
}
