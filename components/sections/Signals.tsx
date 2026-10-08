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
import { INNER_LOOP } from "@/lib/motif";
import { footRect, lerpRect, markTransform, mixPose, signalsGeometry, type Rect } from "@/lib/signals";
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
    text: "Twelve seats. One topic everyone has a reason to care about.",
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
/** Figma: each experience's photograph takes the top 640 of the panel's 1392 */
const CARD_PHOTO = 640 / 1392;
/** a theme's photograph settles from this scale as it arrives */
const SETTLE = 0.06;

const box = (el: HTMLElement, r: Rect) => {
  el.style.left = `${r.x.toFixed(1)}px`;
  el.style.top = `${r.y.toFixed(1)}px`;
  el.style.width = `${r.w.toFixed(1)}px`;
  el.style.height = `${r.h.toFixed(1)}px`;
};

/**
 * 02 → 04 · one pinned track, after the Figma storyboard "The Vault — Scroll storyboard". The mark
 * arrives from the hero beside the intro; it grows to hold a photograph for each of the three themes,
 * filling its counter too, while their copy turns over on the left; the room's dinner replaces them
 * and the mark's foot starts to glow. Then the mark grows to the centre, its counter empties, and the
 * foot opens into a window that becomes the full photograph, divides into three panels, and each
 * panel becomes one of the experiences.
 *
 * Landscape screens and portrait screens place the beats differently (lib/signals.ts; the portrait
 * copy layout is in the CSS). On wide screens the motif layer hands the mark over at the pin
 * (lib/motif.ts) and this stage draws it from there at the same pose; on narrow ones the stage draws
 * it from the start. With reduced motion the beats stack: each theme and the room carry a static
 * mark with their photograph, and the experiences are three cards.
 */
export default function Signals() {
  const still = useStillMedia("(prefers-reduced-motion:reduce)");
  const ids = useId();
  const maskId = `${ids}mask`;
  const track = useRef<HTMLDivElement>(null);
  const markG = useRef<SVGGElement>(null);
  const maskPaths = useRef<(SVGPathElement | null)[]>([]);
  const counter = useRef<SVGPathElement>(null);
  const glyphG = useRef<SVGGElement>(null);
  const outline = useRef<SVGGElement>(null);
  const layers = useRef<(SVGGElement | null)[]>([]);
  const dinner = useRef<SVGImageElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const winImg = useRef<HTMLImageElement>(null);
  const amber = useRef<HTMLSpanElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const topics = useRef<(HTMLDivElement | null)[]>([]);
  const room = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  const at = useCallback((p: number) => {
    const vw = window.innerWidth;
    const g = signalsGeometry(vw, window.innerHeight);
    const q = (w: Window) => easeQuad(t(p, w[0], w[1]));
    const c = (w: Window) => easeCubic(t(p, w[0], w[1]));
    // copy arrives from below and leaves upwards
    const copy = (el: HTMLElement | null, vin: number, vout: number) => {
      if (!el) return;
      const v = vin * (1 - vout);
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translateY(${(16 * (1 - vin) - 16 * vout).toFixed(1)}px)`;
      el.style.setProperty("--pe", v < 0.5 ? "none" : "auto");
    };
    copy(intro.current, 1, q(SIGNALS.introOut));
    SIGNALS.topics.forEach((w, i) => copy(topics.current[i], q(w.in), q(w.out)));
    copy(room.current, q(SIGNALS.roomIn), q(SIGNALS.roomOut));
    if (cue.current) cue.current.style.opacity = (1 - q(SIGNALS.roomOut)).toFixed(3);

    // the mark: beside the intro, then holding the photographs, then grown to the centre. On wide
    // screens it shows from the pin, when the motif layer lets go of it; on narrow ones, throughout.
    const { intro: m0, topic: m1, focus: m2 } = g.mark;
    const pose = mixPose(mixPose(m0, m1, c(SIGNALS.grow)), m2, c(SIGNALS.focus));
    const tf = markTransform(pose);
    maskPaths.current.forEach((path) => path?.setAttribute("transform", tf));
    counter.current?.setAttribute("transform", tf);
    // the counter holds the photograph too, until the mark moves to the centre
    counter.current?.setAttribute("fill-opacity", (1 - q(SIGNALS.counterOut)).toFixed(3));
    glyphG.current?.setAttribute("transform", tf);
    outline.current?.setAttribute("transform", tf);
    if (markG.current) markG.current.style.opacity = p > 0 || vw < 900 ? (1 - q(SIGNALS.markOut)).toFixed(3) : "0";
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

    // the window: the mark's foot, glowing softly in the room and brighter as the mark centres,
    // then opening out to the full frame while the glow dies away
    const split = c(SIGNALS.split);
    const W = win.current;
    if (W) {
      const r = lerpRect(footRect(pose), g.window, c(SIGNALS.expand));
      box(W, r);
      W.style.opacity = p >= SIGNALS.glow[0] ? (1 - split).toFixed(3) : "0";
      if (winImg.current) box(winImg.current, { x: ph.x - r.x, y: ph.y - r.y, w: ph.w, h: ph.h });
      const [e0, e1] = SIGNALS.expand;
      const glow = (0.55 * q(SIGNALS.glow) + 0.45 * q(SIGNALS.flare)) * (1 - q([e0 + (e1 - e0) * 0.3, e1]));
      if (amber.current) {
        amber.current.style.opacity = glow.toFixed(3);
        // Figma: the inner light's blur is 18% of the window's width at every size
        amber.current.style.setProperty("--inner", `${(r.w * 0.18).toFixed(1)}px`);
      }
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
              <mask id={maskId} maskUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000">
                {PIECES.map((k, i) => (
                  <path key={k} d={MONOGRAM[k]} fill="#fff" ref={(el) => { maskPaths.current[i] = el; }} />
                ))}
                <path ref={counter} d={INNER_LOOP} fill="#fff" />
              </mask>
            </defs>
            <g ref={markG} style={{ opacity: 0 }}>
              <g mask={`url(#${maskId})`}>
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
            <span className={styles.winEdge} />
            <span className={styles.winAmber} ref={amber} />
          </div>

          {/* 02 · the intro */}
          <div className={`${styles.block} ${styles.intro}`} ref={intro}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>Real conversations</p>
              {/* the serif finds its own line breaks: five on a portrait screen, as the storyboard has it */}
              <h2 className={`c5-fade ${styles.introH2}`} data-reveal>
                Crypto compliance does not wait for the next conference.
              </h2>
              <p className={styles.promise}>Know first. Understand faster. Act earlier.</p>
            </div>
            <a className={`btn btn-brass ${styles.action} ${styles.cta}`} href={CTA.href}>
              {CTA.label}
              <Icon name="arrow" className={styles.ctaIcon} />
            </a>
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
                {/* the bar that would start a wrapped line is clipped by the frame round the list */}
                <div className={styles.tagsFrame}>
                  <ul className={styles.tags} aria-label={tp.tagLabel}>
                    {tp.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a className={`${styles.action} ${styles.explore}`} href="#intelligence">
                Explore our intelligence
                <Icon name="arrow" className={styles.exploreIcon} />
              </a>
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
                  <h3 className={styles.capName}>{x.name}</h3>
                  <p className={styles.capText}>{x.text}</p>
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
