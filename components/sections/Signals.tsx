"use client";

import { useCallback, useId, useRef, type CSSProperties } from "react";
import { MONOGRAM } from "@/components/brand/monogram";
import MotifGlyph from "@/components/motif/MotifGlyph";
import Lines from "@/components/type/Lines";
import { useStillMedia } from "@/hooks/useStillMedia";
import { useTrackScrub } from "@/hooks/useTrackScrub";
import { SIGNALS, TRACK_VH, type Window } from "@/lib/choreography";
import { Icon } from "@/lib/icons";
import { easeCubic, easeQuad, t } from "@/lib/scrub";
import { footRect, lerpRect, markTransform, signalsGeometry, type Rect } from "@/lib/signals";
import { CTA } from "@/lib/site";
import styles from "./Signals.module.css";

const TOPICS = [
  {
    name: "Regulation",
    desc: "Stay ahead of policy and rulemaking across key jurisdictions.",
    tagLabel: "Jurisdictions",
    tags: ["EU", "UK", "US", "APAC"],
    photo: "/images/intel-regulation.webp",
  },
  {
    name: "Enforcement",
    desc: "Know what global enforcement bodies are prioritising before it becomes yesterday’s news.",
    tagLabel: "Authorities",
    tags: ["FCA", "SEC", "OFAC", "Interpol"],
    photo: "/images/intel-enforcement.webp",
  },
  {
    name: "Financial crime",
    desc: "Track emerging typologies, risk patterns and threats before they reach your controls.",
    tagLabel: "Typologies",
    tags: ["Sanctions", "Fraud", "Money laundering"],
    photo: "/images/intel-financial-crime.webp",
  },
];

/** the room's photograph: held by the mark, then the window, then split across the three panels */
const DINNER = "/images/private-dinner.webp";

/** the three experiences. Described, never named: no venues, no guests. */
const EXPERIENCES = [
  {
    name: "Private dinners",
    text: "Twelve seats. A private table. One topic everyone in the room has a reason to care about.",
    photo: DINNER,
    alt: "Guests in conversation around a candlelit dinner table.",
  },
  {
    name: "Executive breakfasts",
    text: "Small morning sessions with senior operators before the day starts.",
    photo: "/images/executive-breakfast.webp",
    alt: "A breakfast table above the city, mid-conversation.",
  },
  {
    name: "Closed-door roundtables",
    text: "A confidential room built around one regulatory, enforcement or financial crime issue.",
    photo: "/images/roundtable.webp",
    alt: "A small group around a meeting table, laptops open.",
  },
];

const PIECES = ["A", "B", "C", "D"] as const;
const STROKE = { fill: "none", stroke: "#C3AE87", strokeWidth: 1, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const };
/** Figma: each experience's photograph takes the top 520 of the panel's 758 */
const CARD_PHOTO = 520 / 758;
/** a theme's photograph settles from this scale as it arrives */
const SETTLE = 0.06;

const box = (el: HTMLElement, r: Rect) => {
  el.style.left = `${r.x.toFixed(1)}px`;
  el.style.top = `${r.y.toFixed(1)}px`;
  el.style.width = `${r.w.toFixed(1)}px`;
  el.style.height = `${r.h.toFixed(1)}px`;
};

/**
 * 02 → 04 · one pinned track, after the Figma storyboard "Experiment 2". The mark arrives from the
 * hero beside the intro; it grows to hold a photograph for each of the three themes while their
 * copy turns over on the left; it grows again around the room. Then the foot of the mark lights,
 * opens into a window that becomes the full photograph, the photograph divides into three panels,
 * and each panel becomes one of the experiences.
 *
 * The motif layer hands the mark over at the pin (lib/motif.ts): this stage draws it from there at
 * the same pose (lib/signals.ts). In still mode the beats stack: each theme and the room carry a
 * static mark with their photograph, and the experiences are three cards.
 */
export default function Signals() {
  const still = useStillMedia();
  const clip = useId();
  const track = useRef<HTMLDivElement>(null);
  const markG = useRef<SVGGElement>(null);
  const clipPaths = useRef<(SVGPathElement | null)[]>([]);
  const glyphG = useRef<SVGGElement>(null);
  const outline = useRef<SVGGElement>(null);
  const layers = useRef<(SVGGElement | null)[]>([]);
  const dinner = useRef<SVGImageElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const winImg = useRef<HTMLImageElement>(null);
  const amber = useRef<HTMLSpanElement>(null);
  const brass = useRef<HTMLSpanElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const topics = useRef<(HTMLDivElement | null)[]>([]);
  const room = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  const at = useCallback((p: number) => {
    const g = signalsGeometry(window.innerWidth, window.innerHeight);
    const q = (w: Window) => easeQuad(t(p, w[0], w[1]));
    const c = (w: Window) => easeCubic(t(p, w[0], w[1]));
    // copy arrives from below and leaves upwards
    const copy = (el: HTMLElement | null, vin: number, vout: number) => {
      if (!el) return;
      const v = vin * (1 - vout);
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translateY(calc(-50% + ${(16 * (1 - vin) - 16 * vout).toFixed(1)}px))`;
      el.style.pointerEvents = v < 0.5 ? "none" : "";
    };
    copy(intro.current, 1, q(SIGNALS.introOut));
    SIGNALS.topics.forEach((w, i) => copy(topics.current[i], q(w.in), q(w.out)));
    copy(room.current, q(SIGNALS.roomIn), q(SIGNALS.roomOut));
    if (cue.current) cue.current.style.opacity = (1 - q(SIGNALS.roomOut)).toFixed(3);

    // the mark: one centre, three sizes; it shows from the pin, when the motif layer lets go of it
    const m = g.mark;
    const h = m.intro * Math.pow(m.topic / m.intro, c(SIGNALS.grow)) * Math.pow(m.room / m.topic, c(SIGNALS.roomGrow));
    const tf = markTransform(g.cx, g.cy, h);
    clipPaths.current.forEach((path) => path?.setAttribute("transform", tf));
    glyphG.current?.setAttribute("transform", tf);
    outline.current?.setAttribute("transform", tf);
    if (markG.current) markG.current.style.opacity = p > 0 ? (1 - q(SIGNALS.markOut)).toFixed(3) : "0";
    SIGNALS.topics.forEach((w, i) => {
      const el = layers.current[i];
      if (!el) return;
      const v = q(w.photo);
      el.style.opacity = v.toFixed(3);
      el.setAttribute("transform", `translate(331 413.5) scale(${(1 + SETTLE * (1 - v)).toFixed(4)}) translate(-331 -413.5)`);
    });
    const ph = g.photo;
    const d = dinner.current;
    if (d) {
      d.setAttribute("x", ph.x.toFixed(1));
      d.setAttribute("y", ph.y.toFixed(1));
      d.setAttribute("width", ph.w.toFixed(1));
      d.setAttribute("height", ph.h.toFixed(1));
      d.style.opacity = q(SIGNALS.roomPhoto).toFixed(3);
    }

    // the window: the mark's foot, lit, then opening out to the full frame
    const split = c(SIGNALS.split);
    const W = win.current;
    if (W) {
      const r = lerpRect(footRect(g.cx, g.cy, m.room), g.window, c(SIGNALS.expand));
      box(W, r);
      W.style.opacity = p >= SIGNALS.glow[0] ? (1 - split).toFixed(3) : "0";
      if (winImg.current) box(winImg.current, { x: ph.x - r.x, y: ph.y - r.y, w: ph.w, h: ph.h });
      const [e0, e1] = SIGNALS.expand;
      if (amber.current) amber.current.style.opacity = (q(SIGNALS.glow) * (1 - q([e0, e0 + (e1 - e0) * 0.45]))).toFixed(3);
      const u = t(p, e0, e1);
      if (brass.current) brass.current.style.opacity = (4 * u * (1 - u)).toFixed(3);
    }

    // the three panels: they tile the window at the split, part, then each becomes its experience
    const gap = g.gap * split;
    const cw = (g.window.w - 2 * gap) / 3;
    const [k0, k1] = SIGNALS.cards;
    cards.current.forEach((el, i) => {
      if (!el) return;
      const x = g.window.x + i * (cw + gap);
      box(el, { x, y: g.window.y, w: cw, h: g.window.h });
      el.style.opacity = p > SIGNALS.split[0] ? "1" : "0";
      el.style.setProperty("--edge", q(SIGNALS.split).toFixed(3));
      const slice = el.querySelector<HTMLImageElement>("[data-slice]");
      if (slice) box(slice, { x: ph.x - x, y: ph.y - g.window.y, w: ph.w, h: ph.h });
      const s0 = k0 + i * SIGNALS.cardStep, s1 = k1 + i * SIGNALS.cardStep;
      const v = c([s0, s1]);
      el.style.setProperty("--photo-h", `${(100 - (1 - CARD_PHOTO) * 100 * v).toFixed(2)}%`);
      el.style.setProperty("--own", v.toFixed(3));
      const cap = easeQuad(t(p, s0 + (s1 - s0) * 0.4, s1));
      el.style.setProperty("--cap", cap.toFixed(3));
      el.style.pointerEvents = cap > 0.5 ? "" : "none";
    });
  }, []);

  const settle = useCallback(() => {
    const els = [intro.current, room.current, cue.current, win.current, winImg.current, ...topics.current, ...cards.current];
    els.forEach((el) => el?.removeAttribute("style"));
    cards.current.forEach((el) => el?.querySelector("[data-slice]")?.removeAttribute("style"));
  }, []);

  useTrackScrub(track, still, at, settle);

  return (
    <section id="signals" data-motif-track="signals" className={`c5 ${styles.signals}`}>
      <div className={styles.track} ref={track} style={{ "--track": `${TRACK_VH.signals}vh` } as CSSProperties}>
        {/* "The Room" lands here: the room fully composed (in still mode, just above it) */}
        <span
          id="room"
          className={styles.roomAnchor}
          style={{ "--at": `${((TRACK_VH.signals - 100) * SIGNALS.roomAt).toFixed(2)}vh` } as CSSProperties}
          aria-hidden="true"
        />
        <div className={styles.stage}>
          {/* the mark, and what it holds: the themes in its own frame, the dinner pinned to the screen */}
          <svg className={styles.mark} aria-hidden="true">
            <defs>
              <clipPath id={clip} clipPathUnits="userSpaceOnUse">
                {PIECES.map((k, i) => (
                  <path key={k} d={MONOGRAM[k]} ref={(el) => { clipPaths.current[i] = el; }} />
                ))}
              </clipPath>
            </defs>
            <g ref={markG} style={{ opacity: 0 }}>
              <g clipPath={`url(#${clip})`}>
                <g ref={glyphG}>
                  {TOPICS.map((tp, i) => (
                    <g key={tp.name} ref={(el) => { layers.current[i] = el; }} style={{ opacity: 0 }}>
                      {i === 0 && <rect width="662" height="827" fill="#0b0a17" />}
                      <image width="662" height="827" preserveAspectRatio="xMidYMid slice" href={tp.photo} />
                    </g>
                  ))}
                </g>
                <image ref={dinner} preserveAspectRatio="xMidYMid slice" href={DINNER} style={{ opacity: 0 }} />
              </g>
              <g ref={outline}>
                {PIECES.map((k) => (
                  <path key={k} d={MONOGRAM[k]} {...STROKE} />
                ))}
              </g>
            </g>
          </svg>

          {/* the window that opens from the mark's foot */}
          <div className={styles.win} ref={win} aria-hidden="true">
            <span className={styles.winPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={winImg} src={DINNER} alt="" decoding="async" />
            </span>
            <span className={styles.winBrass} ref={brass} />
            <span className={styles.winEdge} />
            <span className={styles.winAmber} ref={amber} />
          </div>

          {/* 02 · the intro */}
          <div className={`${styles.block} ${styles.intro}`} ref={intro}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>Real conversations</p>
              <h2 className={styles.introH2} data-reveal>
                <Lines lines={["Crypto compliance", "does not wait for", "the next conference."]} />
              </h2>
              <p className={styles.promise}>Know first. Understand faster. Act earlier.</p>
              <a className={`btn btn-brass ${styles.cta}`} href={CTA.href}>
                {CTA.label}
                <Icon name="arrow" className={styles.ctaIcon} />
              </a>
            </div>
            <figure className={styles.still} aria-hidden="true">
              <MotifGlyph className={`${styles.stillGlyph} ${styles.stillSmall}`} />
            </figure>
          </div>

          {/* the three themes, one at a time, each with its photograph in the mark */}
          {TOPICS.map((tp, i) => (
            <div key={tp.name} className={`${styles.block} ${styles.topic}`} ref={(el) => { topics.current[i] = el; }}>
              <div className={styles.copy}>
                <p className={styles.folio}>
                  <span>
                    {String(i + 1).padStart(2, "0")} / {String(TOPICS.length).padStart(2, "0")}
                  </span>
                  <i aria-hidden="true" />
                </p>
                <h3 className={styles.topicName}>{tp.name}</h3>
                <p className={styles.topicDesc}>{tp.desc}</p>
                <ul className={styles.tags} aria-label={tp.tagLabel}>
                  {tp.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <a className={styles.explore} href="#intelligence">
                  Explore our intelligence
                  <Icon name="arrow" className={styles.exploreIcon} />
                </a>
              </div>
              <figure className={styles.still} aria-hidden="true">
                <MotifGlyph className={styles.stillGlyph} photo={tp.photo} />
              </figure>
            </div>
          ))}

          {/* 03 · the room */}
          <div className={`${styles.block} ${styles.room}`} ref={room}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>The room</p>
              <h2 className={styles.roomH2} data-reveal>
                <Lines lines={["The event ends.", "The conversation", "should not."]} />
              </h2>
              <p className={styles.roomBody}>A community of pioneers, brought together in exceptional rooms for a reason.</p>
            </div>
            <figure className={styles.still} aria-hidden="true">
              <MotifGlyph className={styles.stillGlyph} photo={DINNER} />
            </figure>
          </div>

          {/* 04 · the experiences */}
          <ul className={styles.cards} aria-label="Experiences">
            {EXPERIENCES.map((x, i) => (
              <li key={x.name} className={styles.card} ref={(el) => { cards.current[i] = el; }}>
                <div className={styles.cardPhoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-slice className={styles.slice} src={DINNER} alt="" aria-hidden="true" decoding="async" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.own} src={x.photo} alt={x.alt} loading="lazy" decoding="async" />
                </div>
                <div className={styles.caption}>
                  <div>
                    <h3 className={styles.capName}>{x.name}</h3>
                    <p className={styles.capText}>{x.text}</p>
                  </div>
                  <a className={styles.capLink} href={CTA.href} aria-label={`${x.name}: ${CTA.label.toLowerCase()}`}>
                    <Icon name="arrow" className={styles.capIcon} />
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {/* the scroll cue, at the foot of the stage until the room clears */}
          <div className={styles.cue} ref={cue} aria-hidden="true">
            <i className={styles.cueRule} />
            <i className={styles.cueDot} />
            <span>Scroll</span>
            <Icon name="arrowDown" className={styles.cueIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}
